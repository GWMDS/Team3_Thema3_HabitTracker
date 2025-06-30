import {DB} from "./connect.js";

import express from "express";

import bodyParser from "body-parser";

const app=express();
app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.status(200);
    res.send("DATABASE ONLINE");
});

app.listen(8000,(err)=> {
    if(err){
        console.log("Error: ",err.message);
    }
    console.log("Listening on port 8000");
});