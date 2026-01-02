const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mintu@2004',
    database: 'handicraft_store',
});
module.exports = pool.promise();