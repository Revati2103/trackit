const express = require('express');
const router = express.Router();
const client = require('../config/plaid')


  //Creates a Link token and return it
router.get("/api/create_link_token", async (req, res, next) => {
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: req.sessionID },
      client_name: "Trackit",
      language: "en",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
    });
    res.json(tokenResponse.data);
  });

  // Exchanges the public token from Plaid Link for an access token
router.post("/api/exchange_public_token", async (req, res, next) => {
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
  
    // FOR DEMO PURPOSES ONLY
    // Store access_token in DB instead of session storage
    req.session.access_token = exchangeResponse.data.access_token;
    res.json(true);
  });

module.exports = router;
