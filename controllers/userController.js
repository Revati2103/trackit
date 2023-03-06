
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load User model
const User = require("../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public

const registerUser = async (req, res) => {
    try {
      const { errors, isValid } = validateRegisterInput(req.body);
  
      // Check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
  
        // Hash password before saving in database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
  
        const savedUser = await newUser.save();
        res.json(savedUser);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

const loginUser = async (req, res) => {
    try {
      const { errors, isValid } = validateLoginInput(req.body);
  
      // Check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      const email = req.body.email;
      const password = req.body.password;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
  
        // Sign token
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ passwordincorrect: "Password incorrect" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
module.exports = {
    registerUser,
    loginUser
};