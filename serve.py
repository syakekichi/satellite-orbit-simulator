import http.server
import socketserver
import os

PORT = 8080

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # 1. Base translation
        translated = super().translate_path(path)
        # 2. If path already exists (file or directory), use it
        if os.path.exists(translated):
            return translated
        # 3. If path + '.html' exists, serve it (Cloudflare Pages Clean URLs emulation)
        html_path = translated + '.html'
        if os.path.exists(html_path):
            return html_path
        # 4. If directory without trailing slash exists, redirect or serve index.html
        idx_path = os.path.join(translated, 'index.html')
        if os.path.exists(idx_path):
            return idx_path
        return translated

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Serving HTTP on port {PORT} with Clean URLs support (Cloudflare Pages emulation)...")
        httpd.serve_forever()
