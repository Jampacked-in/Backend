const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db/index');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const cookie = require('cookie-parser');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'false', httpOnly: true }
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
app.use(cors(
    {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
    }    
));

app.use(express.json());
const router = express.Router();
app.use(router);

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
        const token = jwt.sign({ accountId: user.accountId, email : email.email }, 'your_jwt_secret', { expiresIn: '1d' });

        // Note: Set secure to false for localhost development, and consider setting it based on NODE_ENV or a similar environment variable for production
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            secure: false, // Important for localhost. Set to true in production if using HTTPS.
            sameSite: 'Lax' // Can help with CSRF protection and is generally a good default
        });
        req.session.user = { id: user.accountId, email: user.email };
        res.status(200).json({ id: user.accountId, email: user.email, message: "Login successful", token: token });
    } catch (error) {
        console.error("Error details:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }   
});

router.post('/api/auth/logout', (req, res) => {
    try {
        console.log("Logout route hit");
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            }
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        console.error("Error details:", error.message);
        console.error("Stack trace:", error.stack);
    }
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            req.accountId = decoded.accountId;
            req.email = decoded.email;
            next();
        });
    }
}

router.get('/api/auth', verifyUser , (req, res) => {
    return res.status(200).json({ accountId: req.accountId, email: req.email});
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
