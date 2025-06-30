//kann bisher nur UserStory 17:
//Als Nutzer möchte ich individuelle Gewohnheiten anlegen und bearbeiten können,
// damit ich den Tracker flexibel an meine persönlichen Ziele anpassen kann

//HTTP-Requests: POST /api/habits (hinzufügen)
//HTTP-Request: PUT /api/habits/id (bearbeiten)
    //hier mit json-Objekt im body!

import express from "express";
const app = express();
//app.use(express.json);

//////only temporary//////
storedHabits = require("./habits.json");
console.log(storedHabits)
//console.log(storedHabits);
//////////////////////////


//Allgemeiner GET Zugriff auf API - liefert Error zurück, weil Intention unklar ist
app.get("/",(req,res) => {
    res.status(403);
    res.send("Wrong API-Endpoint");
});

//GET Zugriff auf API - User will alle ALLGEMEINEN Habits zur gegebenen ID
app.get("/api/habits/:userID", (req,res) => {
    responseJSON = storedHabits[req.params.userID]
    console.log(responseJSON);
    res.send(JSON.stringify(responseJSON));
});

//Post Zugriff auf API - User will neues ALLGEMEINES Habit hinzufügen (bearbeiten ist extra!)
//Content-Type HAS to be JSON
app.post("/api/habits/:userID", (req,res) => {
    newHabit=req.body;

//TODO - Testen!
    if(storedHabits[req.params.userID.toString()]!=null){
        counter=1;
        while(True){
            if(storedHabit[req.params.userID.toString()]["habits"][counter.toString()]!=null){
                counter+=1;
            }
            else{
                storedHabit[req.params.userID.toString()]["habits"][counter.toString()]=newHabit;
            }
        }
    }
})

//Default Port 8000, ansonsten vorgegebener Port 
const port = process.env.PORT || 8000

app.listen(port, () => console.log("Listening on port: " + port));