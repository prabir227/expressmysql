const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'prabir',
    password: '227@Prabir',
    database: 'students_db',

})

module.exports = pool;