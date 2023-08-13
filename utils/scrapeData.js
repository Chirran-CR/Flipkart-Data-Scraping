const request = require("request");
const cheerio = require("cheerio");
const {titleSelector, priceSelector, descriptionSelector, noOfRatingAndReviewSelector, ratingSelector, mediaCountSelector} = require("../constants/constants.js");

const scrapeData = (url) =>{
   return new Promise((resolve, reject) => {
    request(url,(err,response,html)=>{
        if(err){
            reject(err);
        }else{
            const $ = cheerio.load(html);

            //title
            const selectedhtmlForTitle = $(titleSelector);
            const title = $(selectedhtmlForTitle[0]).text();

            //price
            const selectedHtmlForPrice = $(priceSelector);
            const price = $(selectedHtmlForPrice[0]).text();

            //description
            const selectedHtmlForDescription = $(descriptionSelector);
            const description = $(selectedHtmlForDescription[0]).text();

            //numer of reviews & ratings
            const selectedHtmloForRatingsAndReviews = $(noOfRatingAndReviewSelector);
            const noOfReviews = $(selectedHtmloForRatingsAndReviews[1]).text();
            const noOfRatings = $(selectedHtmloForRatingsAndReviews[0]).text();
            const noOfReviewAndRatings = noOfRatings + " " +noOfReviews;
            //Rating
            const selectedHtmlForRating = $(ratingSelector);
            const rating = $(selectedHtmlForRating[0]).text();
    
            //No of media counts
            const selectedHtmlForMediaCount = $(mediaCountSelector);
            const mediaCount = selectedHtmlForMediaCount.length;
            let returnedValue = {title,price,description,noOfReviewAndRatings, rating, mediaCount};
            resolve (returnedValue);
        }
        
    
    })
   })
}


module.exports = scrapeData;