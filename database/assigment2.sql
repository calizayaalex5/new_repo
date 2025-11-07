-- cambiar descripccion de hummer

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer' 

-- seleccionar vehiculos que sean tipo sport, hay que mostrar 'make' 'model'

SELECT i.inv_model, i.inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c
	ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport'

-- add '/vehicles'

UPDATE inventory
SET
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles')