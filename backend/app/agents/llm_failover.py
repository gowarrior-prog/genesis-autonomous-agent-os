import os
from openai import OpenAI

class LLMFailoverManager:
    def __init__(self):
        # 1. Cloud Google Gemini Latest Instance Configuration (Using OpenAI Compatible SDK format)
        self.gemini_client = OpenAI(
            api_key=os.getenv("GEMINI_API_KEY", "mock_key_fallback"),
            base_url="https://googleapis.com"
        )
        
        # 2. Local Offline Ollama (Llama3) Instance Configuration
        self.llama_client = OpenAI(
            base_url="http://localhost:11434/v1",
            api_key="ollama_local_token_bypass"
        )

    def execute_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Two-Tier Cloud-to-Local Failover Router:
        Primary Engine: Cloud Google Gemini (gemini-3.5-flash) [FREE TIER ACTIVE]
        Backup Engine: Local Offline Llama 3 (Ollama) [100% Secure & Free Execution]
        """
        
        # Tier 1: Attempting Cloud Google Gemini Latest Stable Model Processing [1]
        if os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "mock_key_fallback":
            try:
                print("✨ [LLM Router] Routing token payload to Cloud Google Gemini (gemini-3.5-flash)...")
                response = self.gemini_client.chat.completions.create(
                    model="gemini-3.5-flash",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    timeout=7.0 # Strict connection timeout parameter
                )
                return response.choices.message.content.strip()
            except Exception as gemini_err:
                print(f"⚠️ [LLM FAILOVER TRIGGERED]: Google Gemini Service Interrupted: {gemini_err}")
                print("🚨 WARNING: Switching operation cluster traffic to Local Llama 3 core safely...")

        # Tier 2: Backup Local Offline Llama 3 Trigger via Ollama (The Absolute Safety Shield)
        try:
            print("🦙 [LLM Router] Processing prompt stream via Local Llama 3 (Ollama)...")
            response = self.llama_client.chat.completions.create(
                model="llama3",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            return response.choices.message.content.strip()
        except Exception as ollama_err:
            print(f"[-] [LLM Router Critical Error] Both cloud and local inference layers unreachable: {ollama_err}")
            return "ERROR: AI_MESH_DEGRADED_FALLBACK"
