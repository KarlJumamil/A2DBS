const express = require('express');
const path = require('path');
const router = express.Router();
const { executeQuery } = require('./database');

// Serve index.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle staff hiring
router.post('/api/hire-staff', async (req, res) => {
  const { staffno, firstName, lastName, position, sex, branchNo, dob, salary, telephone, mobile, email } = req.body;

  // Validate required fields
  if (!staffno || !firstName || !lastName || !position || !sex || !branchNo || !dob || !salary || !telephone || !email) {
    return res.status(400).send('All fields are required.');
  }

  const query = `
    INSERT INTO DH_STAFF (STAFFNO, FNAME, LNAME, POSITION, SEX, BRANCHNO, DOB, SALARY, TELEPHONE, MOBILE, EMAIL)
    VALUES (:staffno, :firstName, :lastName, :position, :sex, :branchNo, TO_DATE(:dob, 'YYYY-MM-DD'), :salary, :telephone, :mobile, :email)
  `;

  try {
    await executeQuery(query, { staffno, firstName, lastName, position, sex, branchNo, dob, salary, telephone, mobile, email });
    res.status(200).send('Staff member hired successfully!');
  } catch (err) {
    console.error('Error inserting staff:', err);
    if (err.code === 'ORA-02291') {
      res.status(400).send('Invalid Branch No. It must exist in the Branch table.');
    } else {
      res.status(500).send('An error occurred while hiring staff.');
    }
  }
});

module.exports = router;
