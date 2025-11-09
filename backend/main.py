from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import login
from transformers import pipeline
from dotenv import load_dotenv
import textwrap
import os
import PyPDF2

# ------------------------------------------------------------
# 🔧 App setup
# ------------------------------------------------------------
app = FastAPI(title="Academic Summarizer API", version="1.0")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# 🔐 Load Hugging Face token
# ------------------------------------------------------------
load_dotenv()
token = os.getenv("HF_TOKEN")
if not token:
    raise ValueError("❌ Missing HF_TOKEN in .env")

login(token=token)

# ------------------------------------------------------------
# 🧠 Load summarization model
# ------------------------------------------------------------
print("🚀 Loading model... this may take a minute...")
summarizer = pipeline(
    "summarization",
    model="Aditya-devop/academica_summarizer",
    tokenizer="Aditya-devop/academica_summarizer",
    device_map="auto"
)
print("✅ Model loaded successfully!")

# ------------------------------------------------------------
# 🧩 Helper: Split and summarize text
# ------------------------------------------------------------
def summarize_text(text, max_chunk_len=1500):
    chunks = textwrap.wrap(text, max_chunk_len)
    summaries = []
    for i, chunk in enumerate(chunks, 1):
        print(f"⏳ Summarizing chunk {i}/{len(chunks)}")
        summary = summarizer(chunk, max_length=300, min_length=80, do_sample=False)[0]["summary_text"]
        summaries.append(summary.strip())
    return " ".join(summaries)

# ------------------------------------------------------------
# 📄 Helper: Extract text from PDF
# ------------------------------------------------------------
def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    return text

# ------------------------------------------------------------
# 🌐 API Routes
# ------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Academic Summarizer API is running!"}


@app.post("/summarize-text")
async def summarize_endpoint(text: str = Form(...)):
    """Summarize plain text sent from frontend"""
    summary = summarize_text(text)
    return {"summary": summary}


@app.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...)):
    """Summarize a PDF document"""
    file_path = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    with open(file_path, "rb") as pdf_file:
        text = extract_text_from_pdf(pdf_file)

    summary = summarize_text(text)
    return {"filename": file.filename, "summary": summary}

# ------------------------------------------------------------
# ▶️ Run: uvicorn main:app --reload
# ------------------------------------------------------------
