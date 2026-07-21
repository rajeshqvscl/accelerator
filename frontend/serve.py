from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
import argparse

FRONTEND_DIR = Path(__file__).resolve().parent

class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]
        ext = Path(path).suffix
        if ext in {".html", ".js", ".css", ".json", ".png", ".jpg", ".jpeg",
                    ".gif", ".svg", ".ico", ".webp", ".avif", ".mp4", ".webm",
                    ".woff", ".woff2", ".ttf", ".eot", ".pdf", ".txt", ".xml"}:
            super().do_GET()
        else:
            path = FRONTEND_DIR / "index.html"
            if path.exists():
                data = path.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_error(404)

def main():
    parser = argparse.ArgumentParser(description="QVSCL frontend dev server with SPA routing.")
    parser.add_argument("--port", type=int, default=4174)
    args = parser.parse_args()
    server = HTTPServer(("127.0.0.1", args.port), SPAHandler)
    print(f"Frontend running at http://127.0.0.1:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()

if __name__ == "__main__":
    main()
