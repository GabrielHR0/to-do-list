require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

const dbPath = process.env.DB_PATH || './src/database/database.sqlite';

//Caminho completo, em caso de erros
const absolutePath = path.resolve(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
        console.error('Attempted path:', dbPath);
    } else {
        console.log('Connected to SQLite at:', dbPath);
    }
});

db.all = promisify(db.all).bind(db);
db.get = promisify(db.get).bind(db);
db.run = promisify(db.run).bind(db);


module.exports = db;