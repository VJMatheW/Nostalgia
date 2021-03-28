const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require("fs");

let is_new_db = !fs.existsSync(path.join(process.env.NOSTALGIC_ROOT, "movie_listing.sqlite"));

let db = new sqlite3.Database(path.join(process.env.NOSTALGIC_ROOT, "movie_listing.sqlite"), (err)=>{
    if(err){
        console.log("Error in MovieListing DB Creation ", err);
    }else{
        initDB(is_new_db)
        console.log('Connected to the MovieListing database.');
    }

})

function initDB(is_new_db){
    if(is_new_db){
        db.serialize(function(){
            db.run('create table movies(m_id integer primary key autoincrement, movie_name varchar, magnet_link varchar, quality varchar)');
        })
    }
}

module.exports = db