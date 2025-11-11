const { Pool } = require('pg') //importa el pool de 'pg'
require('dotenv').config(); // importa el paquete dotenv para manejar variables de entorno
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool //se cerea una variable pool
if (process.env.NODE_ENV === 'production') {
        pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: false,
        },
    })
    } else {
    // ✅ Desarrollo local (pgAdmin o PostgreSQL local)
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
}

// Export universal: funciona igual en ambos entornos
module.exports = {
    async query(text, params) {
        try {
        const res = await pool.query(text, params)
        console.log('Executed query:', { text })
        return res
        } catch (error) {
        console.error('Error in query:', error.message)
        throw error
        }
    },
}