const express = require("express");
const passport = require("passport");
const plaid = require("plaid");
const router = express.Router()
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

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

  // Define the middleware to authenticate the request using passport
const authenticate = passport.authenticate('jwt', { session: false });

//Routes 

router.post("/accounts/add", authenticate, addAccount);
router.delete("/accounts/:id",authenticate, deleteAccount);
router.get("/accounts",authenticate,getAllAccounts);
router.post("/accounts/transactions", authenticate,getTransactions);

  module.exports = router;