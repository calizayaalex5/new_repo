INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark','tony@starkent.com', 'Iam1ronm@n');

UPDATE account
SET email = 'ironman@avengers.com'
WHERE first_name = 'Tony' AND last_name = 'Stark';