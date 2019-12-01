const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db = new sqlite3.Database("nostalgia.sqlite", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        // initDB(is_new_db);
        console.log('Connected to the nostalgia database.');
    }
});
module.exports = db;