-- Task 1-1: Insert a new staff member (Staff Hiring Stored Procedure)
INSERT INTO DH_STAFF (STAFFNO, FNAME, LNAME, POSITION, SEX, BRANCHNO, DOB, SALARY, TELEPHONE, MOBILE, EMAIL)
VALUES (:staffno, :firstName, :lastName, :position, :sex, :branchNo, TO_DATE(:dob, 'YYYY-MM-DD'), :salary, :telephone, :mobile, :email);

-- Task 1-3: Fetch all staff records (Staff Listing)
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
FROM DH_STAFF;

-- Task 1-3: Update specific staff details (Update Salary, Telephone, or Email)
UPDATE DH_STAFF
SET SALARY = :salary, TELEPHONE = :telephone, EMAIL = :email
WHERE STAFFNO = :staffno;

-- Task 2-1: Fetch branch address by branch number
SELECT street || ', ' || city AS address
FROM dh_branch
WHERE branchno = :branchno;

-- Task 2-2: Fetch all branch records (Branch Listing)
SELECT 
    BRANCHNO AS branchno, 
    STREET AS street, 
    CITY AS city, 
    POSTCODE AS postcode
FROM DH_BRANCH;

-- Task 2-2: Update branch address
UPDATE dh_branch
SET street = :street, city = :city, postcode = :postcode
WHERE branchno = :branchno;

-- Task 2-3: Open a new branch (Stored Procedure)
BEGIN
    NEW_BRANCH(P_BRANCHNO => :p_branchno, P_STREET => :p_street, P_CITY => :p_city, P_POSTCODE => :p_postcode);
END;

-- Task 3-1: Insert a new client (Client Registration)
INSERT INTO DH_CLIENT (CLIENTNO, FNAME, LNAME, TELNO, STREET, CITY, EMAIL, PREFTYPE, MAXRENT)
VALUES (:clientNo, :fName, :lName, :telNo, :street, :city, :email, :prefType, :maxRent);

-- Task 3-2: Fetch all client records (Client Listing)
SELECT 
    CLIENTNO AS clientNo,
    FNAME AS fName,
    LNAME AS lName,
    TELNO AS telNo,
    STREET AS street,
    CITY AS city,
    EMAIL AS email,
    PREFTYPE AS prefType,
    MAXRENT AS maxRent
FROM DH_CLIENT;

-- Task 3-2: Update specific client details (Update Telephone, Email, or Max Rent)
UPDATE DH_CLIENT
SET TELNO = :telNo, EMAIL = :email, MAXRENT = :maxRent
WHERE CLIENTNO = :clientNo;

-- Task 2.3 this will be need to be explained
CREATE OR REPLACE PROCEDURE NEW_BRANCH (
    p_branchno IN VARCHAR2,
    p_street IN VARCHAR2,
    p_city IN VARCHAR2,
    p_postcode IN VARCHAR2
)
IS
BEGIN
    INSERT INTO dh_branch (branchno, street, city, postcode)
    VALUES (p_branchno, p_street, p_city, p_postcode);
    COMMIT;
END;
/