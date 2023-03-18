const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config();


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

  module.exports = client;