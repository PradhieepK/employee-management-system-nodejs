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
    console.error("Error connecting to the EMS DB database:", err);
    return;
  }
  console.log("EMS DB Connected");
});

module.exports = db;
