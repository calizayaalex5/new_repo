const pool = require('../database') //importar la doneccion con la base de datos

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
} //create function to get all classifications

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassifictinbyid error" + error)
        return[]
    }
}

async function getVehicleByInvId(inv_id) {
    try {
        const result = await pool.query(
            `SELECT *
            FROM public.inventory
            WHERE inv_id = $1`,
            [inv_id]
        )
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

/* ***************************
    *  Add a new classification
* ************************** */
async function addClassification(classification_name) {
    try {
        const sql = `
            INSERT INTO public.classification (classification_name)
            VALUES ($1)
            RETURNING classification_id
        `

        const data = await pool.query(sql, [classification_name])
        return data.rows[0]
    } catch (error) {
        console.error("addClassification error" + error)
        return null
    }
}

/* ***************************
*  Check if classification name already exists
* ************************** */
async function checkExistingClassification(name) {
    try {
        const sql = `
            SELECT * FROM public.classification
            WHERE classification_name = $1
        `

        const result = await pool.query(sql, [name])
        return result.rows.length > 0
    } catch (error) {
        console.error("checkExistingClassification error" + error)
        return false
    }
}

/* ***************************
     *  ADD DATA BY ADD_CLASSIFICATION
* ************************** */
async function addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
) {
    try {
        const sql = `
            INSERT INTO public.inventory (
                classification_id,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING inv_id
        `

        const data = await pool.query(sql, [
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        ])
        return data.rows[0]
    } catch (error) {
        console.error("addInventory error: " + error)
        return null
    }
}

/* ***************************
 UPADTE INVENTORY
* ************************** */
async function updateInventory(
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
) {
    try {
        const sql = 
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("updateInventory error: " + error)
    }
}

/* ***************************
 DELETE INVENTORY
* ************************** */
async function deleteInventory(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *";
        const data = await pool.query(sql, [inv_id]);
        return data.rowCount;
    } catch (error) {
        return error.message;
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInvId, addClassification, checkExistingClassification, addInventory, updateInventory, deleteInventory} //exporta la funcion