const express = require("express");
const userController = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

//static api
router.post("/register",userController.registerUser);
router.post("/login",userController.loginUser);


router.post("/scrapedata",authMiddleware, userController.addScrapedData);
router.get("/scrapedata",authMiddleware, userController.getScrapedData);

module.exports = router;