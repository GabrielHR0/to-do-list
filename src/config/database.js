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

db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
};

module.exports = db;