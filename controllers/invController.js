const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
    *  Build inventory by classification view
    * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 * Build single vehicle detail view
 ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getVehicleByInvId(inv_id)
    const nav = await utilities.getNav()

    // ERROR HANDLING: si no existe ese vehículo
    if (!data) {
        const error = new Error("Vehicle not found")
        error.status = 404
        return next(error)
    }

    const vehicleHTML = await utilities.buildVehicleHTML(data)
    const name = `${data.inv_make} ${data.inv_model}`

    res.render("./inventory/detail", {
        title: `${name} details`,
        nav,
        vehicleHTML,
        data
    })
}

module.exports = invCont
