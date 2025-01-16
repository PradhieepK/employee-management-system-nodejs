const db = require("../db");
const logActivity = require("../utils/logger");
const apiTracking = require("../utils/apiTracking");

const validateEmployeeData = (data) => {
  const { name, age, position, department } = data;
  const errors = [];

  // Name Validation
  if (
    !name ||
    typeof name !== "string" ||
    name.length < 1 ||
    name.length > 255
  ) {
    errors.push(
      "Name is required and must be a string between 1 and 255 characters."
    );
  }

  // Age Validation
  const numericAge = Number(age);
  if (
    !numericAge ||
    typeof numericAge !== "number" ||
    numericAge < 18 ||
    numericAge > 65
  ) {
    errors.push("Age must be a number between 18 and 65.");
  }

  // Position Validation
  if (
    !position ||
    typeof position !== "string" ||
    position.length < 1 ||
    position.length > 100
  ) {
    errors.push(
      "Position is required and must be a string between 1 and 100 characters."
    );
  }

  // Department Validation
  if (
    !department ||
    typeof department !== "string" ||
    department.length < 1 ||
    department.length > 100
  ) {
    errors.push(
      "Department is required and must be a string between 1 and 100 characters."
    );
  }

  return errors;
};

const validateId = (id) => {
  if (!id || isNaN(id) || id <= 0) {
    return "Invalid employee ID.";
  }
  return null;
};

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     description: Fetch all employees from the database.
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   position:
 *                     type: string
 *                   department:
 *                     type: string
 */
const getAllEmployees = (req, res) => {
  const endpoint = "GET - /employees";
  const requestPayload = "";

  let sql = "SELECT * FROM employees";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      const responsePayload = { error: "Server error" };
      logActivity(
        "Get All Employees",
        "Failed to fetch employees due to server error"
      );
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(500).json(responsePayload);
    }
    const responsePayload = results;
    logActivity(
      "Get All Employees",
      "Fetched all employee records successfully"
    );
    apiTracking(endpoint, requestPayload, responsePayload);
    res.json(responsePayload);
  });
};

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     description: Fetch employee details by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 position:
 *                   type: string
 *                 department:
 *                   type: string
 *       404:
 *         description: Employee not found
 */
const getEmployeeById = (req, res) => {
  const { id } = req.params;
  const endpoint = `GET - /employees/${id}`;
  const requestPayload = "";

  const idError = validateId(id);
  if (idError) {
    const responsePayload = { error: idError };
    logActivity("Get Employee By ID", `Invalid ID ${id}`);
    apiTracking(endpoint, requestPayload, responsePayload);
    return res.status(400).json(responsePayload);
  }

  let sql = "SELECT * FROM employees WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      const responsePayload = { error: "Server error" };
      logActivity(
        "Get Employee By ID",
        `Failed to fetch employee with ID ${id}`
      );
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(500).json(responsePayload);
    }
    if (result.length === 0) {
      const responsePayload = { error: "Employee not found" };
      logActivity("Get Employee By ID", `Employee with ID ${id} not found`);
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(404).json(responsePayload);
    }
    const responsePayload = result[0];
    logActivity(
      "Get Employee By ID",
      `Fetched employee with ID ${id} successfully`
    );
    apiTracking(endpoint, requestPayload, responsePayload);
    res.json(responsePayload);
  });
};

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Add a new employee
 *     description: Adds a new employee to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 position:
 *                   type: string
 *                 department:
 *                   type: string
 *       400:
 *         description: Invalid input data
 */
const addEmployee = (req, res) => {
  const { name, age, position, department } = req.body;
  const endpoint = "POST - /employees";
  const requestPayload = req.body;

  const validationErrors = validateEmployeeData(req.body);
  if (validationErrors.length > 0) {
    const responsePayload = { errors: validationErrors };
    logActivity("Add Employee", "Validation failed while adding employee");
    apiTracking(endpoint, requestPayload, responsePayload);
    return res.status(400).json(responsePayload);
  }

  const sql =
    "INSERT INTO employees (name, age, position, department) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, age, position, department], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      const responsePayload = { error: "Server error" };
      logActivity(
        "Add Employee",
        "Failed to add a new employee due to server error"
      );
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(500).json(responsePayload);
    }
    const responsePayload = {
      id: result.insertId,
      name,
      age,
      position,
      department,
    };
    logActivity(
      "Add Employee",
      `Added new employee: ${name}, Position: ${position}, Department: ${department}`
    );
    apiTracking(endpoint, requestPayload, responsePayload);
    res.json(responsePayload);
  });
};

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update an existing employee
 *     description: Update an employee's details by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Employee's name
 *               age:
 *                 type: integer
 *                 description: Employee's age (between 18 and 65)
 *               position:
 *                 type: string
 *                 description: Employee's position
 *               department:
 *                 type: string
 *                 description: Employee's department
 *             required:
 *               - name
 *               - age
 *               - position
 *               - department
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 position:
 *                   type: string
 *                 department:
 *                   type: string
 *       400:
 *         description: Invalid data or ID
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, age, position, department } = req.body;
  const endpoint = `PUT - /employees/${id}`;
  const requestPayload = req.body;

  // Validate ID
  const idError = validateId(id);
  if (idError) {
    const responsePayload = { error: idError };
    logActivity("Update Employee", `Invalid ID ${id}`);
    apiTracking(endpoint, requestPayload, responsePayload);
    return res.status(400).json(responsePayload);
  }

  // Validate Employee Data
  const validationErrors = validateEmployeeData(req.body);
  if (validationErrors.length > 0) {
    const responsePayload = { errors: validationErrors };
    logActivity(
      "Update Employee",
      `Validation failed while updating employee with ID ${id}`
    );
    apiTracking(endpoint, requestPayload, responsePayload);
    return res.status(400).json(responsePayload);
  }

  const sql =
    "UPDATE employees SET name = ?, age = ?, position = ?, department = ? WHERE id = ?";
  db.query(sql, [name, age, position, department, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      const responsePayload = { error: "Server error" };
      logActivity("Update Employee", `Failed to update employee with ID ${id}`);
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(500).json(responsePayload);
    }
    if (result.affectedRows === 0) {
      const responsePayload = { error: "Employee not found" };
      logActivity("Update Employee", `Employee with ID ${id} not found`);
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(404).json(responsePayload);
    }
    const responsePayload = { id, name, age, position, department };
    logActivity("Update Employee", `Updated employee with ID ${id}`);
    apiTracking(endpoint, requestPayload, responsePayload);
    res.json(responsePayload);
  });
};

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     description: Delete an employee from the database using their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee with ID: 1 deleted"
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

const deleteEmployee = (req, res) => {
  const { id } = req.params;
  const endpoint = `DELETE - /employees/${id}`;
  const requestPayload = { params: req.params };

  // Validate ID
  const idError = validateId(id);
  if (idError) {
    const responsePayload = { error: idError };
    logActivity("Delete Employee", `Invalid ID ${id}`);
    apiTracking(endpoint, requestPayload, responsePayload);
    return res.status(400).json(responsePayload);
  }

  const sql = "DELETE FROM employees WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      const responsePayload = { error: "Server error" };
      logActivity("Delete Employee", `Failed to delete employee with ID ${id}`);
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(500).json(responsePayload);
    }
    if (result.affectedRows === 0) {
      const responsePayload = { error: "Employee not found" };
      logActivity("Delete Employee", `Employee with ID ${id} not found`);
      apiTracking(endpoint, requestPayload, responsePayload);
      return res.status(404).json(responsePayload);
    }
    const responsePayload = { message: `Employee with ID: ${id} deleted` };
    logActivity("Delete Employee", `Deleted employee with ID ${id}`);
    apiTracking(endpoint, requestPayload, responsePayload);
    res.json(responsePayload);
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
