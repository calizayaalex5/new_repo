const pool = require("../database/");

module.exports = {
    async addFavorite(account_id, inv_id) {
        try {
        const sql = `
            INSERT INTO favorites (account_id, inv_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
        } catch (error) {
        console.error("addFavorite error:", error.message);
        return null;
        }
    },

    async removeFavorite(account_id, inv_id) {
        try {
        const sql = `
            DELETE FROM favorites
            WHERE account_id = $1 AND inv_id = $2;
        `;
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rowCount;
        } catch (error) {
        console.error("removeFavorite error:", error.message);
        return null;
        }
    },

    async getFavoritesByAccount(account_id) {
        try {
        const sql = `
            SELECT i.*
            FROM favorites f
            JOIN inventory i ON f.inv_id = i.inv_id
            WHERE f.account_id = $1
            ORDER BY f.created_at DESC;
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
        } catch (error) {
        console.error("getFavoritesByAccount error:", error.message);
        return [];
        }
    }
};
