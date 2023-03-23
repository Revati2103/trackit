const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5500
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


app.get('/', (req,res) => {
    res.send('Hello from 5500!');
})
//Create and exchange a public token

// Creates a Link token and returns it
app.get("/create_link_token", async (req, res) => {
    const userId = req.user
    try {
      const tokenResponse = await client.linkTokenCreate({
        user: { client_user_id: userId},
        client_name: "TrackIt",
        language: "en",
        products: ["auth"],
        country_codes: ["US"],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
      });
      res.json(tokenResponse.data);
    } catch (err) {
        console.error(err)
        res.status(500).json({ err: "An error occurred while creating the link token" });
    }
  });
  
app.post("/exchange_public_token", async (req, res) => {
    try {
      const exchangeResponse = await client.itemPublicTokenExchange({
        public_token: req.body.public_token,
      });
      const accessToken = exchangeResponse.data.access_token;
      res.json({ accessToken });
      res.json(true);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => console.log(`Server started on port ${port}`))