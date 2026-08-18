import math
import re
from typing import List, Dict, Any
from app.database import get_db

class MemoryVault:
    def __init__(self):
        self.short_term: List[Dict[str, str]] = []

    def add_short_term(self, role: str, content: str):
        self.short_term.append({"role": role, "content": content})
        if len(self.short_term) > 20:
            self.short_term.pop(0)

    def store_fact(self, text: str, tag: str = "LearnedFact", user_id: int = None) -> str:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM memory_vault")
            count = cursor.fetchone()[0]
            mem_id = f"mem_{count + 1:02d}"
            cursor.execute(
                "INSERT INTO memory_vault (id, user_id, tag, text) VALUES (?, ?, ?, ?)",
                (mem_id, user_id, tag, text)
            )
            conn.commit()
            return f"Saved fact to Vector Vault (ID: {mem_id})"

    def recall_relevant(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        all_mems = self.get_all_memories()
        query_words = set(re.findall(r'\w+', query.lower()))
        if not query_words:
            return all_mems[:top_k]

        scored = []
        for item in all_mems:
            item_words = set(re.findall(r'\w+', item["text"].lower()))
            overlap = len(query_words.intersection(item_words))
            score = overlap / math.sqrt(len(query_words) * len(item_words) + 1)
            if score > 0.04:
                scored.append((score, item))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [item for _, item in scored[:top_k]]
        return results if results else all_mems[:1]

    def get_all_memories(self) -> List[Dict[str, Any]]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, tag, text FROM memory_vault ORDER BY created_at DESC")
            rows = cursor.fetchall()
            return [{"id": r["id"], "tag": r["tag"], "text": r["text"]} for r in rows]
