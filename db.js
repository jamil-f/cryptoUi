const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABSE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
});

module.exports = pool;