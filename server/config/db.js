const mysql = require('mysql2');

const dbConfig = {
    host: process.env.MYSQL_HOST || 'containers-us-west-123.railway.app', 
    user: process.env.MYSQL_USER || 'kumar',
    password: process.env.MYSQL_PASSWORD || 'Mintu@2004', 
    database: process.env.MYSQL_DATABASE || 'handicraft_store',
    port: process.env.MYSQL_PORT || 3306 
};

const pool = mysql.createPool(dbConfig);

const promisePool = pool.promise();

module.exports = promisePool;