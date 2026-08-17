import time
from typing import List, Dict, Any
from app.agent.schemas import ObservabilityMetrics

class ObservabilityTracer:
    def __init__(self):
        self.start_time: float = 0.0
        self.end_time: float = 0.0
        self.prompt_tokens: int = 0
        self.completion_tokens: int = 0
        self.tools_used: List[str] = []
        self.steps_log: List[Dict[str, Any]] = []

    def start_trace(self):
        self.start_time = time.time()
        self.prompt_tokens = 0
        self.completion_tokens = 0
        self.tools_used = []
        self.steps_log = []

    def record_step(self, step_type: str, content: str, tool_name: str = None):
        step_entry = {
            "timestamp": time.time() - self.start_time,
            "type": step_type,
            "content": content[:120],
            "tool": tool_name
        }
        self.steps_log.append(step_entry)
        if tool_name and tool_name not in self.tools_used:
            self.tools_used.append(tool_name)

    def add_tokens(self, prompt_text: str, completion_text: str):
        # Heuristic / exact token estimation: ~4 chars per token
        p_tok = max(1, len(prompt_text) // 4)
        c_tok = max(1, len(completion_text) // 4)
        self.prompt_tokens += p_tok
        self.completion_tokens += c_tok

    def get_metrics(self) -> ObservabilityMetrics:
        elapsed_ms = (time.time() - self.start_time) * 1000 if self.start_time else 0.0
        total_tokens = self.prompt_tokens + self.completion_tokens
        
        # Cost estimate: ~$0.0001 per 1K tokens (Student Free / ultra-low tier)
        cost_usd = (total_tokens / 1000.0) * 0.0001
        
        return ObservabilityMetrics(
            total_tokens=total_tokens,
            prompt_tokens=self.prompt_tokens,
            completion_tokens=self.completion_tokens,
            estimated_cost_usd=round(cost_usd, 6),
            latency_ms=round(elapsed_ms, 1),
            steps_count=len(self.steps_log),
            active_tools_used=self.tools_used
        )
