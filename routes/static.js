const express = require("express")
const path = require("path")
const router = express.Router()

// Carpeta public
router.use(express.static(path.join(__dirname, "..", "public")))

// Subcarpetas (opcional, pero correcto)
router.use("/css", express.static(path.join(__dirname, "..", "public", "css")))
router.use("/js", express.static(path.join(__dirname, "..", "public", "js")))
router.use("/images", express.static(path.join(__dirname, "..", "public", "images")))

module.exports = router

