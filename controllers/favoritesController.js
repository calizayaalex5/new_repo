const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities");

const favoritesController = {};

/* Add Favorite */
favoritesController.addFavorite = async function (req, res) {
    const account_id = res.locals.accountData.account_id;
    const inv_id = req.params.inv_id;

    const result = await favoritesModel.addFavorite(account_id, inv_id);

    if (result) {
        req.flash("notice", "Vehicle added to your favorites ❤️");
    } else {
        req.flash("notice", "Could not add favorite.");
    }

    res.redirect(`/inv/detail/${inv_id}`);
    };

    /* Remove Favorite */
favoritesController.removeFavorite = async function (req, res) {
    const account_id = res.locals.accountData.account_id;
    const inv_id = req.params.inv_id;

    const result = await favoritesModel.removeFavorite(account_id, inv_id);

    if (result) {
        req.flash("notice", "Removed from favorites 💔");
    } else {
        req.flash("notice", "Could not remove favorite.");
    }

    // Ruta correcta
    res.redirect("/favorites");
};


    /* List Favorites View */
    favoritesController.showFavorites = async function (req, res) {
    const account_id = res.locals.accountData.account_id;
    const favorites = await favoritesModel.getFavoritesByAccount(account_id);

    const nav = await utilities.getNav();

    res.render("account/favorites", {
        title: "My Favorite Vehicles",
        nav,
        favorites,
        errors: null,
    });
};

module.exports = favoritesController;
