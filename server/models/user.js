const db = require('../config/db');
const bcrypt = require('bcryptjs');


const User = {
    create: async (email, password, name) => {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, hash, name]
        );
        return result;
    },
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows;
    },
};


module.exports = User;

