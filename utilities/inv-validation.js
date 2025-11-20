const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")
const invModel = require("../models/inventory-model")

const invValidate = {}

invValidate.inventoryRules = () => {
    return [
        body("classification_id")
        .notEmpty().withMessage("Please choose a classification."),

        body("inv_make")
        .trim()
        .notEmpty().withMessage("Please provide a make."),

        body("inv_model")
        .trim()
        .notEmpty().withMessage("Please provide a model."),

        body("inv_year")
        .isInt({ min: 1900, max: 2100 })
        .withMessage("Please provide a valid year."),

        body("inv_description")
        .trim()
        .notEmpty().withMessage("Please provide a description."),

        body("inv_image")
        .trim()
        .notEmpty().withMessage("Please provide an image path."),

        body("inv_thumbnail")
        .trim()
        .notEmpty().withMessage("Please provide a thumbnail path."),

        body("inv_price")
        .isFloat({ min: 0 })
        .withMessage("Please provide a valid price."),

        body("inv_miles")
        .isInt({ min: 0 })
        .withMessage("Please provide valid miles."),

        body("inv_color")
        .trim()
        .notEmpty().withMessage("Please provide a color.")
    ]
    }

    invValidate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(
        req.body.classification_id
        )

        return res.render("./inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        classificationList,
        errors,
        locals: req.body
        })
    }

    next()
}

module.exports = invValidate