const express = require("express");
const passport = require("passport");
const router = express.Router()


const {
  addAccount,
  deleteAccount,
  getAllAccounts,
  getTransactions,
 
} = require('../controllers/plaidController')



  // Define the middleware to authenticate the request using passport
const authenticate = passport.authenticate('jwt', { session: false });

//Routes 
router.post("/accounts/add", authenticate, addAccount);
router.delete("/accounts/:id",authenticate, deleteAccount);
router.get("/accounts",authenticate,getAllAccounts);
router.post("/accounts/transactions", authenticate,getTransactions);

  module.exports = router;