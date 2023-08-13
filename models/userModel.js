const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    scrapedData: [{
        url:{
            type:String,
            // required:true,
        },
        title:{
            type:String,
            // required:true,
        },
        price:{
            type:Number,
            // required:true,
        },
        description:{
            type:String,
            default:""
        },
        noOfReviews:{
            type:Number
        },
        ratings:{
            type:Number
        },
        mediaCount:{
            type:Number
        },
      }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);