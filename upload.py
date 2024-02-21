import streamlit as st
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
# from langchain import HuggingFacePipeline, PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
# from langchain.embeddings import HuggingFaceInstructEmbeddings
# from langchain_community.embeddings import HuggingFaceInstructEmbeddings
from dotenv import load_dotenv

load_dotenv()
os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
def get_pdf_text_from_folder(folder_path):
    text = ""
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            filepath = os.path.join(folder_path, filename)
            pdf_reader = PdfReader(filepath)
            for page in pdf_reader.pages:
                text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=64)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    # embeddings = HuggingFaceInstructEmbeddings(
    # model_name="hkunlp/instructor-large"
    # )
    # embeddings = HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-xl")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

if __name__ == "__main__":
    # Example usage:
    load_dotenv()
    pdf_folder_path = "pdf"  # Assuming the PDF folder is named "pdf" in the same directory
    pdf_folder_full_path = os.path.join(os.path.dirname(__file__), pdf_folder_path)
    raw_text = get_pdf_text_from_folder(pdf_folder_full_path)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)
