const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5500
const userRoutes = require('./routes/userRoutes');
const plaidRoutes = require('./routes/plaidRoutes')
const client = require('./config/plaid')
const jwt = require('jsonwebtoken');
const passport = require("passport");
const connectDB = require('./config/db')
connectDB()

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//Passport middleware .

app.use(passport.initialize());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'client/build')));

// Middleware function to extract user ID from JWT token
const extractUserId = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decodedToken.id;
    console.log(req.userId);
    next();
  });
};



//Passport Config
require("./config/passport")(passport);



// Routes

app.use("/api/users", userRoutes);
app.use("/api/plaid", plaidRoutes);





// Creates a Link token and returns it
app.get("/api/create_link_token", extractUserId, async (req, res) => {

    try {
      const { userId } = req;
      console.log("user:", userId);
      const tokenResponse = await client.linkTokenCreate({
        user: { client_user_id: userId},
        client_name: "TrackIt",
        language: "en",
        products: ["auth", "transactions"],
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

  //Create and exchange a public token

  app.post("/api/exchange_public_token", extractUserId, async (req, res) => {
    try {
      const exchangeResponse = await client.itemPublicTokenExchange({
        public_token: req.body.public_token,
      });
      console.log({exchangeresp: exchangeResponse, body: req.body})
      console.log("Body:", req.body)
      //console.log({public_token: req.body.public_token});
      const accessToken = exchangeResponse.data.access_token;
      const itemId = exchangeResponse.data.item_id;
      //console.log({public_token: req.body.public_token,access_token: accessToken, item_id: itemId });
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
