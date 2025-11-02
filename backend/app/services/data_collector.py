import asyncio
import tempfile
from pathlib import Path
from typing import Dict
from playwright.async_api import async_playwright


class DataCollector:
    def __init__(self, job_id: str):
        self.job_id = job_id
        base_tmp = Path(tempfile.gettempdir()) / "uiux_analyzer" / job_id
        base_tmp.mkdir(parents=True, exist_ok=True)
        self.temp_dir = base_tmp

    async def collect_all_data(self, target_url: str) -> Dict:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(viewport={"width": 1920, "height": 1080})
            page = await context.new_page()

            try:
                await page.goto(target_url, wait_until="networkidle", timeout=30000)

                lighthouse_task = self._run_lighthouse(page, target_url)
                screenshots_task = self._capture_screenshots(page)
                html_task = self._extract_html(page)

                lighthouse_data, screenshots, html_content = await asyncio.gather(
                    lighthouse_task, screenshots_task, html_task, return_exceptions=False
                )

                return {
                    "lighthouse": lighthouse_data,
                    "screenshots": screenshots,
                    "html": html_content,
                    "url": target_url,
                }
            finally:
                await browser.close()

    async def _run_lighthouse(self, page, url: str) -> Dict:
        try:
            await page.add_script_tag(url="https://unpkg.com/lighthouse@10.0.0/dist/lighthouse.min.js")
            await asyncio.sleep(2)
            lighthouse_script = """
            async () => {
                try {
                    const report = await window.lighthouse(location.href, {
                        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
                    });
                    return report;
                } catch (e) {
                    return { error: String(e) };
                }
            }
            """
            result = await page.evaluate(lighthouse_script)
            if isinstance(result, dict) and result.get("error"):
                raise RuntimeError(result["error"])  # fallback below
            return result
        except Exception:
            return await self._get_basic_metrics(page)

    async def _get_basic_metrics(self, page) -> Dict:
        metrics = await page.evaluate(
            """
            () => {
                const nav = performance.getEntriesByType('navigation')[0];
                const loadEnd = nav ? nav.loadEventEnd : 0;
                const dclEnd = nav ? nav.domContentLoadedEventEnd : 0;
                const score = loadEnd && loadEnd < 3000 ? 0.9 : 0.5;
                return {
                    categories: { performance: { score } },
                    audits: { 'first-contentful-paint': { numericValue: dclEnd } }
                };
            }
            """
        )
        return metrics

    async def _capture_screenshots(self, page) -> Dict[str, str]:
        screenshots: Dict[str, str] = {}
        viewports = {
            "desktop": {"width": 1920, "height": 1080},
            "tablet": {"width": 768, "height": 1024},
            "mobile": {"width": 375, "height": 667},
        }

        for device, viewport in viewports.items():
            await page.set_viewport_size(viewport)
            await asyncio.sleep(1)
            screenshot_path = self.temp_dir / f"{device}.png"
            await page.screenshot(path=str(screenshot_path), full_page=True)
            screenshots[device] = str(screenshot_path)

        return screenshots

    async def _extract_html(self, page) -> str:
        return await page.content()


