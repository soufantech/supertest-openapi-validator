import express from 'express';
import { USER_JOHN_DOE } from './data';

const server = express();

server.use(express.json());

server.get('/square/:number', (req, res) => {
  const num = parseInt(req.params?.number, 10);

  res.status(200).json({ number: num * num });
});

server.get('/status/:statusCode', (req, res) => {
  const status = parseInt(req.params?.statusCode, 10);

  res.status(status).json({ status });
});

server.get('/message', (req, res) => {
  const text = req.query.text;

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(text);
});

server.post('/users', (req, res) => {
  res.status(201).json(req.body);
});

server.get('/users/johndoe', (req, res) => {
  const auth = req.header('authorization');

  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.status(401).json({ error: 'UNAUTHENTICATED' });

    return;
  }

  if (auth !== 'Bearer abc123') {
    res.status(403).json({ error: 'UNAUTHORIZED' });

    return;
  }

  res.status(200).json(USER_JOHN_DOE);
});

server.get('/secret', (_req, res) => {
  res.status(200).json({ secret: 'Secret exposed!' });
});

server.use((_req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' });
});

export default server;
