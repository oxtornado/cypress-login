const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Demo user
const DEMO_EMAIL = 'admin@example.com';
const DEMO_PASSWORD = 'passw0rd!';
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(DEMO_PASSWORD, salt, 64);
const users = { [DEMO_EMAIL]: { salt, hash } };

function serveFile(res, file, type = 'text/html') {
  try {
    const data = fs.readFileSync(path.join(__dirname, file));
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': data.length });
    res.end(data);
  } catch {
    res.writeHead(500).end('File not found');
  }
}

function parseForm(body) {
  return Object.fromEntries(new URLSearchParams(body));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') return serveFile(res, 'index.html');
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
      const { email, password } = parseForm(body);
      const record = users[email];
      if (!record) return res.writeHead(401).end('Unauthorized');
      const candidate = crypto.scryptSync(password, record.salt, 64);
      const ok = crypto.timingSafeEqual(candidate, record.hash);
      if (!ok) return res.writeHead(401).end('Unauthorized');
      return serveFile(res, 'in.html');
    });
    return;
  }
  res.writeHead(404).end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Login with ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
});
