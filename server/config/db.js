// db.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "${{RAILWAY_PRIVATE_DOMAIN}}",
  user: "root",
  password:"${{MYSQL_ROOT_PASSWORD}}",
  database: "railway",
  port: "3306",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();




