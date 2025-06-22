//kann bisher nur UserStory 17:
//Als Nutzer möchte ich individuelle Gewohnheiten anlegen und bearbeiten können,
// damit ich den Tracker flexibel an meine persönlichen Ziele anpassen kann

//HTTP-Requests: POST /api/habits (hinzufügen)
//HTTP-Request: PUT /api/habits/id (bearbeiten)
    //hier mit json-Objekt im body!

const express=require("express");
const app = express();
//app.use(express.json);

//////only temporary//////
storedHabits = require("./habits.json");
console.log(storedHabits)
//console.log(storedHabits);
//////////////////////////


//Allgemeiner GET Zugriff auf API
app.get("/",(req,res) => {
    res.send("Wrong API-Endpoint")
});

//GET Zugriff auf API - User will alle Habits
app.get("/api/habits/:userID", (req,res) => {
    responseJSON = storedHabits[req.params.userID]
    console.log(responseJSON);
    res.send(JSON.stringify(responseJSON));
});


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

const port = process.env.PORT || 8000

app.listen(port, () => console.log("Listening on port: " + port));