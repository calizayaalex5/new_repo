-- Insertar un nuevo registro en la tabla account
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Actualizar el correo electrónico de Tony Stark
UPDATE account
SET account_email = 'ironman@avengers.com'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- poner como Admin in account_type

UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- borrar a tony stark

DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- cambiar descripccion de hummer

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- seleccionar vehiculos que sean tipo sport, hay que mostrar 'make' 'model'

SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- add '/vehicles'

UPDATE inventory
SET
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');