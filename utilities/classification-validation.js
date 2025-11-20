const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require(".")

const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty().withMessage("Please provide a classification name.")
            .isAlphanumeric().withMessage("No spaces or special characters allowed.")
            .custom(async (name) => {
                const exist = await invModel.checkExistingClassification(name)
                if (exist) {
                    throw new Error("This classification already exist")
                }
            })
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
            locals: req.body
        })
    }

    next()
}

module.exports = validate