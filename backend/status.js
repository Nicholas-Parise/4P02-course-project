const express = require('express');
const router = express.Router();
const fs = require('fs');

// localhost:3000/status/
router.get('/', async (req, res) => {
    fs.readFile("pytest/api_status_report", 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error fetching status data" });;
        }
        res.status(200).json(JSON.parse(data));
      });
});

module.exports = router;