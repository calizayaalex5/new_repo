const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");

// Must be logged in to access favorites
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.showFavorites)
);

router.post(
    "/add/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.addFavorite)
);

router.post(
    "/remove/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.removeFavorite)
);

module.exports = router;
