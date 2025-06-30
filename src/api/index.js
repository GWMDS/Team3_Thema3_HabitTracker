//kann bisher nur UserStory 17:
//Als Nutzer möchte ich individuelle Gewohnheiten anlegen und bearbeiten können,
// damit ich den Tracker flexibel an meine persönlichen Ziele anpassen kann

//HTTP-Requests: POST /api/habits (hinzufügen)
//HTTP-Request: PUT /api/habits/id (bearbeiten)
    //hier mit json-Objekt im body!

import express from "express";
import {DB} from "./connect.js";
import * as fs from 'fs';

const app = express();
//app.use(express.json);

//////only temporary//////

let storedHabits = JSON.parse(fs.readFileSync('./habits.json'));
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
app.post("/api/habits", (req,res) => {
    newHabit=req.body;

    const sql = "INSERT INTO habit(habit_name,habit_description,habit_category,habit_occurence) VALUES (?,?,?,?)";
    let newId;
    try{
        DB.run(sql,[req.body.name,req.body.description,req.body.category], function(err){
            if(err){
                throw err;
            }
            newId=this.lastID;
            res.status(201);
            let data = {status: 201,message: `new Habit ${newId} saved`};
            let content = JSON.stringify(data);
            res.send(content);
        })
    }
    catch(err){
        console.log(err.message);

    }
////TODO - Testen!
//    if(storedHabits[req.params.userID.toString()]!=null){
//        counter=1;
//        while(True){
//            if(storedHabit[req.params.userID.toString()]["habits"][counter.toString()]!=null){
//                counter+=1;
//            }
//            else{
//                storedHabit[req.params.userID.toString()]["habits"][counter.toString()]=newHabit;
//            }
//        }
//    }
})

//Default Port 8000, ansonsten vorgegebener Port 
const port = process.env.PORT || 8000

app.listen(port, () => console.log("Listening on port: " + port));