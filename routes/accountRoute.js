const express = require("express") //se crea un express
const router = new express.Router() // se crea un router con el express
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
)

router.post(
    '/register', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

module.exports = router