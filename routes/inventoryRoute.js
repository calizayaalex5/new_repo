//needed resources
const express = require("express") //se crea un express
const router = new express.Router() // se crea un router con el express
const invController = require("../controllers/invController")
const utilities = require("../utilities")

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

module.exports = router //exporta el router para que otros archivos puedan usarlo