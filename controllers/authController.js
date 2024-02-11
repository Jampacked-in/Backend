const bcrypt = require('bcrypt');
const pool = require('../db');

exports.signup = async (req, res) => {
    const { accountId, email, password, number, businessname, location } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (accountId, email, password, number, businessname, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [accountId, email, hashedPassword, number, businessname, location]
        );
        console.log(newUser.rows[0]);
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        req.session.user = user.rows[0];
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
        res.clearCookie('sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
}

exports.currentUser = (req, res) => {
    res.status(200).json(req.session.user);
}

