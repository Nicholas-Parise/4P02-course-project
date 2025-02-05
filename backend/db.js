const { Pool } = require('pg');
require("dotenv").config();


console.log("Database username:", process.env.DBUSERNAME);
console.log("Database URL:", process.env.PROD_HOST);
console.log("Database port:", process.env.DBPORT);


const pool = new Pool({
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  host: process.env.PROD_HOST,
  port: process.env.DBPORT, // default Postgres port 5432
  database: process.env.DBNAME
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};