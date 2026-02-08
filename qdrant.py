from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer

class QdrantCRUD:
    def __init__(self, host="localhost", port=6333, collection="roadmaps"):
        self.client = QdrantClient(host=host, port=port)
        self.collection_name = collection
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

        # Agar collection nahi hai toh create karo
        if not self.client.collection_exists(self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE)
            )

    def add_roadmap(self, user_id: int, roadmap_text: str):
        """Roadmap ko vectorize karke Qdrant me store karega"""
        vector = self.model.encode(roadmap_text).tolist()
        self.client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=user_id, vector=vector, payload={"user_id": user_id, "roadmap": roadmap_text})]
        )
        return {"status": "inserted", "user_id": user_id}

    def search_similar(self, query_text: str, limit: int = 3):
        """Similar roadmap search karega"""
        vector = self.model.encode(query_text).tolist()
        result = self.client.query_points(
            collection_name=self.collection_name,
            query=vector,
            limit=limit
        )
        return result

    def delete_roadmap(self, user_id: int):
        """Roadmap ko delete karega Qdrant se"""
        self.client.delete(
            collection_name=self.collection_name,
            points_selector={"points": [user_id]}
        )
        return {"status": "deleted", "user_id": user_id}
