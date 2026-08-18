import os
import json
import time
import re
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.agent.schemas import QueryRequest, ApprovalDecision
from app.agent.react_engine import ReActAgentEngine

app = FastAPI(
    title="OmniAgent Studio",
    description="Full-Stack Autonomous Agentic AI Workspace with Live Observability & Human-in-the-Loop",
    version="2.0.0"
)

# Initialize Core Agent Engine
agent_engine = ReActAgentEngine()

# Mount Static Files (HTML, CSS, JS)
static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
async def get_index():
    index_path = os.path.join(static_dir, "index.html")
    return FileResponse(index_path)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "OmniAgent Autonomous Core",
        "version": "2.0.0",
        "tools_count": len(agent_engine.tool_registry.tools),
        "free_mode": True
    }

@app.get("/api/tools")
async def list_tools():
    return agent_engine.tool_registry.tools

@app.get("/api/memory")
async def get_memories():
    return agent_engine.memory_vault.get_all_memories()

@app.post("/api/memory")
async def add_memory(payload: dict):
    text = payload.get("text", "")
    tag = payload.get("tag", "CustomFact")
    if not text:
        raise HTTPException(status_code=400, detail="Text field required")
    res = agent_engine.memory_vault.store_fact(text, tag)
    return {"status": "saved", "message": res}

# ➕ Add-On 4: Document File Upload & Chunk Ingestion Endpoint
@app.post("/api/memory/upload")
async def upload_document_memory(file: UploadFile = File(...)):
    try:
        content_bytes = await file.read()
        text_content = content_bytes.decode("utf-8", errors="ignore").strip()
        
        if not text_content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # Chunk text into clean semantic paragraphs
        raw_chunks = [c.strip() for c in re.split(r'\n\s*\n', text_content) if len(c.strip()) > 15]
        if not raw_chunks:
            raw_chunks = [text_content[:300]]

        clean_filename = file.filename if file.filename else "Document"
        tag_name = f"Doc:{clean_filename[:20]}"
        
        saved_count = 0
        for chunk in raw_chunks[:8]:  # Index top chunks
            agent_engine.memory_vault.store_fact(chunk, tag=tag_name)
            saved_count += 1

        return {
            "status": "indexed",
            "filename": clean_filename,
            "chunks_indexed": saved_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

# ➕ Live Python Code Sandbox Endpoint
@app.post("/api/code/run")
async def run_live_code(payload: dict):
    code = payload.get("code", "")
    if not code.strip():
        raise HTTPException(status_code=400, detail="No code provided.")
    
    t0 = time.perf_counter()
    result = agent_engine.tool_registry._run_python_sandbox(code)
    exec_time = round((time.perf_counter() - t0) * 1000, 2)
    
    return {
        "output": result.get("output", ""),
        "execution_ms": exec_time,
        "status": "success" if "Exception" not in result.get("output", "") else "error"
    }

@app.post("/api/approve")
async def process_approval(decision: ApprovalDecision):
    results = agent_engine.resume_approved_task(
        task_id=decision.task_id,
        approved=decision.approved,
        feedback=decision.feedback
    )
    return {"status": "processed", "steps": results}

@app.websocket("/ws/agent")
async def websocket_agent_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            prompt = data.get("prompt", "")
            api_key = data.get("api_key", None)
            model_provider = data.get("model_provider", "free-gemini")

            if not prompt:
                await websocket.send_json({"error": "Empty prompt received."})
                continue

            # Stream ReAct steps in real-time
            async for step_packet in agent_engine.run_react_stream(
                prompt=prompt,
                api_key=api_key,
                model_provider=model_provider
            ):
                await websocket.send_json(step_packet)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"error": f"Internal agent exception: {str(e)}"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
