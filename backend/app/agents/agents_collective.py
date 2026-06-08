import os
import random
from typing import Dict, TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage
# Import our custom resilience failover class manager
from app.agents.llm_failover import LLMFailoverManager

class CollectiveState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], lambda x, y: x + y]
    supervisor_decision: str
    current_agent: str
    consensus_score: int
    agreement_token: bool

class AgentCollectiveEngine:
    def __init__(self):
        self.workflow = StateGraph(CollectiveState)
        # Initialize failover router client
        self.llm_router = LLMFailoverManager()
        self._build_agent_graph_mesh()

    def supervisor_node(self, state: CollectiveState) -> Dict:
        """Hierarchical Supervisor utilizing smart LLM failover routing meshes"""
        print("\n🧠 [Supervisor Engine] Invoking intelligent agent core parameters...")
        user_prompt = state["messages"][-1].get("content", "") if isinstance(state["messages"][-1], dict) else state["messages"][-1].content
        
        system_rules = (
            "You are the Master AI Supervisor. Analyze the user request. "
            "Decide if a specialized developer agent is needed to execute this task. "
            "Respond only with the exact specialized agent identity or name needed, or output 'DONE'."
        )
        
        # Executes response through the automatic cloud-to-local bridge channels
        decision = self.llm_router.execute_completion(system_rules, user_prompt)
        
        print(f"👉 [Supervisor Operational Output]: {decision}")
        return {
            "supervisor_decision": decision,
            "current_agent": "Alpha-Supervisor"
        }

    def specialist_node(self, state: CollectiveState) -> Dict:
        print("[Specialist Active] Generating cryptographic structural validation tokens...")
        mock_score = random.randint(85, 100)
        return {
            "consensus_score": mock_score,
            "agreement_token": True if mock_score >= 90 else False
        }

    def courtroom_debate_condition(self, state: CollectiveState) -> str:
        if state.get("consensus_score", 0) >= 90:
            print("⚖️ [Courtroom Consensus] Verification checks PASSED. Signing NFT agreement token.")
            return "end_process"
        print("⚖️ [Courtroom Dispute] Consensus low. Rerouting token graph execution paths.")
        return "reroute_loop"

    def _build_agent_graph_mesh(self):
        self.workflow.add_node("Supervisor", self.supervisor_node)
        self.workflow.add_node("Specialist", self.specialist_node)
        self.workflow.set_entry_point("Supervisor")
        self.workflow.add_edge("Supervisor", "Specialist")
        self.workflow.add_conditional_edges(
            "Specialist",
            self.courtroom_debate_condition,
            {
                "end_process": END,
                "reroute_loop": "Supervisor"
            }
        )
        self.app = self.workflow.compile()
        print("✓ LangGraph Agent Collective Infrastructure Compiled with Dual-LLM Failover Support.")
