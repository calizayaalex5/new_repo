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
/* ****************************************
    *  BUILD MANAGEMENT PAGE
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null
    })
}

/* ****************************************
    *  Deliver Add Classification View
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        locals: null
    })
}

/* ****************************************
    *  Process Add Classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
        let nav = await utilities.getNav()
        req.flash("notice", `Successfully added classification: ${classification_name}`)
        
        return res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry adding classification failed", {
            title: "Add New Classification",
            nav,
            errors: null
        })
    }
}

/* ****************************************
    *  Deliver Add Inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors: null,
        locals: null
    })
}

/* ****************************************
     *  Process Add Inventory
* *************************************** */
invCont.addInventory = async function (req, res, next) {
    const {
        classificationId,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    } = req.body

    const result = await invModel.addInventory(
        classificationId,
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

    if (result) {
        let nav = await utilities.getNav()
        req.flash("notice", "The new vehicle was successfully added.")

        return res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(classification_id)

        req.flash("notice", "Sorry, the insertion failed.")
        return res.status(501).render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationList,
            errors: null,
            locals: req.body
        })
    }
}

module.exports = invCont
