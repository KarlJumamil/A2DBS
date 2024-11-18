const express = require('express');
const router = express.Router();
const { initialize, close, executeQuery } = require('./database');

router.post('/api/hire-staff', async (req, res) => {
  const { staffno, firstName, lastName, position, sex, branchNo, dob, salary, telephone, mobile, email } = req.body;

  const query = `
    INSERT INTO DH_STAFF (STAFFNO, FNAME, LNAME, POSITION, SEX, BRANCHNO, DOB, SALARY, TELEPHONE, MOBILE, EMAIL)
    VALUES (:staffno, :firstName, :lastName, :position, :sex, :branchNo, TO_DATE(:dob, 'YYYY-MM-DD'), :salary, :telephone, :mobile, :email)
  `;

  try {
    await executeQuery(query, { staffno, firstName, lastName, position, sex, branchNo, dob, salary, telephone, mobile, email });
    res.send('Staff member hired successfully!');
  } catch (err) {
    console.error('Error inserting staff:', err);
    res.status(500).send('Error hiring staff');
  }
});

module.exports = router;
