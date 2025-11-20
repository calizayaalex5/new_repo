const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
    *  Registration Data Validation Rules
    * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent
        
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent

        // valid emais is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() //refer to validator.js docs
            .withMessage("A valid email is required")
            .custom(async (account_email) => {
                const emailExist = await accountModel.checkExistingEmail(account_email)
                if(emailExist){
                    throw new Error("Email exist. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
    * Check data and return errors or continue to registration
    * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname: req.body?.account_firstname || "",
            account_lastname: req.body?.account_lastname || "",
            account_email: req.body?.account_email || ""
        })
        return
    }
    next()
}

/* *******************************
 * Login Data Validation Rules
 ******************************* */
validate.loginRules = () => {
    return [
        body("account_email")
        .trim()
        .escape()
        .isEmail()
        .withMessage("A valid email is required."),

        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Please enter your password.")
    ]
    }

/* *******************************
* Check login data and return errors
******************************* */
validate.checkLoginData = async (req, res, next) => {
const { account_email } = req.body
const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("account/login", {
        title: "Login",
        nav,
        errors,
        locals: {
            account_email
        }
        })
    }
    next()
}

module.exports = validate
