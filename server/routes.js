const express = require('express');
const path = require('path');
const router = express.Router();
const { executeQuery } = require('./database');

// Serve index.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/staff.html'));
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

// Fetch all staff records
router.get('/api/staff', async (req, res) => {
  try {
      const query = `
          SELECT 
              STAFFNO AS staffno, 
              FNAME AS fname, 
              LNAME AS lname, 
              POSITION AS position, 
              SEX AS sex, 
              BRANCHNO AS branchno, 
              DOB AS dob, 
              SALARY AS salary, 
              TELEPHONE AS telephone, 
              MOBILE AS mobile, 
              EMAIL AS email
          FROM DH_STAFF
      `;
      const result = await executeQuery(query);

      // Transform rows to array of objects if necessary
      const formattedRows = result.rows.map(row => ({
          staffno: row[0],
          fname: row[1],
          lname: row[2],
          position: row[3],
          sex: row[4],
          branchno: row[5],
          dob: row[6],
          salary: row[7],
          telephone: row[8],
          mobile: row[9],
          email: row[10],
      }));

      console.log(formattedRows); // Debugging: Check transformed data
      res.status(200).json(formattedRows);
  } catch (err) {
      console.error('Error fetching staff records:', err);
      res.status(500).send('An error occurred while fetching staff records.');
  }
});



// Update specific staff details
router.put('/api/staff/:staffno', async (req, res) => {
  const { staffno } = req.params;
  const { salary, telephone, email } = req.body;

  // Validate input
  if (!salary && !telephone && !email) {
    return res.status(400).send('At least one field (salary, telephone, email) must be provided for update.');
  }

  let updateFields = [];
  let updateParams = {};

  if (salary) {
    updateFields.push('SALARY = :salary');
    updateParams.salary = salary;
  }
  if (telephone) {
    updateFields.push('TELEPHONE = :telephone');
    updateParams.telephone = telephone;
  }
  if (email) {
    updateFields.push('EMAIL = :email');
    updateParams.email = email;
  }

  updateParams.staffno = staffno;

  const query = `
    UPDATE DH_STAFF
    SET ${updateFields.join(', ')}
    WHERE STAFFNO = :staffno
  `;

  try {
    const result = await executeQuery(query, updateParams);
    if (result.rowsAffected === 0) {
      return res.status(404).send('Staff record not found.');
    }
    res.status(200).send('Staff record updated successfully.');
  } catch (err) {
    console.error('Error updating staff record:', err);
    res.status(500).send('An error occurred while updating staff record.');
  }
});




// Fetch branch address by branchno
router.get('/api/branch/address/:branchno', async (req, res) => {
  const { branchno } = req.params;
  console.log(`Received branch number: ${branchno}`); // Debugging: Log branch number

  try {
    const query = `SELECT street || ', ' || city AS address FROM dh_branch WHERE branchno = :branchno`;
    const result = await executeQuery(query, { branchno });

    console.log('Database query result:', result.rows); // Debugging: Log raw query result

    if (result.rows.length > 0) {
      const address = result.rows[0][0]; // Extract the address from the array
      res.status(200).send(address);
    } else {
      res.status(404).send('No address found');
    }
  } catch (err) {
    console.error('Error fetching branch address:', err);
    res.status(500).send('Error fetching branch address');
  }
});




// Fetch all branches
router.get('/api/branches', async (req, res) => {
  try {
      const query = `
          SELECT 
              BRANCHNO AS branchno, 
              STREET AS street, 
              CITY AS city, 
              POSTCODE AS postcode
          FROM DH_BRANCH
      `;
      const result = await executeQuery(query);

      // Debugging: Log the raw database result
      console.log(result.rows); 

      // Map the raw database rows into a usable JSON format
      const formattedData = result.rows.map(row => ({
          branchno: row[0], // Assuming row[0] is branchno
          street: row[1],   // Assuming row[1] is street
          city: row[2],     // Assuming row[2] is city
          postcode: row[3]  // Assuming row[3] is postcode
      }));

      // Send the formatted data to the front-end
      res.status(200).json(formattedData);
  } catch (err) {
      console.error('Error fetching branches:', err);
      res.status(500).send('Error fetching branches');
  }
});



// Update branch address
router.put('/api/branches/:branchno', async (req, res) => {
  const { branchno } = req.params;
  const { street, city, postcode } = req.body;

  try {
      const query = `
          UPDATE dh_branch
          SET street = :street, city = :city, postcode = :postcode
          WHERE branchno = :branchno
      `;
      await executeQuery(query, { branchno, street, city, postcode });
      res.status(200).send('Branch updated successfully');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error updating branch');
  }
});

// Add new branch
router.post('/api/open-branch', async (req, res) => {
  console.log('Request received:', req.body); // Debugging: Log the incoming request body

  const { p_branchno, p_street, p_city, p_postcode } = req.body;

  // Validate required fields
  if (!p_branchno || !p_street || !p_city || !p_postcode) {
      console.log('Validation failed:', { p_branchno, p_street, p_city, p_postcode }); // Debugging
      return res.status(400).send('All fields are required.');
  }

  const query = `
      BEGIN
          NEW_BRANCH(P_BRANCHNO => :p_branchno, P_STREET => :p_street, P_CITY => :p_city, P_POSTCODE => :p_postcode);
      END;
  `;

  try {
      // Execute the query using the provided data
      await executeQuery(query, { p_branchno, p_street, p_city, p_postcode });
      console.log('Branch created successfully!'); // Debugging
      res.status(200).send('Branch created successfully!');
  } catch (err) {
      console.error('Error creating branch:', err);

      // Handle database-specific errors
      if (err.code === 'ORA-00001') {
          res.status(400).send('Branch number already exists.');
      } else {
          res.status(500).send('An error occurred while creating the branch.');
      }
  }
});






module.exports = router;
