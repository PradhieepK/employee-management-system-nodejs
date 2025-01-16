const db = require("../db"); // Database connection

const apiTracking = async (apiEndpoint, request, response) => {
  const query = `INSERT INTO api_tracking (api_endpoint, request, response) VALUES (?, ?, ?)`;
  const values = [
    apiEndpoint,
    JSON.stringify(request),
    JSON.stringify(response),
  ];
  try {
    await db.query(query, values);
    console.log(`API Log saved`);
  } catch (err) {
    console.error("Error logging API activity:", err.message);
  }
};

module.exports = apiTracking;
