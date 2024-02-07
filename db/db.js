const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testeTese',
    password: 'goncalo1610',
    port: 5432,
});

module.exports = pool;