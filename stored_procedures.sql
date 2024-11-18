-- Create or replace the stored procedure for hiring a staff member
CREATE OR REPLACE PROCEDURE Staff_hire_sp (
    p_staffno IN VARCHAR2,
    p_fname IN VARCHAR2,
    p_lname IN VARCHAR2,
    p_position IN VARCHAR2,
    p_sex IN CHAR,
    p_branchno IN VARCHAR2,
    p_dob IN DATE,
    p_salary IN NUMBER,
    p_telephone IN VARCHAR2,
    p_mobile IN VARCHAR2,
    p_email IN VARCHAR2
) AS
BEGIN
    -- Insert the staff record into the DH_STAFF table
    INSERT INTO DH_STAFF (STAFFNO, FNAME, LNAME, POSITION, SEX, BRANCHNO, DOB, SALARY, TELEPHONE, MOBILE, EMAIL)
    VALUES (p_staffno, p_fname, p_lname, p_position, p_sex, p_branchno, p_dob, p_salary, p_telephone, p_mobile, p_email);
    COMMIT;
END Staff_hire_sp;
/
