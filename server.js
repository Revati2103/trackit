const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5500
const passport = require("passport");
const userRoutes = require('./routes/userRoutes');
const plaidRoutes = require('./routes/plaidRoutes')
const client = require('./config/plaid')

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



//Create and exchange a public token

// Creates a Link token and returns it
app.get("/api/create_link_token", async (req, res) => {
    const userId = 'user-id'
    try {
      const tokenResponse = await client.linkTokenCreate({
        user: { client_user_id: userId},
        client_name: "TrackIt",
        language: "en",
        products: ["transactions"],
        country_codes: ["US"],
        redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
      });
      const linkToken = tokenResponse.data.link_token;
      res.json({ link_token: linkToken });
    } catch (err) {
        console.error(err)
        res.status(500).json({ err: "An error occurred while creating the link token" });
    }
  });
  
app.post("/api/exchange_public_token", async (req, res) => {
    try {
      const exchangeResponse = await client.itemPublicTokenExchange({
        public_token: req.body.public_token,
      });
      console.log({exchangeresp: exchangeResponse, body: req.body})
      //console.log({public_token: req.body.public_token});
      const accessToken = exchangeResponse.data.access_token;
      const itemId = exchangeResponse.data.item_id;
      console.log({public_token: req.body.public_token,access_token: accessToken, item_id: itemId });
      res.status(200).json({ access_token: accessToken, item_id: itemId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.get('/', (req,res) => {
    res.send('Hello from 5500!');
})

app.listen(port, () => console.log(`Server started on port ${port}`))
