const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/userModel"); //get the User collection or table
const tryCatch = require("../utils/tryCatch");

const registerUser = tryCatch(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  //check wheather the user is already registered
  if (!findUser) {
    const newUser = await User.create(req.body);
    //send success response
    res.status(200).send({
      message: "User registered successfully",
      userData: newUser,
    });
  } else {
    //generate error
    throw new Error("User Already Exists");
  }
});

const loginUser = tryCatch(async (req, res) => {
  const email = req.body.email;
  const enteredPsd = req.body.password;

  const userData = await User.findOne({ email: email }); //check by email

  if (userData) {
    const isPsdMatched = await bcrypt.compare(enteredPsd, userData.password);
    if (isPsdMatched) {
      const generateToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", generateToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //24hour 60min 60 sec 1000 mili second =>  1 Day
      });
      res.status(200).send({
        message: "user logged in Successfully",
        loggedInUser: userData,
      });
    } else {
      throw new Error("Invalid Credentials.");
    }
  } else {
    throw new Error("Invalid Credentials! Register!!");
  }
});

const addScrapedData = tryCatch(async (req,res)=>{

});

const getScrapedData = tryCatch(async (req,res)=>{

})

module.exports = {
  registerUser,
  loginUser,
  addScrapedData,
  getScrapedData,
};
