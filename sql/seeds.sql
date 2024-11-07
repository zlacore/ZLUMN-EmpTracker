\c employee_db

DO $$
BEGIN
    INSERT INTO department(id, name)
    VALUES(1, 'Load'),
          (2, 'Unload'),
          (3, 'Delivery'),
          (4, 'Shifting');
    
    INSERT INTO role(id, title, salary, department)
    VALUES(1, 'loader', 25000, 1),
          (2, 'unloader', 30000, 2),
          (3, 'package car driver', 40000, 3),
          (4, 'truck driver', 80000, 4);  

    INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
    VALUES(1, 'Mister', 'Loader', 1, 1),
          (2, 'Sir', 'Unload', 2,  2),
          (3, 'Madame', 'Driver', 3, 3),
          (4, 'Father', 'Delivery', 4,  4);

RAISE NOTICE 'Transaction complete';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM; 
        ROLLBACK; 
END $$;

