const db = require("../db"); // Database connection

const logActivity = async (action, description) => {
  const query = `INSERT INTO logs (action, description) VALUES (?, ?)`;
  const values = [action, description];
  try {
    await db.query(query, values);
    console.log(`Log saved: ${action}`);
  } catch (err) {
    console.error("Error logging activity:", err.message);
  }
};

module.exports = logActivity;
