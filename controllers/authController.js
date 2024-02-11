const bcrypt = require('bcrypt');
const pool = require('../db');

exports.signup = async (req, res) => {
    const { accountId, email, password, number, businessname, location } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (accountId, email, password, number, businessname, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [accountId, email, hashedPassword, number, businessname, location]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

