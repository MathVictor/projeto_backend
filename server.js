const http = require('http');
const fs = require('fs');
const path = require('path');
const handleRequest = require('./controllers/eventController');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  //  API: /events
  if (req.url.startsWith('/events')) {
    handleRequest(req, res);
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro ao carregar index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
    return;
  }

  const ext = path.extname(req.url);
  if (ext === '.css' || ext === '.js') {
    const filePath = path.join(__dirname, 'public', req.url);
    const contentType = ext === '.css' ? 'text/css' : 'application/javascript';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Arquivo não encontrado');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('404 Not Found');
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
