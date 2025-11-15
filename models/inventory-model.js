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
module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInvId} //exporta la funcion