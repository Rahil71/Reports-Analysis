from flask import Flask, request, jsonify, session
from flask_cors import CORS
from PyPDF2 import PdfReader
import os
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
import speech_recognition as sr
from langchain_groq import ChatGroq
from langchain.chains import StuffDocumentsChain
from langchain.chains.llm import LLMChain

app = Flask(__name__)
CORS(app)
app.secret_key = "your_secret_key"

extracted_text = ""

# Load the API key from the environment variable
api_key_cycle = os.getenv("GEMINI_API_KEY")

# Function to configure API with a specific key
def configure_api():
    api_key = api_key_cycle
    genai.configure(api_key=api_key)
    return api_key

# Function to extract text from multiple uploaded PDF files
def get_pdf_text(pdf_files):
    text = ""
    for pdf_file in pdf_files:
        pdf_reader = PdfReader(pdf_file)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text

# Function to split text into chunks
def get_text_chunks(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=500)
    return splitter.split_text(text)

# Function to generate vector store for text chunks
def get_vector_store(chunks):
    api_key = configure_api()
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
    vector_store = FAISS.from_texts(chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

# Conversational chain using Llama model via Groq
def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details.
    If the answer is not in the provided context, don't provide the wrong answer.\n\n
    Context:\n {context}?\n
    Question: \n{question}\n
    Answer:
    """
    model = ChatGroq(model_name="llama-3.1-70b-versatile", groq_api_key=os.getenv("GROQ_API_KEY"))
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    
    # Create an LLMChain first
    llm_chain = LLMChain(llm=model, prompt=prompt)
    
    # Specify a document variable name (for example, "context")
    chain = StuffDocumentsChain(llm_chain=llm_chain, document_variable_name="context")
    
    return chain



# Function to handle user queries and provide responses
def user_input(user_question):
    api_key = configure_api()
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain.invoke({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response.get("output_text", "Sorry, I couldn't find an answer to your question.")

# Function to summarize PDF content
def summarize_text():
    summary_prompt = "Summarize the contents of the PDF document."
    return user_input(summary_prompt)

# Function to explain tables in PDF content
def explain_tables():
    table_prompt = "Explain the tables present in the PDF documents with details on their contents and significance."
    return user_input(table_prompt)

# Function to search PDF content based on exact text matches
def pdf_content_search(text, search_query):
    results = []
    lines = text.splitlines()
    for line in lines:
        if search_query.lower() in line.lower():
            results.append(line.strip())
    if not results:
        results = ["No matches found for the search query."]
    return results
# Function to convert voice input to text
def get_voice_input():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        try:
            print("Listening... Please speak your question.")
            audio = recognizer.listen(source, timeout=10)
            query = recognizer.recognize_google(audio)
            print(f"Voice input recognized: {query}")
            return query
        except sr.UnknownValueError:
            return "Could not understand the audio."
        except sr.RequestError as e:
            return f"Speech recognition service error: {e}"
        except Exception as e:
            return f"Error: {e}"

@app.route("/upload", methods=["POST"])
def upload_files():
    global extracted_text
    if "pdf_files" in request.files:
        pdf_files = request.files.getlist("pdf_files")
        file_names = [file.filename for file in pdf_files]
        session["uploaded_files"] = file_names
        extracted_text = get_pdf_text(pdf_files)
        chunks = get_text_chunks(extracted_text)
        get_vector_store(chunks)
        return jsonify({"message": "Files uploaded and processed successfully.", "uploaded_files": file_names})
    return jsonify({"error": "No files uploaded."}), 400


@app.route("/summarize", methods=["POST"])
def summarize():
    action = request.form.get("action", "Summarize")
    print(f"Action: {action}")
    return jsonify({"summary": summarize_text()})


@app.route("/explain-tables", methods=["POST"])
def explain_tables_route():
    action = request.form.get("action", "ExplainTables")
    print(f"Action: {action}")
    return jsonify({"table_explanation": explain_tables()})


@app.route("/query", methods=["POST"])
def query():
    user_question = request.form.get("user_question", "")
    if user_question:
        answer = user_input(user_question)
        return jsonify({"answer": answer})
    return jsonify({"error": "No question provided."}), 400


@app.route("/search", methods=["POST"])
def search():
    search_query = request.form.get("search_query", "")
    if search_query:
        results = pdf_content_search(extracted_text, search_query)
        return jsonify({"search_results": results})
    return jsonify({"error": "No search query provided."}), 400


@app.route("/voice-input", methods=["POST"])
def voice_input():
    voice_query = get_voice_input()
    if voice_query:
        answer = user_input(voice_query)
        return jsonify({"voice_query": voice_query, "answer": answer})
    return jsonify({"error": "Could not process voice input."})


if __name__ == "__main__":
    app.run(debug=True, port=8080)