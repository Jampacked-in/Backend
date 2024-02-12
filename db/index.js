const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'PranavSingh31',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
});

module.exports = pool;