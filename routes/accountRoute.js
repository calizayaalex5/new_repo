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

router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Update Account Information View
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)

router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),    
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

router.post(
    "/update-password",
    utilities.checkLogin,
    regValidate.passwordRules(),   
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
)

router.get(
    "/logout",
    (req, res) => {
        res.clearCookie("jwt")  
        req.flash("notice", "You have been logged out.")
        return res.redirect("/")  
    }
)

module.exports = router