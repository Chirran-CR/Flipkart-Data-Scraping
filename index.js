const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRouter.js");
const { notFound, errorHandler } = require("./controllers/errorController.js");
const dbConnect = require("./config/dbConnect.js");

//configurattion of env. variables
dotenv.config({path:"./.env"});

//connect DB
dbConnect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

//api
app.use("/user",userRouter);
app.use("/",(req,res)=>{
    res.send({
        message:"Welcome to the API to scrape flipkart data",
        listOfAPIs:{
            "createAUser(post)": "user/register =>`to register a new user`",
            "login User(post)": "user/login =>`to login a user`",
            "scrape flipkart data(post)": "user/scrapedata =>`to scrape the data and store it into DB`",
            "get scraped data(get)": "user/scrapedata =>`to get the already stored scraped data from DB`"
        }
    })
})
//for page not found error
app.use(notFound);
//for error in any controller of route
app.use(errorHandler);

//create Server
app.listen(PORT,()=>{
    console.log(`Server is listening at port: ${PORT}`);
});