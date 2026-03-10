#!/usr/bin/env python3
"""
Local dev server with HTTP Range request support.
Required for audio seeking (podcast player) to work in browsers.

Usage:  python3 server.py [port]
Default port: 8000
"""
import http.server
import socketserver
import os
import sys
import mimetypes

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class RangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler + Accept-Ranges / Range support."""

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        file_size = fs.st_size

        ctype = self.guess_type(path)
        range_header = self.headers.get("Range")

        if range_header:
            # Parse "bytes=start-end"
            try:
                byte_range = range_header.strip().replace("bytes=", "")
                parts = byte_range.split("-")
                start = int(parts[0]) if parts[0] else 0
                end   = int(parts[1]) if parts[1] else file_size - 1
            except (ValueError, IndexError):
                self.send_error(416, "Requested Range Not Satisfiable")
                f.close()
                return None

            end = min(end, file_size - 1)
            if start > end:
                self.send_error(416, "Requested Range Not Satisfiable")
                f.close()
                return None

            length = end - start + 1
            f.seek(start)

            self.send_response(206, "Partial Content")
            self.send_header("Content-type", ctype)
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Content-Length", str(length))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        else:
            self.send_response(200)
            self.send_header("Content-type", ctype)
            self.send_header("Content-Length", str(file_size))
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f

    def log_message(self, format, *args):
        # Suppress noisy 206 logs for audio chunks; keep errors visible
        code = args[1] if len(args) > 1 else ""
        if code not in ("206",):
            super().log_message(format, *args)


with socketserver.TCPServer(("", PORT), RangeHTTPRequestHandler) as httpd:
    httpd.allow_reuse_address = True
    print(f"Serving on http://localhost:{PORT}  (Range requests: YES)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
