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
    const classificationSelect = await utilities.buildClassificationList()

    return res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect,
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
        const classificationSelect = await utilities.buildClassificationList()

        req.flash("notice", `Successfully added classification: ${classification_name}`)

        return res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            classificationSelect,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry adding classification failed")

        return res.status(400).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
            locals: req.body
        })
    }
}

/* ****************************************
*  Deliver Add Inventory View
* *************************************** */
    invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();

    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        errors: null
    });
}

/* ****************************************
    *  Deliver Add Inventory view
* *************************************** */
invCont.addInventory = async function (req, res, next) {
    const {
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
    } = req.body

    const result = await invModel.addInventory(
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

    if (result) {
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildClassificationList()

        req.flash("notice", "The new vehicle was successfully added.")

        return res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            classificationSelect,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()

        req.flash("notice", "Sorry, the insertion failed.")

        return res.status(501).render("./inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            classificationSelect,
            errors: null,
            locals: req.body
        })
    }
}

/* ***************************
*  Return Inventory by Classification As JSON
* ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData.length > 0) {  // ✔ Seguro y correcto
        return res.json(invData)
    } else {
        return res.json([])   // ✔ retornar arreglo vacío, no error
    }
}

/* ***************************
*  Build edit inventory view
* ************************** */
invCont.buildEditInventoryView = async (req, res, next) => {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleByInvId(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    const {
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
    } = req.body

    const updateResult = await invModel.updateInventory(
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
    )

    if (updateResult) {
        console.log("UPDATE RESULT:", updateResult)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", `The ${itemName} was successfully updated.`)
        return res.redirect("/inv/")
    }

    // If update failed, rebuild view with sticky data
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    req.flash("notice", "Sorry, the update failed.")
    return res.status(501).render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
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
  })
}

/* ****************************************
*  Build Delete Confirmation View
* *************************************** */
invCont.buildDeleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();

    // Get item data
    const itemData = await invModel.getVehicleByInvId(inv_id);

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    return res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv: itemData
    });
    };

    /* ***************************
    *  Delete Inventory Item
    * ************************** */
    invCont.deleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id);

    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
        req.flash("notice", "The deletion was successful.");
        return res.redirect("/inv/");
    } else {
        req.flash("notice", "Sorry, the delete failed.");

        // Rebuild delete view
        return res.redirect(`/inv/delete/${inv_id}`);
    }
};



module.exports = invCont
