from qdrant_client import QdrantClient
from qdrant_client.http import models
import uuid

# Step 1: Connect to Qdrant
client = QdrantClient("http://localhost:6333")

# Step 2: Define collection name
collection_name = "user_roadmaps"

# Step 3: Recreate collection (vector-free)
if client.collection_exists(collection_name):
    print(f"🗑️ Deleting existing collection: {collection_name}")
    client.delete_collection(collection_name)

print(f"✅ Creating collection: {collection_name}")
client.create_collection(
    collection_name=collection_name,
    vectors_config=models.VectorParams(size=4, distance=models.Distance.COSINE),  # No vector required
)

# Step 4: Insert a point (empty vector allowed)
client.upsert(
    collection_name=collection_name,
    points=[
        models.PointStruct(
            id=str(uuid.uuid4()),
            vector=[0.0, 0.0, 0.0, 0.0],  # ✅ Empty vector because we don't use embeddings
            payload={"user_id": "123", "roadmap": "ML Roadmap"}
        )
    ]
)

# Step 5: Fetch all points
points, _ = client.scroll(collection_name=collection_name, limit=10)
print("Inserted Records:", points)
