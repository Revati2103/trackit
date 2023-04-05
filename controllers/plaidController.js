
const moment = require("moment");
const client = require('../config/plaid')
// Load Account model
const Account = require("../models/Account");

// @route POST api/plaid/accounts/add
// @desc Trade a public token for access token
// @access Private

const addAccount = async(req, res) => {
  try {
    console.log("Request body from addAccount controller", req.body)
    const { public_token, metadata, accessToken, item_id } = req.body;
    console.log('Access Token from addAccount controller:', accessToken);
    const userId = req.user.id;
    const institution = metadata.institution;
    const { name, institution_id } = institution;

    console.log({ Name: name, InstitutionID: institution_id });

    // Check if account already exists for specific user
    const account = await Account.findOne({
      userId: userId,
      institutionId: institution_id,
    });

    if (account) {
      console.log("Account already exists");
      return res.status(400).json({ error: "Account already exists" });
    } else {
      const newAccount = new Account({
        userId: userId,
        accessToken: accessToken,
        itemId: item_id,
        institutionId: institution_id,
        institutionName: name,
      });

      await newAccount.save();
      res.json(newAccount);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


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

const getTransactions = async (req, res) => {
  try {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD");

    const accounts = req.body;
    console.log("Request body from transactions controller", accounts);

    const transactions = await Promise.all(
      accounts.map(async (account) => {
        const { accessToken, institutionName } = account;
        const request = {
          access_token: accessToken,
          start_date: thirtyDaysAgo,
          end_date: today,
        };

        try {
          let transactions = [];
          let response = await client.transactionsGet(request);

          // Handle pagination
          while (response.data["transactions"].length < response.data["total_transactions"]) {
            request["options"] = { offset: response.data["transactions"].length };
            response = await client.transactions.get(request);
            transactions = transactions.concat(response.data["transactions"]);
          }
          transactions = transactions.concat(response.data["transactions"]);

          return { accountName: institutionName, transactions };
        } catch (error) {
          console.log(error);
          throw error;
        }
      })
    );

    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = {
    addAccount,
    deleteAccount,
    getAllAccounts,
    getTransactions,
}