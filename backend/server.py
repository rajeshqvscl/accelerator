from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import json
from datetime import datetime, timezone
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = ROOT / "frontend"
DATA_DIR = ROOT / "data"


SITE_DATA = {
    "brand": {
        "name": "QVSCL Accelerator",
        "tagline": "Accelerator & Venture Studio",
        "linkedin": "https://www.linkedin.com/company/qvscl-accelerator-venture-studio/about/",
        "reference": "https://www.indiaaccelerator.co",
        "email": "customer@qvscl.com",
        "phone": "9810646388",
        "address": "5th floor, Adani Miracle Miles, 507, Sector 60, Gurugram, Haryana 122098",
    },
    "stats": [
        {"value": "2", "label": "Founder pathways", "detail": "Venture studio and accelerator"},
        {"value": "4", "label": "Support pillars", "detail": "Build, mentor, fundraise, scale"},
        {"value": "3", "label": "Portfolio signals", "detail": "GoAid, LabBuddy, WeSkills"},
        {"value": "12", "label": "Week cohort blueprint", "detail": "Validation to investor readiness"},
    ],
    "programs": [
        {
            "eyebrow": "Venture Studio",
            "title": "We Build Startups",
            "summary": "Co-create high-conviction ideas with founders from problem discovery to MVP, launch, and first traction.",
            "accent": "green",
            "icon": "rocket",
            "features": [
                "Idea validation and opportunity scouting",
                "Co-founding and startup building",
                "Product and tech development",
                "Go-to-market and scale support",
            ],
        },
        {
            "eyebrow": "Accelerator",
            "title": "We Accelerate Startups",
            "summary": "A cohort-based path for early-stage startups that need sharper strategy, mentors, investor access, and execution rhythm.",
            "accent": "violet",
            "icon": "chart",
            "features": [
                "Cohort-based acceleration",
                "Mentorship from industry experts",
                "Investor network and demo day",
                "Growth and fundraising support",
            ],
        },
    ],
    "portfolio": [
        {
            "name": "GoAid",
            "focus": "Emergency assistance and response",
            "signal": "Impact-led mobility support",
            "detail": "GoAid provides rapid emergency ambulance services with real-time tracking and AI-based dispatch, ensuring critical care reaches those in need within the golden hour.",
            "image": "/assets/portfolio-goaid.png",
            "color": "#ef233c",
        },
        {
            "name": "LabBuddy",
            "focus": "Learning and laboratory enablement",
            "signal": "Education and skill access",
            "detail": "LabBuddy is a digital platform connecting students and professionals with hands-on lab experiments, virtual simulations, and skill-based certification programs.",
            "image": "/assets/portfolio-labbuddy.jpeg",
            "color": "#1d9a8a",
        },
        {
            "name": "WeSkills",
            "focus": "Workforce empowerment and hiring",
            "signal": "Talent-to-industry bridge",
            "detail": "WeSkills is a workforce empowerment platform connecting talent with industry through skill assessments, micro-credentials, and direct hiring pipelines, enabling career growth for the modern workforce.",
            "image": "/assets/portfolio-weskills.webp",
            "color": "#e94e1b",
        },
    ],
    "approach": [
        {
            "title": "Founder First",
            "body": "Start with the founder's ambition, constraints, and unfair insight before building the operating plan.",
            "icon": "lightbulb",
        },
        {
            "title": "Hands-on Support",
            "body": "Work shoulder-to-shoulder on product, hiring, GTM, partnerships, and fundraising moments.",
            "icon": "handshake",
        },
        {
            "title": "Long-term Partnership",
            "body": "Stay useful beyond the first cohort through founder check-ins, network access, and strategic reviews.",
            "icon": "target",
        },
        {
            "title": "Impact Driven",
            "body": "Back startups that solve practical, real-world problems with clear markets and measurable outcomes.",
            "icon": "spark",
        },
    ],
    "journey": [
        {
            "phase": "01",
            "title": "Scout",
            "body": "Map problem depth, founder-market fit, and customer urgency before committing resources.",
        },
        {
            "phase": "02",
            "title": "Build",
            "body": "Move from evidence to product with weekly execution cycles and crisp accountability.",
        },
        {
            "phase": "03",
            "title": "Launch",
            "body": "Design first customer pilots, partner motions, and investor-ready traction stories.",
        },
        {
            "phase": "04",
            "title": "Scale",
            "body": "Prepare the venture for repeatable acquisition, hiring, finance, and fundraising discipline.",
        },
    ],
    "resources": [
        {"type": "Guide", "title": "Founder validation checklist", "meta": "MVP readiness"},
        {"type": "Template", "title": "Investor update blueprint", "meta": "Monthly reporting"},
        {"type": "Event", "title": "Demo day preparation sprint", "meta": "Pitch readiness"},
    ],
    "events": [
        {"date": "Jul 2026", "title": "Founder Office Hours", "mode": "Hybrid"},
        {"date": "Aug 2026", "title": "Product-Market Fit Lab", "mode": "Workshop"},
        {"date": "Sep 2026", "title": "Investor Readiness Review", "mode": "Cohort"},
    ],
}


def utc_now():
    return datetime.now(timezone.utc).isoformat()


class QVSCLHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        route = urlparse(self.path).path
        if route == "/api/health":
            self.send_json({"ok": True, "service": "qvscl-accelerator", "time": utc_now()})
            return
        if route == "/api/site-data":
            self.send_json(SITE_DATA)
            return
        return self.serve_frontend(route)

    def do_POST(self):
        route = urlparse(self.path).path
        if route not in {"/api/apply", "/api/newsletter"}:
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown API route")
            return

        try:
            payload = self.read_json_body()
        except ValueError as exc:
            self.send_json({"ok": False, "message": str(exc)}, status=HTTPStatus.BAD_REQUEST)
            return

        if route == "/api/apply":
            required = ["name", "email", "interest"]
            missing = [field for field in required if not payload.get(field)]
            if missing:
                self.send_json(
                    {"ok": False, "message": f"Missing required field: {', '.join(missing)}"},
                    status=HTTPStatus.BAD_REQUEST,
                )
                return
            saved_to = "inquiries.jsonl"
            message = "Thanks. QVSCL has your application blueprint."
        else:
            if not payload.get("email"):
                self.send_json({"ok": False, "message": "Email is required."}, status=HTTPStatus.BAD_REQUEST)
                return
            saved_to = "newsletter.jsonl"
            message = "You're on the QVSCL founder updates list."

        record = {"received_at": utc_now(), "source": route, **payload}
        DATA_DIR.mkdir(exist_ok=True)
        with (DATA_DIR / saved_to).open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")

        self.send_json({"ok": True, "message": message}, status=HTTPStatus.CREATED)

    def serve_frontend(self, route):
        requested = (FRONTEND_DIR / route.lstrip("/")).resolve()
        if requested.is_file() and FRONTEND_DIR in requested.parents:
            return super().do_GET()

        self.path = "/index.html"
        return super().do_GET()

    def read_json_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            raise ValueError("Request body is empty.")
        raw = self.rfile.read(length)
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError("Request body must be valid JSON.") from exc

    def send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser(description="Run the QVSCL Accelerator local site.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), QVSCLHandler)
    print(f"QVSCL Accelerator running at http://{args.host}:{args.port}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down QVSCL Accelerator.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
