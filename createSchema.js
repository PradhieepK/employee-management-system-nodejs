const db = require("./db");

const createTable = () => {
  const sql = `
  CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity VARCHAR(255) NOT NULL,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP
)`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created successfully.");
    }
  });
};

createTable();

// CREATE TABLE IF NOT EXISTS employees (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     age INT,
//     position VARCHAR(255),
//     department VARCHAR(255)
// )
//   CREATE TABLE logs (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     activity VARCHAR(255) NOT NULL,
//     date_time DATETIME DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE api_tracking (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   request TEXT NOT NULL,
//   response TEXT NOT NULL,
//   api_endpoint VARCHAR(255) NOT NULL,
//   date_time DATETIME DEFAULT CURRENT_TIMESTAMP
// )
