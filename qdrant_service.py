from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
from sentence_transformers import SentenceTransformer
import uuid
from qdrant_client.http import models as qmodels
from qdrant_client.http.models import Record

# Qdrant client init
qdrant_client = QdrantClient(url="http://localhost:6333")

COLLECTION_NAME = "roadmaps"
USER_COLLECTION = "user_roadmaps"

# HuggingFace embeddings model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
VECTOR_SIZE = 384  # MiniLM-L6-v2 embedding size


# ------------------------------
# INIT COLLECTIONS
# ------------------------------
def init_qdrant_collection():
    try:
        if not qdrant_client.collection_exists(COLLECTION_NAME):
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
            )
            print(f"✅ Qdrant collection '{COLLECTION_NAME}' created with vector size {VECTOR_SIZE}.")
        else:
            print(f"ℹ️ Qdrant collection '{COLLECTION_NAME}' already exists.")
    except Exception as e:
        print(f"⚠️ Qdrant initialization failed: {e}")


def init_user_roadmaps_collection():
    try:
        if qdrant_client.collection_exists(USER_COLLECTION):
            print(f"🗑️ Deleting existing collection: {USER_COLLECTION}")
            qdrant_client.delete_collection(USER_COLLECTION)

        qdrant_client.create_collection(
            collection_name=USER_COLLECTION,
            vectors_config=None  # ✅ No vector field required
        )
        print(f"✅ Created '{USER_COLLECTION}' collection without vectors.")
    except Exception as e:
        print(f"⚠️ Failed to init '{USER_COLLECTION}': {e}")


# ------------------------------
# INSERT ROADMAP
# ------------------------------
def insert_roadmap(user_id: str, vector: list, roadmap_data: dict):
    """Insert roadmap into 'roadmaps' collection."""
    try:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                PointStruct(
                    id=str(uuid.uuid4()),  # unique point ID
                    vector=vector,
                    payload={"user_id": user_id, "roadmap": roadmap_data}
                )
            ]
        )
        print(f"✅ Roadmap inserted into Qdrant for user_id={user_id} (vector length={len(vector)})")
    except Exception as e:
        print(f"⚠️ Failed to insert roadmap in Qdrant: {e}")


# ------------------------------
# INSERT USER → ROADMAP MAPPING
# ------------------------------
def insert_user_roadmap(user_id: str, roadmap_id: str, prompt: str):
    try:
        qdrant_client.upload_records(
            collection_name=USER_COLLECTION,
            records=[
                Record(
                    id=str(uuid.uuid4()),  # ✅ Unique ID
                    payload={
                        "user_id": user_id,
                        "roadmap_id": roadmap_id,
                        "prompt": prompt
                    }
                )
            ]
        )
        print(f"✅ User-roadmap mapping inserted (user_id={user_id}, roadmap_id={roadmap_id})")
    except Exception as e:
        print(f"⚠️ Failed to insert user_roadmap in Qdrant: {e}")

# ------------------------------
# SEARCH FUNCTIONS
# ------------------------------
def search_roadmaps(query: str, top_k: int = 3):
    """Search roadmaps collection using embeddings."""
    try:
        query_vector = embedding_model.encode(query).tolist()
        results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=top_k
        )
        return [{"score": r.score, "payload": r.payload} for r in results]
    except Exception as e:
        print(f"⚠️ Qdrant search failed: {e}")
        return []
