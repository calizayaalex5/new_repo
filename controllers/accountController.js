// ****** Required Resources ****** //
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// ****** Account Controller ****** //

/* ****************************************
 *  Deliver Login View
 * *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        locals: {
        account_firstname: "",
        account_lastname: "",
        account_email: ""
        }
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash password BEFORE saving to DB
    let hashedPassword
    try {
        //regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error preocessing the regsitration.')
        req.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    // Register client with hashed password
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed")
        return res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
    *  Process login request
* ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
    }

    try {
        const valid = await bcrypt.compare(account_password, accountData.account_password)

        if (valid) {

            delete accountData.account_password

            const accessToken = jwt.sign(
                {
                    account_id: accountData.account_id,
                    account_firstname: accountData.account_firstname,
                    account_lastname: accountData.account_lastname,
                    account_email: accountData.account_email,
                    account_type: accountData.account_type
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            )

            // Save cookie
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, {
                    httpOnly: true,
                    maxAge: 3600 * 1000
                })
            } else {
                res.cookie("jwt", accessToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600 * 1000
                })
            }

            return res.redirect("/account/")
        } 
        else {
            req.flash("notice", "Please check your credentials and try again.")
            return res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }

    } catch (error) {
        console.error("LOGIN ERROR:", error)
        throw new Error('Access Forbidden')
    }
}

/* ****************************************
 *  BUILD ACCOUNT MANAGEMENT
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData, 
    errors: null
  })
}

/* ****************************************
 *  Build update Account
 * ************************************ */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  const accountData = res.locals.accountData

  // Validar que solo puedan editar su propia cuenta
  if (accountData.account_id !== account_id) {
    req.flash("notice", "You are not allowed to edit this account.")
    return res.redirect("/account/")
  }

  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData,
    locals: null
  })
}

/* ****************************************
 *  Update Account Controller
 * ************************************ */
async function updateAccount (req, res, next) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id 
    } = req.body

    const account_id_int = parseInt(req.body.account_id)

    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id_int
    )

    if (updateResult) {
        req.flash("notice", "Account information updated successfully.")

        // reconstruir JWT con nuevos datos
        const newToken = jwt.sign(
        {
            account_id: account_id_int,
            account_firstname,
            account_lastname,
            account_email,
            account_type: res.locals.accountData.account_type
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
        )

        res.cookie("jwt", newToken, { httpOnly: true, maxAge: 3600 * 1000 })

        return res.redirect("/account/")
    }

    req.flash("notice", "Update failed.")
    return res.status(500).render("account/update-account", {
        title: "Update Account Information",
        nav,
        errors: null,
        accountData: res.locals.accountData,
        locals: req.body
    })
}

async function updatePassword(req, res, next) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const result = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )

    if (result) {
        req.flash("notice", "Password updated successfully.")
        return res.redirect("/account/")
    }

    req.flash("notice", "Password update failed.")
    res.status(500).render("account/update-account", {
        title: "Update Account Information",
        nav,
        errors: null,
        accountData: res.locals.accountData,
        locals: req.body
    })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, updateAccount, updatePassword }
