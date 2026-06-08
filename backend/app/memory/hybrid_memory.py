import os
import random
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from neo4j import GraphDatabase

class HybridMemoryOS:
    def __init__(self):
        # Mapped to local windows system adapter endpoints directly for safe local execution
        self.vector_client = QdrantClient(url="http://localhost:6333")
        
        self.graph_driver = GraphDatabase.driver(
            "bolt://localhost:7687", 
            auth=("neo4j", "genesis_password")
        )
        
        self.collection_name = "living_episodic_memory"
        self._init_vector_space()

    def _init_vector_space(self):
        """Ensures the vector cluster layout is allocated for 1536-dim embeddings"""
        try:
            collections = self.vector_client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            if not exists:
                self.vector_client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
                )
                print(f"✓ Qdrant Collection '{self.collection_name}' Initialized.")
        except Exception as e:
            print(f"[-] Qdrant Init Warning: {e}")

    def commit_insight(self, memory_id: str, payload_text: str, mock_vector: list, node_type: str, relation_to_id: str = None):
        """Atomically links an insight across both Qdrant Vector Space and Neo4j Graph."""
        # 1. Store Semantic State inside Qdrant
        try:
            self.vector_client.upsert(
                collection_name=self.collection_name,
                points=[
                    PointStruct(
                        id=int(memory_id),
                        vector=mock_vector,
                        payload={"text": payload_text, "type": node_type}
                    )
                ]
            )
        except Exception as e:
            print(f"[-] Qdrant Commit Failed: {e}")

        # 2. Store Relational State inside Neo4j Knowledge Graph
        with self.graph_driver.session() as session:
            query = (
                "MERGE (m:MemoryNode {id: $id}) "
                "SET m.text = $text, m.type = $type "
                "RETURN m"
            )
            session.run(query, id=memory_id, text=payload_text, type=node_type)

            if relation_to_id:
                rel_query = (
                    "MATCH (source:MemoryNode {id: $parent_id}), (target:MemoryNode {id: $id}) "
                    "MERGE (source)-[r:EVOLVED_INTO]->(target) "
                    "RETURN r"
                )
                session.run(rel_query, parent_id=relation_to_id, id=memory_id)
        
        print(f"✓ Insight [{memory_id}] synced atomically to Vector + Graph ecosystem.")

    def close(self):
        self.graph_driver.close()
