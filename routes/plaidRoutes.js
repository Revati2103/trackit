const express = require("express");
const passport = require("passport");
const plaid = require("plaid");
const router = express.Router()
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const {
  addAccount,
  deleteAccount,
  getAllAccounts,
  getTransactions
} = require('../controllers/plaidController')

// Configuration for the Plaid client
const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
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
    client_name: "Plaid's Tiny Quickstart",
    language: "en",
    products: ["auth"],
    country_codes: ["US"],
    redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
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

  // Define the middleware to authenticate the request using passport
const authenticate = passport.authenticate('jwt', { session: false });

//Routes 

router.post("/accounts/add", authenticate, addAccount);
router.delete("/accounts/:id",authenticate, deleteAccount);
router.get("/accounts",authenticate,getAllAccounts);
router.post("/accounts/transactions", authenticate,getTransactions);

  module.exports = router;