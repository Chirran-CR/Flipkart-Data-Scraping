const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/userModel"); //get the User collection or table
const tryCatch = require("../utils/tryCatch");
const scrapeData = require("../utils/scrapeData");

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
    const email = req.user.email;
    const user = req.user;
    const url = req.body.url;
    //check if url is already added then send response as "no need to add, already added"
    const listOfAllAddedUrlObjs = user.scrapedData; //get all the saved url info
    let isUrlAlreadyPresent = false;
    listOfAllAddedUrlObjs.map((scrapedObj)=>{
        if(url === scrapedObj.url){
            isUrlAlreadyPresent = true;
        }
    })
    if(!isUrlAlreadyPresent){ //if url is not present
        const scrapedVal = await scrapeData(url);
        const scrapedObj = {
            url:url,
            title:scrapedVal.title,
            price:scrapedVal.price,
            description:scrapedVal.description,
            noOfRatingsAndReviews:scrapedVal.noOfReviewAndRatings,
            rating:scrapedVal.rating,
            mediaCount:scrapedVal.mediaCount
        };
        listOfAllAddedUrlObjs.push(scrapedObj);
        //update the database
        const dataAfterUpdate = await User.findOneAndUpdate({email:email},{scrapedData:listOfAllAddedUrlObjs},{returnOriginal:false});

        res.status(200).send({
            message:"Url is added and data is fetched successfully",
            updatedData:dataAfterUpdate,
        })
    }else{// if the url is not present(not scraped before by this user)
        res.status(200).send({
            message:"This url has already scraped and data has stored in db, so need of further scrapping."
        })
    }
});

const getScrapedData = tryCatch(async (req,res)=>{
    const user = req.user;
    const listOfAllAddedUrlObjs = user.scrapedData;
    const url = req.body.url;
    console.log("url is",url);
    //check the url is present or not( for the requested user)
    let isPresentUrl = false;
    let scrapedDataForUrl;
    listOfAllAddedUrlObjs.map((urlObj)=>{
        console.log("inside");
        console.log("urlObj.url is:",urlObj.url);
        if(urlObj.url === url){
            console.log("innner side");
            isPresentUrl = true;
            scrapedDataForUrl = urlObj;
        }
    })
    //if prsent then return the data
    if(isPresentUrl){
        res.status(200).send({
            message:"Scraped data has successfully obtained from Database.",
            scrappedData:scrapedDataForUrl,
        })
    }else{//else send error msg
        res.status(200).send({
            message:"Requested URL is not available for the logged in User, kindly enter the valid URL."
        })
    }
    
})

module.exports = {
  registerUser,
  loginUser,
  addScrapedData,
  getScrapedData,
};
