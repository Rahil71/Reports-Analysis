from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
import pdfplumber
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
import pandas as pd

# Data config
def get_collection_names():
    collections=pd.read_csv("data.csv").to_dict("list")["collection_name"]
    return collections

def save_data_to_db(file_name,col_name,txt_file_name):
    try:
        df=pd.read_csv("data.csv")
        df1=pd.DataFrame([[file_name,col_name,txt_file_name]], columns=['file_name','collection_name','text_file_path'])
        df=pd.concat([df,df1])
        df.to_csv("data.csv")
        return True
    except:
        return False
    
############################## Flask Config
app = Flask(__name__)
CORS(app)
app.secret_key = "your_secret_key"

# AI config
api_key_cycle = os.getenv("GEMINI_API_KEY")
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key_cycle)
text_splitter = CharacterTextSplitter(separator="\n",chunk_size=3000,chunk_overlap=500)
PERSIST_DIR = "rahil_doc_db"
llm = ChatGroq(model_name="llama-3.1-70b-versatile", groq_api_key=os.getenv("GROQ_API_KEY"))

def process_pdf_data(file_path,file_name):
    pdf=pdfplumber.open(file_path)
    col_name=file_name.split(".")[0].replace("-","_")
    f=open("uploaded_files/"+col_name+".txt","a",encoding="utf-8")
    for page in range(len(pdf.pages)):
        f.write(pdf.pages[page].extract_text())
    f.close()
    documents=TextLoader("uploaded_files/"+col_name+".txt",encoding="utf-8").load()
    chunks=text_splitter.split_documents(documents)
    print("Total chunks generated --> ",len(chunks))
    vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=PERSIST_DIR,
    collection_name=col_name
    )
    print("Saved to Vector DB")
    if save_data_to_db(file_name,col_name,"uploaded_files/"+col_name+".txt"):
        return True
    return False


def get_llm_response(question:str,col_name:str):
    vectorstore=Chroma(persist_directory=PERSIST_DIR,collection_name=col_name, embedding_function=embeddings)
    data=vectorstore.similarity_search(question)
    print("Got data from Vector DB")
    text_data=""
    for page in data:
        text_data+=page.page_content+"\n"

    messages = [
    (
        "system",
        "Answer the question as detailed as possible from the provided context, make sure to provide all the details. If you dont find the answer in the context simply return Answer doesnt exist in the given knowledge base"
    ),
    ("human", '''
    <Context>{context}</Context>
    Question: {question}
        '''.format(context=data,question=question)),
    ]
    ai_msg = llm.invoke(messages)
    print("Got LLM response")
    return ai_msg.content

# API config

@app.route("/upload", methods=["POST"])
def upload_files():
    if "file" in request.files:
        f = request.files['file']
        file_path=os.path.join("uploaded_files",f.filename)
        f.save(file_path)
        if process_pdf_data(file_path,f.filename):
            return jsonify({"message": "Files uploaded and processed successfully..."}),201
        return jsonify({"message": "File was unable to process...."}),400
    return jsonify({"message": "No files uploaded...."}),400


@app.route("/summarize", methods=["POST"])
def summarize():
    pass


@app.route("/explain-tables", methods=["POST"])
def explain_tables_route():
    pass

@app.route("/query", methods=["POST"])
def query():
    user_question = request.form.get("user_question", "")
    collection_name=request.form.get("collection")
    if user_question:
        answer = get_llm_response(user_question,collection_name)
        return jsonify({"answer": answer}),200
    return jsonify({"error": "No question provided."}), 400

@app.route("/get_collection_names",methods=["GET"])
def get_collections():
    data=get_collection_names()
    return jsonify({"data":data}),200


if __name__== "__main__":
    app.run(debug=True, port=8080)