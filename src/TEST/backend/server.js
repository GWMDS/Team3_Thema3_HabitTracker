import express from 'express';
import cors from 'cors';
import {DB} from "./connect.js";
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
//////////////////////////////////////////////////////////////////////  
  //DATABASE-PART  
  const sql = "INSERT INTO habit(habit_name,habit_description,habit_category,habit_occurrence) VALUES (?,?,?,?)";
  let newId;
  //console.log(req.body);
  //console.log(req.body.name);
  try{
      DB.run(sql,[req.body[req.body.length-1]["name"],req.body[req.body.length-1]["description"],req.body[req.body.length-1]["category"]], function(err){
          if(err){
              console.log("Error while inserting data: " + err);
          }
          newId=this.lastID;
          //res.status(201);
          //let data = {status: 201,message: `new Habit ${newId} saved`};
          //let content = JSON.stringify(data);
          //res.send(content);
      })
      //console.log("success");
  }
  catch(err){
      console.log(err.message);
  }

//////////////////////////////////////////////////////////////////////

  //JSON-Part
  fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: 'Gespeichert' });
});

// API-Endpunkt: Einzelnen Habit per ID abrufen
app.get('/api/habits/:id', (req, res) => {
  if (!fs.existsSync(DB_FILE)) {
    return res.status(404).json({ error: 'Datenbankdatei nicht gefunden' });
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  const id = parseInt(req.params.id, 10);
  const habit = data.find(h => h.id === id);

  if (!habit) {
    return res.status(404).json({ error: 'Habit nicht gefunden' });
  }

  res.json(habit);
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
