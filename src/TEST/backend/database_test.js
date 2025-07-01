import {DB} from "./connect.js";


const sql = "Select * from habit";
try{
    DB.all(sql,(err,rows)=>{
        if(err) throw err;
        rows.forEach(row => {
            console.log(row);
        })
    })
}
catch(err){
    console.log("error: " + err);
}
