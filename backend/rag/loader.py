from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

def load_faiss():
    embedding = OpenAIEmbeddings()
    db = FAISS.load_local("urdu_book_index", embeddings=embedding, allow_dangerous_deserialization=True)
    return db.as_retriever()
