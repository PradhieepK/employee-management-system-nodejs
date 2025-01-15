const mysql = require("mysql");

const db = mysql.createConnection({
  host: "bzk7fuo1k29gg4ckvivg-mysql.services.clever-cloud.com",
  user: "uctdfeqquinwsc9e",
  database: "bzk7fuo1k29gg4ckvivg",
  password: "8YbjtpQ1YNPZzjvDIvqU",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("MySQL Connected...");
});
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
// });

module.exports = db;
