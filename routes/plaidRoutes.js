const express = require("express");
const passport = require("passport");
const router = express.Router()
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const {
  addAccount,
  deleteAccount,
  getAllAccounts,
  getTransactions,
  createLinkToken,
  exchangePublicToken
} = require('../controllers/plaidController')



  // Define the middleware to authenticate the request using passport
const authenticate = passport.authenticate('jwt', { session: false });

//Routes 
router.get("/api/create_link_token", createLinkToken),
router.post("/api/exchange_public_token",exchangePublicToken),
router.post("/accounts/add", authenticate, addAccount);
router.delete("/accounts/:id",authenticate, deleteAccount);
router.get("/accounts",authenticate,getAllAccounts);
router.post("/accounts/transactions", authenticate,getTransactions);

  module.exports = router;