const { Pool } = require("pg")
require("dotenv").config()

console.log("Connecting to:", process.env.DATABASE_URL)

let pool

if (process.env.NODE_ENV === "production") {
    // Render
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    })
    } else {
    // Local
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
    }

    module.exports = {
    async query(text, params) {
        try {
        const res = await pool.query(text, params)
        console.log("Executed query:", text)
        return res
        } catch (error) {
        console.error("Database query error:", error.message)
        throw error
        }
    },
}