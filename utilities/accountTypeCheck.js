require("dotenv").config()
const jwt = require("jsonwebtoken")

const accountTypeCheck = (req, res, next) => {
    if (!res.locals.loggedin) {
        req.flash("notice", "Please log in to continue.")
        return res.redirect("/account/login")
    }

    const accountData = res.locals.accountData
    if (!accountData) {
        req.flash("notice", "Invalid session. Please log in again.")
        return res.redirect("/account/login")
    }

    const type = accountData.account_type
    
    if (type === "Employee" || type === "Admin") {
        return next()
    }

    req.flash("notice", "You do not have permission to access that page.")
    return res.redirect("/account/")
}

module.exports = accountTypeCheck
