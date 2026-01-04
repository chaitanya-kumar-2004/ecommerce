// db.js
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // <-- CHANGED
    password: 'Mintu@2004',   // <-- CHANGED
    database: 'handicraft_store',
});
module.exports = pool.promise();