const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000
const passport = require("passport");
const userRoutes = require('./routes/userRoutes');
const plaidRoutes = require('./routes/plaidRoutes')

const session = require("express-session");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");



const connectDB = require('./config/db')
connectDB()

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
    // FOR DEMO PURPOSES ONLY
    // Use an actual secret key in production
    session({ secret: "bosco", saveUninitialized: true, resave: true })
  );

//Passport middleware .

app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

// Configuration for the Plaid client
const config = new Configuration({
    basePath: PlaidEnvironments[process.env.REACT_APP_ENV],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.REACT_APP_CLIENT_ID,
        "PLAID-SECRET": process.env.REACT_APP_SECRET,
        "Plaid-Version": "2020-09-14",
      },
    },
  });
  
  //Instantiate the Plaid client with the configuration
  const client = new PlaidApi(config);
  
  //Creates a Link token and return it
  app.get("/api/create_link_token", async (req, res, next) => {
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: req.sessionID },
      client_name: "TrackIt",
      language: "en",
      products: ["auth"],
      country_codes: ["US"],
      redirect_uri: process.env.PLAID_REDIRECT_URI,
    });
    res.json(tokenResponse.data);
  });
  
  // Exchanges the public token from Plaid Link for an access token
  app.post("/api/exchange_public_token", async (req, res, next) => {
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
  
    // FOR DEMO PURPOSES ONLY
    // Store access_token in DB instead of session storage
    req.session.access_token = exchangeResponse.data.access_token;
    res.json(true);
  });
  
  // Fetches balance data using the Node client library for Plaid
  app.get("/api/balance", async (req, res, next) => {
    const access_token = req.session.access_token;
    const balanceResponse = await client.accountsBalanceGet({ access_token });
    res.json({
      Balance: balanceResponse.data,
    });
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/plaid", plaidRoutes);


app.listen(port, () => console.log(`Server started on port ${port}`))