import sqlite3 from "sqlite3";
const sql = sqlite3.verbose();

const DB = new sqlite3.Database("./habit.db", sqlite3.OPEN_READWRITE, connected);

function connected(err){
    if(err){
        console.log("database initialisation failed");
        return;
    }
    console.log("database initialisation succeded");
}

const starting_queries = [
    "CREATE TABLE IF NOT EXISTS category(category_name TEXT NOT NULL PRIMARY KEY)",
    "CREATE TABLE IF NOT EXISTS tag_types(tag_name TEXT NOT NULL PRIMARY KEY)",
    "CREATE TABLE IF NOT EXISTS habit(habit_id INTEGER NOT NULL PRIMARY KEY,habit_name TEXT,habit_description TEXT,habit_category TEXT,habit_occurrence TEXT,FOREIGN KEY (habit_category) REFERENCES category(category_name))",
    "CREATE TABLE IF NOT EXISTS tag_relation(relation_id INTEGER NOT NULL PRIMARY KEY,relation_tag TEXT,relation_habit INTEGER,FOREIGN KEY (relation_tag) REFERENCES tag_types(tag_name))"
];

for(var i=0;i<starting_queries.length;i++){
    DB.run(starting_queries[i], [], (err)=>{
    //callback function
        if(err){
            console.log("error 1");
            return;
        }
    });
}

export {DB};
