import sqlite3
import hashlib
import os
from typing import Optional, Dict, Any, List

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "omniagent.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        # 1. Users Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'developer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 2. Persistent Vector Vault Memory Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS memory_vault (
                id TEXT PRIMARY KEY,
                user_id INTEGER,
                tag TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 3. Chat Session & Reasoning Trajectories
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_sessions (
                id TEXT PRIMARY KEY,
                user_id INTEGER,
                prompt TEXT NOT NULL,
                synthesis TEXT,
                tokens_processed INTEGER DEFAULT 0,
                latency_ms REAL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def create_user(username: str, email: str, password: str, role: str = "developer") -> Dict[str, Any]:
    pwd_hash = hash_password(password)
    with get_db() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
                (username, email, pwd_hash, role)
            )
            conn.commit()
            return {"status": "success", "user_id": cursor.lastrowid, "username": username, "role": role}
        except sqlite3.IntegrityError:
            return {"status": "error", "message": "Username or Email already exists."}

def authenticate_user(identifier: str, password: str) -> Optional[Dict[str, Any]]:
    pwd_hash = hash_password(password)
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE (username = ? OR email = ?) AND password_hash = ?",
            (identifier, identifier, pwd_hash)
        )
        row = cursor.fetchone()
        if row:
            return {"id": row["id"], "username": row["username"], "email": row["email"], "role": row["role"]}
    return None

# Seed default initial memories if empty
def seed_default_memories():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM memory_vault")
        if cursor.fetchone()[0] == 0:
            defaults = [
                ("mem_01", "Architecture", "OmniAgent is a hybrid Agentic AI system using ReAct planning, RAG citations, and Human-in-the-Loop verification."),
                ("mem_02", "Capabilities", "Available tools: DuckDuckGo live web search, Python code sandbox execution, Math engine, and Vector RAG retrieval."),
                ("mem_03", "Safety", "High-impact actions such as file modifications, code execution, or irreversible external API calls require explicit human confirmation.")
            ]
            for m_id, tag, text in defaults:
                cursor.execute("INSERT INTO memory_vault (id, tag, text) VALUES (?, ?, ?)", (m_id, tag, text))
            conn.commit()

init_db()
seed_default_memories()
