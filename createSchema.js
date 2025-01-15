const db = require("./db");

const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INT,
        position VARCHAR(255),
        department VARCHAR(255)
    )
    `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Employees table created successfully.");
    }
  });
};

// Call the function to create the table
createUsersTable();
