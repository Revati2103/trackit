const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000
const passport = require("passport");
const userRoutes = require('./routes/userRoutes');
const plaidRoutes = require('./routes/plaidRoutes')


const connectDB = require('./config/db')
connectDB()

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//Passport middleware .

app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

// Routes

app.use("/api/users", userRoutes);
app.use("/api/plaid", plaidRoutes);



app.listen(port, () => console.log(`Server started on port ${port}`))