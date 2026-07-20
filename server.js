const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 3000;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4'
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const requestPath = decoded === '/' ? '/index.html' : decoded;
  const filePath = path.normalize(path.join(root, requestPath));
  return filePath.startsWith(root) ? filePath : null;
}

const server = http.createServer((req, res) => {
  const filePath = safePath(req.url || '/');

  if (!filePath) {
    send(res, 403, 'Forbidden', {'Content-Type': 'text/plain; charset=utf-8'});
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(res, 404, 'Not found', {'Content-Type': 'text/plain; charset=utf-8'});
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const headers = {'Content-Type': types[ext] || 'application/octet-stream'};

    if (filePath.includes(`${path.sep}assets${path.sep}`) || filePath.includes(`${path.sep}product-photos${path.sep}`)) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`FAMIGO site is running on port ${port}`);
});
