//needed resources
const express = require("express") //se crea un express
const router = new express.Router() // se crea un router con el express
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inv-validation")
const classValidate = require("../utilities/classification-validation")
const utilities = require("../utilities")
const { route } = require("./static")
const { getInventoryByClassificationId } = require("../models/inventory-model")
const accountTypeCheck = require("../utilities/accountTypeCheck")

/* ***********************
    * Inventory Routes
*************************/

// Public Resources
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
    "/detail/:inv_id",
    utilities.handleErrors(invController.buildByInvId)
)

// Inventory Management View
router.get(
    "/",
    accountTypeCheck,
    utilities.handleErrors(invController.buildManagement)
)

// GET: show the add classification form
router.get(
    "/add-classification",
    accountTypeCheck,
    utilities.handleErrors(invController.buildAddClassification)
)

//POST: process the new classfication
router.post(
    "/add-classification",
    accountTypeCheck,
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// *****************************************
// Router para añadir items del inventario 
// *****************************************
//GET: show add inventory form
router.get(
    "/add-inventory",
    accountTypeCheck,
    utilities.handleErrors(invController.buildAddInventory)
)

//POST: process add inventory
router.post(
    "/add-inventory",
    accountTypeCheck,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)


router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
    "/edit/:inv_id",
    accountTypeCheck,
    utilities.handleErrors(invController.buildEditInventoryView)
)

router.post (
    "/update",
    accountTypeCheck,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// *****************************************
// Router para borrar items del inventario 
// *****************************************
//envio de la informacion GET
router.get(
    "/delete/:inv_id",
    accountTypeCheck,
    utilities.handleErrors(invController.buildDeleteView)
)

//Precesar la informacion POST
router.post(
    "/delete",
    accountTypeCheck,
    utilities.handleErrors(invController.deleteInventory)
)



// *****************************************
//            MODULO DE EXPORTACION
// *****************************************
module.exports = router //exporta el router para que otros archivos puedan usarlo