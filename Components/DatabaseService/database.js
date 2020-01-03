const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config()

let is_new_db = !fs.existsSync(path.join(process.env.NOSTALGIC_ROOT, "nostalgia.sqlite"));

let db = new sqlite3.Database(path.join(process.env.NOSTALGIC_ROOT,"nostalgia.sqlite"), (err) => {
    if (err) {
        console.error(err.message);
    } else {
        initDB(is_new_db);
        console.log('Connected to the nostalgia database.');
    }
});

function initDB(is_new_db) {
    if (is_new_db) {
        db.serialize(function() {
            // create table users
            db.run('create table users(u_id integer primary key autoincrement, u_name varchar, mobile_no varchar unique, email_id varchar unique, password varchar, otp integer, otp_expiration varchar, otp_verified boolean, last_signin varchar,created_on DATE default (datetime(\'now\',\'localtime\')))');

            // create table objects
            db.run('create table objects(o_id integer primary key autoincrement, name varchar not null, v_name varchar, parent_id integer not null, o_type varchar, created_on DATE default (datetime(\'now\',\'localtime\')), created_by integer, digitized_date varchar, encoded text, mimeType varchar)');

            // create table linksharing
            db.run(`CREATE TABLE linksharing(share_id   INTEGER PRIMARY KEY AUTOINCREMENT, o_id INTEGER, owner_id INTEGER, created_on DATE DEFAULT (datetime('now', 'localtime') ),
FOREIGN KEY(o_id) REFERENCES objects(o_id), FOREIGN KEY(owner_id) REFERENCES users(u_id))`);

            // create table linksharingauth
            db.run(`CREATE TABLE linksharingauth(share_auth_id INTEGER PRIMARY KEY AUTOINCREMENT,share_id INTEGER, requester_id INTEGER, status BOOLEAN, 
created_on DATE DEFAULT (datetime('now', 'localtime') ), FOREIGN KEY(share_id) REFERENCES linksharing (share_id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY(requester_id) REFERENCES users (u_id))`);
        })
    }
}

module.exports = db;