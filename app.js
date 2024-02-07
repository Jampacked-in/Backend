const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/authRoutes');
const pool = require('./db/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
