const db = require("../db");

const getAllEmployees = (req, res) => {
  let sql = "SELECT * FROM employees";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Server error");
    }
    console.log("Query results:", results); // Log query results for debugging
    res.json(results);
  });
};

const getEmployeeById = (req, res) => {
  const { id } = req.params;
  let sql = "SELECT * FROM employees WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Server error");
    }
    if (result.length === 0) {
      return res.status(404).send("Employee not found");
    }
    res.json(result[0]); // Return the first employee if found
  });
};

const addEmployee = (req, res) => {
  const { name, age, position, department } = req.body;
  const sql =
    "INSERT INTO employees (name, age, position, department) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, age, position, department], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Server error");
    }
    res.json({ id: result.insertId, name, age, position, department });
  });
};

const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, age, position, department } = req.body;
  const sql =
    "UPDATE employees SET name = ?, age = ?, position = ?, department = ? WHERE id = ?";
  db.query(sql, [name, age, position, department, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Server error");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Employee not found");
    }
    res.json({ id, name, age, position, department });
  });
};

const deleteEmployee = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM employees WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Server error");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Employee not found");
    }
    res.send("Employee deleted");
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
