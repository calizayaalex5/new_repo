const express = require('express'); //crea una variable local para el express
const router = express.Router(); //el express se guarda de manera local en una funcion router

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public")); //indica que la carpeta publica es estatica y se usara el express
router.use("/css", express.static(__dirname + "public/css")); //indica que toda ruta que contiene css sea referia a publick/css
router.use("/js", express.static(__dirname + "public/js")); //lo mismo que el css pero con javascript
router.use("/images", express.static(__dirname + "public/images")); //lo mismo pero con imagenes
//lo visto previamente es para que el servidor pueda encontrar los archivos estaticos y dirigirlos correctamente
module.exports = router; //ESTE ES MUY IMPORANTE EXPORTA EL ROUTER PARA QUE OTROS ARCHIVOS PUEDAN USARLO



