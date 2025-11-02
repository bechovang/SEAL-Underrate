import asyncio
import tempfile
import logging
from pathlib import Path
from typing import Dict
from playwright.async_api import async_playwright
from PIL import Image
import io



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
        """Chụp màn hình ở 3 kích thước và RESIZE"""
        screenshots: Dict[str, str] = {}
        logger = logging.getLogger(__name__)

        viewports = {
            'desktop': {'width': 1920, 'height': 1080},
            'tablet': {'width': 768, 'height': 1024},
            'mobile': {'width': 375, 'height': 667}
        }

        for device, viewport in viewports.items():
            await page.set_viewport_size(viewport)
            await asyncio.sleep(1)

            # Chụp viewport only (không full page để tránh ảnh quá cao)
            screenshot_bytes = await page.screenshot(full_page=False)

            # Resize để giảm size
            img = Image.open(io.BytesIO(screenshot_bytes))

            # Aggressive downscale để đảm bảo dưới 8000px limit
            max_dimension = 512  # Much smaller to be safe

            # Resize if any dimension exceeds max_dimension
            if img.width > max_dimension or img.height > max_dimension:
                # Calculate ratio to fit within max_dimension x max_dimension
                ratio = min(max_dimension / img.width, max_dimension / img.height)
                new_width = int(img.width * ratio)
                new_height = int(img.height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Optimize quality
            screenshot_path = self.temp_dir / f"{device}.png"
            img.save(screenshot_path, 'PNG', optimize=True)

            screenshots[device] = str(screenshot_path)

            # Log file size
            file_size = screenshot_path.stat().st_size / 1024  # KB
            logger.info(f"{device} screenshot: {file_size:.1f} KB")

        return screenshots

    async def _extract_html(self, page) -> str:
        return await page.content()


