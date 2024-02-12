const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db/index');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const router = express.Router();

app.use(session({
    secret: 'your_secret_key', // Replace 'your_secret_key' with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto', httpOnly: true } // Use 'secure: true' if you're serving your site over HTTPS
}));

router.post('/api/auth/signup', async (req, res) => {
    const { accountId, email, password, number, businessname, location } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (accountId, email, passkey, phonenumber, businessname, geolocation) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [accountId, email, hashedPassword, number, businessname, location]
        );
        console.log(newUser.rows[0]);
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log("Login route hit");
    try {
        const userQueryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQueryResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = userQueryResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.passkey); 
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.session.user = { id: user.id, email: user.email };
        res.status(200).json({ id: user.id, email: user.email, message: "Login successful" });
    } catch (error) {
        console.error("Error details:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }    
});


router.get('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
        res.clearCookie('sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

router.get('api/auth/current-user', (req, res) => {
    res.status(200).json(req.session.user);
});

app.use(router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
