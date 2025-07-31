const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const Building = {
    async getAll() {
        const query = 'SELECT * FROM buildings';
        const result = await pool.query(query);
        return result.rows;
    },

    async getById(id) {
        const query = 'SELECT * FROM buildings WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async getNearby(lat, lng, radius) {
        const query = `
            SELECT *, 
                   ST_Distance_Sphere(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance
            FROM buildings
            WHERE ST_DWithin(
                geom,
                ST_SetSRID(ST_MakePoint($1, $2), 4326),
                $3
            )
            ORDER BY distance`;
        const result = await pool.query(query, [lng, lat, radius]);
        return result.rows;
    }
};

module.exports = Building;
