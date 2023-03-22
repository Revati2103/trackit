const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000
const passport = require("passport");
const userRoutes = require('./routes/userRoutes');
const plaidRoutes = require('./routes/plaidRoutes')
const client = require('./config/plaid')



const connectDB = require('./config/db')
connectDB()

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//Passport middleware .

app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//Create and exchange a public token

app.get('/api/create_link_token', async function (request, response) {

    const userId = request.user
    const plaidRequest = {
        user: {
            client_user_id: userId,
        },
        client_name: 'TrackIt',
        products: ['auth'],
        language: 'en',
        redirect_uri: process.env.PLAID_REDIRECT_URI,
        country_codes: ['US'],
    };
    try {
        const createTokenResponse = await client.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        response.status(500).json({ error: "An error occurred" });

        // handle error
    }
});


app.post('/api/exchange_public_token', async function (
    request,
    response,
) {
    const publicToken = request.body.public_token;
    try {
        const plaidResponse = await client.itemPublicTokenExchange({
            public_token: publicToken,
        });
        // These values should be saved to a persistent database and
        // associated with the currently signed-in user
        const accessToken = plaidResponse.data.access_token;
        response.json({ accessToken });
    } catch (error) {
        response.status(500).json({ error: "An error occurred" });

    }
});
// Routes

app.use("/api/users", userRoutes);
app.use("/api/plaid", plaidRoutes);




app.get('/', (req,res) => {
    res.send("Hello from port 5000!")
})


app.listen(port, () => console.log(`Server started on port ${port}`))