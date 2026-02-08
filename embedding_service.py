# services/embedding_service.py

from sentence_transformers import SentenceTransformer

# ✅ Pre-trained embedding model (384-dim output)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
