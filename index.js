import express from 'express';
import { aterbot } from 'aterbot';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('<h1>Aterbot is running</h1><p>Check console for logs.</p>');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Web preview available at http://0.0.0.0:${port}`);
});

aterbot();
