const { Pool } = require('pg') //importa el pool de 'pg'
require('dotenv').config(); // importa el paquete dotenv para manejar variables de entorno
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool //se cerea una variable pool
if (process.env.NODE_ENV === 'development') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        }, // objeto SSL para conexiones seguras
    })

    // Added for troubleshooting queries
    // during development
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params)
                console.log('Executed query:', { text })
                return res
            } catch (error) {
                console.error('error in query', { text })
                throw error
            }
        },
    }; // exporta un objeto con una función query para ejecutar consultas
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    module.exports = pool
}
