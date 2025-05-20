const { createEvent, getEventsByUser } = require('../models/Event');
const fs = require('fs');
const path = require('path');

async function handleRequest(req, res) {
  if (req.method === 'POST' && req.url === '/events') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        if (!data.title || !data.date || !data.userId) {
          throw new Error('Campos obrigatórios não preenchidos');
        }

        const result = await createEvent(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'created', id: result.insertedId }));
      } catch (err) {
        logError(err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });

  } else if (req.method === 'GET' && req.url.startsWith('/events')) {
    const url = require('url').parse(req.url, true);
    const userId = url.query.userId;

    try {
      const events = await getEventsByUser(userId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(events));
    } catch (err) {
      logError(err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao buscar eventos' }));
    }

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
}

function logError(msg) {
  const logDir = path.join(__dirname, '../logs');
  const logFile = path.join(logDir, 'system.log');

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {
    console.error('Erro ao registrar log:', e.message);
  }
}

module.exports = handleRequest;
