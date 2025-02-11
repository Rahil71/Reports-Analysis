from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
import pandas as pd
import re
import mysql.connector
from llama_parse import LlamaParse
from langchain.text_splitter import SpacyTextSplitter

# Data config
def get_collection_names():
    collections = pd.read_csv("data.csv").to_dict("list")["collection_name"]
    return collections

def save_data_to_db(file_name, col_name, txt_file_name):
    try:
        df = pd.read_csv("data.csv")
        df1 = pd.DataFrame(
            [[file_name, col_name, txt_file_name]],
            columns=['file_name', 'collection_name', 'text_file_path']
        )
        df = pd.concat([df, df1], ignore_index=True)  # Reset index after concatenation
        df.to_csv("data.csv", index=False)  # Prevent the index from being saved
        return True
    except Exception as e:
        print(f"Error: {e}")  # Added for debugging
        return False

# Database configuration
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="Rahil",
        password="R@hil71*",
        database="projectstore"
    )

# Check if a response exists in the database
def get_cached_response(collection_name, response_type):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT response_text FROM document_responses
            WHERE collection_name = %s AND response_type = %s
        """
        cursor.execute(query, (collection_name, response_type))
        result = cursor.fetchone()
        conn.close()
        return result['response_text'] if result else None
    except Exception as e:
        print(f"Error fetching cached response: {e}")
        return None

# Cache a new response in the database
def cache_response(collection_name, response_type, response_text):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO document_responses (collection_name, response_type, response_text)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (collection_name, response_type, response_text))
        conn.commit()
        conn.close()
        print("Response cached successfully.")
    except Exception as e:
        print(f"Error caching response: {e}")

# Flask app configuration
app = Flask(__name__)
CORS(app)
app.secret_key = "your_secret_key"

# AI Configuration
api_key_cycle = os.getenv("GEMINI_API_KEY")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
text_splitter = SpacyTextSplitter(chunk_size=3500, chunk_overlap=500)
PERSIST_DIR = "rahil_doc_db"
llm = ChatGroq(model_name="llama-3.3-70b-versatile", groq_api_key=os.getenv("GROQ_API_KEY"))

def sanitize_collection_name(file_name):
    # Ensure file name is alphanumeric and remove special characters
    sanitized_name = re.sub(r"[^a-zA-Z0-9]", "", file_name)
    
    # Handle file names shorter than 3 characters
    if len(sanitized_name) < 3:
        sanitized_name = f"{sanitized_name}XX"
    
    # Truncate file names longer than 63 characters
    if len(sanitized_name) > 63:
        sanitized_name = sanitized_name[:50]  # First 50 characters

    # Append a unique number to avoid collisions for truncated names
    # counter = 1
    unique_name = sanitized_name
    # while os.path.exists(f"uploaded_files/{unique_name}.md"):  # Ensure unique file name
    #     unique_name = f"{sanitized_name}{counter}"
    #     counter += 1

    return unique_name


def process_pdf_data(file_path, file_name):
    batch_size = 10
    col_name = sanitize_collection_name(file_name.split(".")[0])  # Use sanitized name
    md_file_path = f"uploaded_files/{col_name}.md"
    
    if os.path.exists(md_file_path):
        print("Markdown file already exists. Skipping processing.")
        return True

    try:
        # Set LlamaParse API key using environment variable
        llama_api_key = os.getenv("LLAMA_CLOUD_API_KEY")
        if not llama_api_key:
            raise ValueError("LLAMA_CLOUD_API_KEY environment variable not set.")

        # Initialize LlamaParse
        llama = LlamaParse(result_type="markdown", api_key=llama_api_key)
        print("Initialized LlamaParse successfully.")

        # Load the entire document
        document = llama.load_data(file_path)

        # Get the total number of pages
        total_pages = len(document)
        print(f"Total pages in PDF: {total_pages}")

        combined_markdown = ""

        # Process PDF in batches (split manually)
        for start_page in range(0, total_pages, batch_size):
            end_page = min(start_page + batch_size, total_pages)
            print(f"Processing pages {start_page+1} to {end_page}...")

            # Select pages for this batch
            batch_document = document[start_page:end_page]

            # Combine text from the processed pages
            for idx, page in enumerate(batch_document, start=start_page+1):
                page_text = page.text
                page_number = f"### Page {idx}\n"  # Add the page number
                combined_markdown += page_number + "\n" + page_text + "\n\n"

        # Save the combined markdown text to a file
        with open(md_file_path, 'w', encoding='utf-8') as file:
            file.write(combined_markdown)

        print("Markdown file created successfully.")

        # Load and split the extracted markdown content
        documents = TextLoader(md_file_path, encoding="utf-8").load()
        chunks = text_splitter.split_documents(documents)
        print(f"Total chunks generated --> {len(chunks)}")

        # Save the chunks to ChromaDB
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=PERSIST_DIR,
            collection_name=col_name
        )
        print("Saved to Vector DB")

        # Save metadata to the database (data.csv)
        if save_data_to_db(file_name, col_name, md_file_path):
            return True

    except Exception as e:
        print(f"Error during processing: {e}")
        return False


# LLM response generator
def get_llm_response(question, col_name):
    vectorstore = Chroma(persist_directory=PERSIST_DIR, collection_name=col_name, embedding_function=embeddings)
    data = vectorstore.similarity_search(question, k=7)
    for i, chunk in enumerate(data, start=1):
        print(f"Chunk {i}:")
        print(chunk.page_content)
        print("\n" + "-"*50 + "\n")
    text_data = "\n".join(page.page_content for page in data)

    messages = [
        (
            "system",
            "Answer the question as detailed as possible from the provided context in markdown format. Ensure the tables are properly formatted with correct alignment, no escaped characters (e.g., \n), and adhere to Markdown standards. If the answer isn't in the context, respond: 'Answer doesn't exist in the given knowledge base.' Avoid using unnecessary newline escape sequences or formatting that may not render properly."

        ),
        ("human", f"<Context>{text_data}</Context> Question: {question}"),
    ]
    ai_msg = llm.invoke(messages)
    print(ai_msg)
    return ai_msg.content

# API endpoints
@app.route("/upload", methods=["POST"])
def upload_files():
    if "file" in request.files:
        f = request.files['file']
        file_path = os.path.join("uploaded_files", f.filename)

        if not os.path.exists(file_path):
            f.save(file_path)
            print("File saved successfully.")

        if process_pdf_data(file_path, f.filename):
            return jsonify({"message": "File uploaded and processed successfully."}), 201
        return jsonify({"message": "File processing failed."}), 400

    return jsonify({"message": "No files uploaded."}), 400

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        collection_name = request.form.get("collection")
        if not collection_name:
            return jsonify({"error": "Collection name is required."}), 400

        cached_summary = get_cached_response(collection_name, "summary")
        if cached_summary:
            return jsonify({"summary": cached_summary}), 200

        question = "Provide a detailed summary of the document's contents, highlighting its key points, main ideas, and any critical information."
        summary_response = get_llm_response(question, collection_name)
        cache_response(collection_name, "summary", summary_response)
        return jsonify({"summary": summary_response}), 200
    except Exception as e:
        print(f"Error in summarization: {e}")
        return jsonify({"error": "An error occurred during summarization."}), 500

@app.route("/explain-tables", methods=["POST"])
def explain_tables_route():
    try:
        collection_name = request.form.get("collection")
        if not collection_name:
            return jsonify({"error": "Collection name is required."}), 400

        cached_explanation = get_cached_response(collection_name, "table_explanation")
        if cached_explanation:
            return jsonify({"table_explanation": cached_explanation}), 200

        question = "Analyze each table in detail and provide a comprehensive explanation of all the numerical data presented in every row and column. For each table, describe what the numbers represent and explain their significance in the context of the report. Highlight any patterns, trends, or relationships observed within the data. Additionally, elaborate on the meaning and relevance of each value using clear English sentences, ensuring that no table or any part of its data is overlooked in the analysis."
        table_explanation = get_llm_response(question, collection_name)
        cache_response(collection_name, "table_explanation", table_explanation)
        return jsonify({"table_explanation": table_explanation}), 200
    except Exception as e:
        print(f"Error in explaining tables: {e}")
        return jsonify({"error": "An error occurred while explaining tables."}), 500

@app.route("/query", methods=["POST"])
def query():
    user_question = request.form.get("user_question", "")
    collection_name = request.form.get("collection")
    if user_question:
        answer = get_llm_response(user_question, collection_name)
        return jsonify({"answer": answer}), 200
    return jsonify({"error": "No question provided."}), 400

@app.route("/get_collection_names", methods=["POST"])
def get_collections():
    data = get_collection_names()
    return jsonify({"data": data}), 200

if __name__ == "__main__":
    app.run(debug=True, port=8080)