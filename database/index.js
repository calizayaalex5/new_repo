/* ***************
    * Connection Pool
    * SSL Object needed for local testing of app
    * But will cause problems in production environment
    * If - else will make determination which to use
    * *************** */
const { Pool } = require("pg")
require("dotenv").config()

let pool

// Development (local)
if (process.env.NODE_ENV === "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: false,
        },
    })

    // Logging wrapper for development
    module.exports = {
        async query(text, params) {
        try {
            const res = await pool.query(text, params)
            console.log("executed query", { text })
            return res
        } catch (error) {
            console.error("error in query", { text })
            throw error
        }
        },
    }
    }

    // Production (Render)
    else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
        rejectUnauthorized: false,   // <— OBLIGATORIO EN RENDER
        },
    })

    module.exports = pool
}
