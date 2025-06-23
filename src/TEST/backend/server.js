import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DB_FILE = 'habits.json';

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// API-Endpunkt: Habits abrufen
app.get('/api/habits', (req, res) => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '[]');
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  res.json(JSON.parse(data));
});

// API-Endpunkt: Habits speichern
app.post('/api/habits', (req, res) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: 'Gespeichert' });
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
