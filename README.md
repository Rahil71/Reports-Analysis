# Reports Analysis  

Reports Analysis is a web application designed for analyzing reports and documents using AI-powered summarization and analysis. The project consists of a **React** frontend with **Tailwind CSS** and **Framer Motion**, and a **Flask** backend for handling data processing and AI-based text analysis.  

## 📂 Project Structure  

```
rahil71-reports-analysis/
├── client/                     # Frontend application
│   ├── public/                 
│   ├── src/                    
│   │   ├── App.jsx             
│   │   ├── index.css           
│   │   ├── main.jsx            
│   │   └── assets/             
│   ├── tailwind.config.js      
│   ├── vite.config.js          
│   └── package.json            
│
├── summarize/                  # Summarization sub-module
│   ├── src/                    
│   │   ├── components/         
│   │   │   ├── GradientButton.jsx  
│   │   │   └── PdfLoader.jsx   
│   ├── tailwind.config.js      
│   ├── vite.config.js          
│   └── package.json            
│
├── client-side-web/            # Another client version
│   ├── src/                    
│   │   ├── components/         
│   │   │   └── PdfLoader.jsx   
│   │   ├── pages/              
│   │   │   ├── Action.jsx      
│   │   │   ├── Hero.jsx        
│   │   │   └── Upload.jsx      
│   ├── tailwind.config.js      
│   ├── vite.config.js          
│   └── package.json            
│
├── flask-server/               # Backend API (Flask)
│   ├── gemini_openai.py        # OpenAI API integration
│   ├── grok_updated.py         # Grok AI implementation
│   ├── md_to_txt.py            # Markdown to text conversion
│   ├── server_gemini.py        # API server with Gemini AI
│   ├── server_groq.py          # API server with Grok AI
│   ├── uploaded_files/         # Uploaded report files
│   ├── rahil_doc_db/           # Document database (FAISS)
│   ├── faiss_index/            # FAISS index for document retrieval
│   ├── .gitignore              
│   └── test-mysql-connection.py # MySQL connectivity test
│
└── requirements.txt            # Python dependencies
```

## 🚀 Features  

- **AI-Powered Summarization** – Uses OpenAI, Grok, and Gemini AI models.  
- **Document Upload & Analysis** – Converts Markdown reports into plain text for processing.  
- **FastAPI & Flask Backend** – Handles AI model integration and data processing.  
- **React Frontend with Tailwind CSS & Framer Motion** – Provides a sleek UI with animations.  
- **FAISS Indexing for Document Retrieval** – Optimized search for uploaded reports.  
- **Multi-Client Frontends** – Separate implementations for different use cases.  

## 🛠 Installation  

### Backend (Flask Server)  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-repo/rahil71-reports-analysis.git
   cd rahil71-reports-analysis/flask-server
   ```

2. **Create a Virtual Environment (Optional but Recommended)**  
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. **Install Dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask Server**  
   ```bash
   python server_gemini.py  # or `python server_groq.py`
   ```

### Frontend (React)  

1. **Navigate to the Client Directory**  
   ```bash
   cd ../client
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Start the Development Server**  
   ```bash
   npm run dev
   ```

## 📌 Usage  

1. Upload a report (Markdown format).  
2. AI models analyze and summarize the report.  
3. View the summarized text with insights.  
4. Search for previously analyzed reports using FAISS indexing.  

## 📜 License  

This project is open-source and free to use.  