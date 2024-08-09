const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'myLibrary',
    password: 'LOL123654789LSL',
    port: 5432,
});

module.exports = pool;
