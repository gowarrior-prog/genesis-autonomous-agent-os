import os
from google import genai
from google.genai import types

class MultiModalSpatialAgent:
    def __init__(self):
        # Initializing native official Google GenAI Client
        self.gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        print("👁️ [Spatial Intelligence Core] Vision + Audio Multi-Modal Analyzer Mesh Active.")

    def analyze_ui_and_suggest_code(self, image_bytes: bytes, user_query: str = "Analyze and fix code bugs") -> dict:
        """
        Ingests screenshots raw byte arrays natively, evaluates visual UI bugs / error stacks,
        and directly returns complete source code structural refactoring solutions.
        """
        print("🚀 [Spatial Agent] Processing screenshot multi-modal pipeline trace...")
        
        system_instruction = (
            "You are the Master Spatial AI Architect. Review the provided visual image / code error trace screenshot carefully. "
            "Isolate the UI bug or runtime code exception layout, match it with the user request prompt, "
            "and generate a complete, long production-ready source code modification block solution."
        )

        try:
            # Native multi-modal structure payload ingestion mapping without base64 wrapper overheads
            response = self.gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
                    user_query
                ],
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.2
                )
            )
            raw_resolution_text = response.text.strip()
            print(f"✓ [Spatial Intelligence Success] Vision payload successfully parsed! ({len(raw_resolution_text)} chars)")
            return {"status": "success", "suggested_code_blocks": raw_resolution_text}
        except Exception as vision_err:
            print(f"[-] Multi-modal vision analysis matrix dropped: {vision_err}")
            return {"status": "failed", "suggested_code_blocks": f"❌ Spatial Vision Ingestion Crash: {str(vision_err)}"}
