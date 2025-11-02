import json
import base64
from typing import Dict
from pathlib import Path

import aiohttp

from app.utils.config import settings


class AIAgentService:
    def __init__(self):
        self.base_url = settings.OPENROUTER_BASE_URL
        self.api_key = settings.OPENROUTER_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            # OpenRouter recommends including Referer and Title for tracking
            "HTTP-Referer": "https://example.local/",
            "X-Title": "SEAL-Underrate Analyzer",
        }

    async def _post_chat(self, payload: Dict, timeout_seconds: int) -> Dict:
        async with aiohttp.ClientSession() as session:
            async with session.post(
            f"{self.base_url}/chat/completions",
            headers=self.headers,
            json=payload,
            timeout=aiohttp.ClientTimeout(total=timeout_seconds),
            ) as response:
                response.raise_for_status()
                return await response.json()

    async def run_code_analyst(self, lighthouse_data: Dict, html: str) -> Dict:
        prompt = f"""You are a senior web performance and code quality analyst.

Analyze this website's technical data and provide a structured report.

**Lighthouse Data:**
```json
{json.dumps(lighthouse_data, indent=2)}
```

**HTML Structure (first 5000 chars):**
```html
{html[:5000]}
```

Provide your analysis in this EXACT JSON format:
{{
  "performance_score": <0-100>,
  "accessibility_score": <0-100>,
  "seo_score": <0-100>,
  "issues": [
    {{
      "category": "performance|accessibility|seo|code-quality",
      "severity": "critical|high|medium|low",
      "title": "Brief issue title",
      "description": "Detailed explanation",
      "recommendation": "How to fix"
    }}
  ],
  "metrics": {{
    "fcp": <milliseconds>,
    "lcp": <milliseconds>,
    "cls": <score>,
    "load_time": <milliseconds>
  }}
}}

Return ONLY valid JSON, no markdown formatting."""

        payload = {
            "model": settings.CODE_ANALYST_MODEL,
            "messages": [
                {"role": "system", "content": "Return ONLY valid JSON. No prose, no markdown."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.0,
            "max_tokens": 4000,
        }

        result = await self._post_chat(payload, timeout_seconds=120)
        content = result["choices"][0]["message"]["content"]
        return self._parse_json_content(content)

    async def run_vision_analyst(self, screenshot_paths: Dict[str, str]) -> Dict:
        images_data: Dict[str, str] = {}
        for device, path in screenshot_paths.items():
            with open(path, "rb") as f:
                images_data[device] = base64.b64encode(f.read()).decode("utf-8")

        content = [
            {
                "type": "text",
                "text": (
                    "You are a UI/UX design expert. Analyze these screenshots (desktop, tablet, mobile) and provide detailed feedback.\n\n"
                    "Evaluate:\n1. Visual hierarchy & layout\n2. Typography & readability\n3. Color scheme & contrast\n4. Responsive design quality\n5. UI elements (buttons, forms, navigation)\n6. Accessibility issues\n\n"
                    "For EACH issue found, provide bounding box coordinates: {\"x\": <px>, \"y\": <px>, \"width\": <px>, \"height\": <px>}\n\n"
                    "Return ONLY this JSON structure:\n{\n  \"overall_design_score\": <0-100>,\n  \"responsive_quality\": \"excellent|good|fair|poor\",\n  \"ui_issues\": [\n    {\n      \"device\": \"desktop|tablet|mobile\",\n      \"category\": \"layout|typography|color|accessibility|spacing|imagery\",\n      \"severity\": \"critical|high|medium|low\",\n      \"title\": \"Issue title\",\n      \"description\": \"Detailed description\",\n      \"location\": {\"x\": 0, \"y\": 0, \"width\": 100, \"height\": 50},\n      \"recommendation\": \"How to fix\"\n    }\n  ],\n  \"positive_aspects\": [\"list\", \"of\", \"good\", \"things\"]\n}"
                ),
            }
        ]

        for device in ["desktop", "tablet", "mobile"]:
            content.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{images_data[device]}"},
                }
            )

        payload = {
            "model": settings.VISION_ANALYST_MODEL,
            "messages": [
                {"role": "system", "content": "Return ONLY valid JSON. No prose, no markdown."},
                {"role": "user", "content": content}
            ],
            "temperature": 0.0,
            "max_tokens": 5000,
        }

        result = await self._post_chat(payload, timeout_seconds=180)
        content_text = result["choices"][0]["message"]["content"]
        return self._parse_json_content(content_text)

    async def run_report_synthesizer(self, code_analysis: Dict, vision_analysis: Dict, metadata: Dict) -> Dict:
        prompt = f"""You are a technical report writer. Synthesize these analyses into an executive summary.

**Code Analysis:**
```json
{json.dumps(code_analysis, indent=2)}
```

**Vision Analysis:**
```json
{json.dumps(vision_analysis, indent=2)}
```

Create a concise executive summary (200-300 words) that:
1. Highlights the most critical issues
2. Mentions key strengths
3. Provides prioritized recommendations
4. Estimates improvement impact

Return JSON:
{{
  "executive_summary": "Your summary here...",
  "priority_actions": [
    {{"action": "...", "impact": "high|medium|low", "effort": "easy|medium|hard"}}
  ],
  "overall_score": <0-100>
}}"""

        payload = {
            "model": settings.SYNTHESIZER_MODEL,
            "messages": [
                {"role": "system", "content": "Return ONLY valid JSON. No prose, no markdown."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.0,
            "max_tokens": 2000,
        }

        result = await self._post_chat(payload, timeout_seconds=120)
        content = result["choices"][0]["message"]["content"]
        return self._parse_json_content(content)

    @staticmethod
    def _parse_json_content(content: str) -> Dict:
        import re

        def try_load(s: str):
            s = s.strip()
            return json.loads(s)

        # 1) Direct JSON
        try:
            return try_load(content)
        except Exception:
            pass

        # 2) Any fenced block: ```json ...``` or ``` ...```
        fence_blocks = re.findall(r"```(?:json|JSON)?\n([\s\S]*?)\n```", content)
        for block in fence_blocks:
            try:
                return try_load(block)
            except Exception:
                continue

        # 3) First top-level JSON object via brace balancing
        start = content.find("{")
        end = content.rfind("}")
        if start != -1 and end != -1 and end > start:
            depth = 0
            last = None
            for i, ch in enumerate(content[start:end+1], start):
                if ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        last = i + 1
                        break
            if last:
                candidate = content[start:last]
                try:
                    return try_load(candidate)
                except Exception:
                    pass

        raise ValueError("Cannot parse AI response as JSON")


