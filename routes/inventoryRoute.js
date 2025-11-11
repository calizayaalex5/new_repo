//needed resources
const express = require("express") //se crea un express
const router = new express.Router() // se crea un router con el express
const invController = require("../controllers/invController")

//route to cuild inventory by classification id
router.get('/type/:classificationId', invController.buildByClassificationId)

module.exports = router //exporta el router para que otros archivos puedan usarlo