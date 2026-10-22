import os
import json
from typing import Optional, Dict, Any

def process_custom_instruction(
    instruction: str,
    columns: list,
    sample_data: list
) -> Optional[Dict[str, Any]]:
    """
    Calls Google Gemini API (gemini-1.5-flash) to interpret a free-text cleaning prompt.
    Returns structured explanation or None if API key is not configured or fails.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        system_prompt = (
            "You are a helpful assistant for a spreadsheet cleaning tool called Messy Data Cleaner. "
            "Given the user's custom instruction, column names, and a small preview of rows, "
            "explain in 1-2 concise bullet points what specific cleaning action should be performed "
            "and what should be preserved for the change log. "
            "Return valid JSON with keys 'action_summary' (string) and 'preserved_summary' (string)."
        )

        user_content = (
            f"Columns: {columns}\n"
            f"Preview rows: {json.dumps(sample_data[:2])}\n"
            f"User Instruction: {instruction}"
        )

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=f"{system_prompt}\n\n{user_content}"
        )

        text = response.text.strip()
        # Clean json backticks if present
        if text.startswith("```"):
            text = text.strip("`")
            if text.startswith("json"):
                text = text[4:].strip()

        data = json.loads(text)
        return {
            "status": "success",
            "action": data.get("action_summary", instruction),
            "preserved": data.get("preserved_summary", "Other columns preserved unchanged.")
        }
    except Exception as e:
        # Graceful fallback: do not crash the app
        return {
            "status": "fallback",
            "action": instruction,
            "preserved": "Handled with non-destructive defaults."
        }
