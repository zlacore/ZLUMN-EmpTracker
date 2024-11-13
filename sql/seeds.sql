\c employee_db

DO $$
BEGIN
    INSERT INTO department(name)
    VALUES('Load'),
          ('Unload'),
          ('Delivery'),
          ('Shifting');
    
    INSERT INTO role(title, salary, department)
    VALUES('loader', 25000, 1),
          ('unloader', 30000, 2),
          ('package car driver', 40000, 3),
          ('truck driver', 80000, 4);  

    INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES('Mister', 'Loader', 1, 1),
          ('Sir', 'Unload', 2,  2),
          ('Madame', 'Driver', 3, 3),
          ('Father', 'Delivery', 4,  4);

RAISE NOTICE 'Transaction complete';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; 
        ROLLBACK; 
END $$;

