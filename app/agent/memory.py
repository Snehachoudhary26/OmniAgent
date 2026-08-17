import math
import re
from typing import List, Dict, Any

class MemoryVault:
    def __init__(self):
        # Short-term buffer (recent dialogue)
        self.short_term: List[Dict[str, str]] = []
        # Long-term memory documents (facts, knowledge, persistent user context)
        self.long_term: List[Dict[str, Any]] = [
            {
                "id": "mem_01",
                "tag": "Architecture",
                "text": "OmniAgent is a hybrid Agentic AI system using ReAct planning, RAG citations, and Human-in-the-Loop verification."
            },
            {
                "id": "mem_02",
                "tag": "Capabilities",
                "text": "Available tools: DuckDuckGo live web search, Python code sandbox execution, Math engine, and Vector RAG retrieval."
            },
            {
                "id": "mem_03",
                "tag": "Safety",
                "text": "High-impact actions such as file modifications, code execution, or irreversible external API calls require explicit human confirmation."
            }
        ]

    def add_short_term(self, role: str, content: str):
        self.short_term.append({"role": role, "content": content})
        if len(self.short_term) > 20:
            self.short_term.pop(0)

    def store_fact(self, text: str, tag: str = "LearnedFact"):
        mem_id = f"mem_{len(self.long_term) + 1:02d}"
        self.long_term.append({"id": mem_id, "tag": tag, "text": text})
        return f"Successfully saved to Long-Term Memory (ID: {mem_id})"

    def recall_relevant(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        # Lightweight term-frequency / semantic overlap scoring (no external paid embedding API required)
        query_words = set(re.findall(r'\w+', query.lower()))
        if not query_words:
            return self.long_term[:top_k]

        scored = []
        for item in self.long_term:
            item_words = set(re.findall(r'\w+', item["text"].lower()))
            overlap = len(query_words.intersection(item_words))
            score = overlap / math.sqrt(len(query_words) * len(item_words) + 1)
            if score > 0.05:
                scored.append((score, item))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = [item for _, item in scored[:top_k]]
        return results if results else self.long_term[:1]

    def get_all_memories(self) -> List[Dict[str, Any]]:
        return self.long_term
