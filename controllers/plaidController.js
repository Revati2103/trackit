
const moment = require("moment");


// Load Account and User models
const Account = require("../models/Account");
const User = require("../models/User");

var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

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
const createLinkToken = async (req, res, next) => {
const tokenResponse = await client.linkTokenCreate({
  user: { client_user_id: req.sessionID },
  client_name: "Plaid's Tiny Quickstart",
  language: "en",
  products: ['auth', 'transactions', 'identity', 'income', 'assets', 'investments', 'liabilities'],
  country_codes: ["US"],
  redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
});
res.json(tokenResponse.data);
};

// Exchanges the public token from Plaid Link for an access token
const exchangePublicToken = async (req, res, next) => {
const exchangeResponse = await client.itemPublicTokenExchange({
  public_token: req.body.public_token,
});

// FOR DEMO PURPOSES ONLY
// Store access_token in DB instead of session storage
req.session.access_token = exchangeResponse.data.access_token;
res.json(true);
};

// @route POST api/plaid/accounts/add
// @desc Trade a public token for access token
// @access Private

const addAccount = async(req,res) => {
    try {
        PUBLIC_TOKEN = req.body.public_token;
    
        const userId = req.user.id;
    
        const institution = req.body.metadata.institution;
        const { name, institution_id } = institution;
    
        if (PUBLIC_TOKEN) {
          client
            .exchangePublicToken(PUBLIC_TOKEN)
            .then(exchangeResponse => {
              ACCESS_TOKEN = exchangeResponse.access_token;
              ITEM_ID = exchangeResponse.item_id;
    
              // Check if account already exists for specific user
              Account.findOne({
                userId: req.user.id,
                institutionId: institution_id
              })
                .then(account => {
                  if (account) {
                    console.log("Account already exists");
                  } else {
                    const newAccount = new Account({
                      userId: userId,
                      accessToken: ACCESS_TOKEN,
                      itemId: ITEM_ID,
                      institutionId: institution_id,
                      institutionName: name
                    });
    
                    newAccount.save().then(account => res.json(account));
                  }
                })
                .catch(err => console.log(err)); // Mongo Error
            })
            .catch(err => console.log(err)); // Plaid Error
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// @route DELETE api/plaid/accounts/:id
// @desc Delete an account with the given id
// @access Private

const deleteAccount = async(req,res) => {
    try {
        Account.findById(req.params.id).then(account => {
          // Delete account
          account.remove().then(() => res.json({ success: true }));
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// @route GET api/plaid/accounts/
// @desc Get all Plaid linked accounts for a specific user
// @access Private

const getAllAccounts = async(req,res) => {
    try {
        Account.find({ userId: req.user.id })
          .then(accounts => res.json(accounts))
          .catch(err => console.log(err));
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// @route POST api/plaid/accounts/transactions
// @desc Fetch transactions for past 30 days from all linked accounts
// @access Private

const getTransactions = async(req,res) => {
    try {
        const now = moment();
        const today = now.format("YYYY-MM-DD");
        const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");
    
        let transactions = [];
    
        const accounts = req.body;
    
        if (accounts) {
          accounts.forEach(function(account) {
            ACCESS_TOKEN = account.accessToken;
            const institutionName = account.institutionName;
    
            client
              .getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
              .then(response => {
                transactions.push({
                  accountName: institutionName,
                  transactions: response.transactions
                });
    
                if (transactions.length === accounts.length) {
                  res.json(transactions);
                }
              })
              .catch(err => console.log(err));
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = {
    addAccount,
    deleteAccount,
    getAllAccounts,
    getTransactions,
    createLinkToken,
    exchangePublicToken
}