//needed resources
const express = require("express") //se crea un express
const router = new express.Router() // se crea un router con el express
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inv-validation")
const classValidate = require("../utilities/classification-validation")
const utilities = require("../utilities")
const { route } = require("./static")

/* ***********************
    * Inventory Routes
*************************/

// Build inventory by classification
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
)

// Build vehicle detail view
router.get(
    "/detail/:inv_id",
    utilities.handleErrors(invController.buildByInvId)
)

// Inventory Management View
router.get(
    "/",
    utilities.handleErrors(invController.buildManagement)
)

// GET: show the add classification form
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

//POST: process the new classfication
router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

//GET: show add inventory form
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
)

//POST: process add inventory
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router //exporta el router para que otros archivos puedan usarlo