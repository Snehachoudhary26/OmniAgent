from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class StepType(str, Enum):
    GOAL = "goal"
    THOUGHT = "thought"
    ACTION = "action"
    OBSERVATION = "observation"
    APPROVAL_REQUIRED = "approval_required"
    REFLECT = "reflect"
    FINAL_ANSWER = "final_answer"
    ERROR = "error"

class Citation(BaseModel):
    id: int
    source_title: str
    source_url: str
    snippet: str

class AgentStep(BaseModel):
    step_number: int
    step_type: StepType
    title: str
    content: str
    tool_name: Optional[str] = None
    tool_args: Optional[Dict[str, Any]] = None
    tool_result: Optional[str] = None
    citations: Optional[List[Citation]] = Field(default_factory=list)
    requires_approval: bool = False
    timestamp: float = 0.0

class QueryRequest(BaseModel):
    prompt: str
    api_key: Optional[str] = None
    model_provider: Optional[str] = "free-gemini"
    session_id: Optional[str] = "default_session"

class ApprovalDecision(BaseModel):
    task_id: str
    approved: bool
    feedback: Optional[str] = None

class ObservabilityMetrics(BaseModel):
    total_tokens: int = 0
    prompt_tokens: int = 0
    completion_tokens: int = 0
    estimated_cost_usd: float = 0.0
    latency_ms: float = 0.0
    steps_count: int = 0
    active_tools_used: List[str] = Field(default_factory=list)
