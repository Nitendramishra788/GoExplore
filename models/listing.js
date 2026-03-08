const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const  Review =require("./review.js");


const info = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [3, "Title must be at least 3 characters"],
    validate: {
  validator: function (v) {
    return /[A-Za-z]/.test(v); // at least one letter required
  },
  message: "Title must contain at least one letter"
},
  },

  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description should be at least 10 characters long"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },

  location: {
    type: String,
    required: [true, "Location is required"],
  },

  country: {
    type: String,
    required: [true, "Country is required"],
  },

  image: {
    url:String,
    filename:String,
  },

  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref: "User",
  }
});

// ess meddelware ka kaam ye h ki jab koi puri listing delete ho to uske sath uska sara reviews bhi dataBase se remove ho jana chahiye ..
info.post("findOneAndDelete" , async(listing)=>{
  if(listing){

    await Review.deleteMany({_id :{$in:listing.reviews}})
  }
 
})

const index = mongoose.model("index", info);

module.exports = index;
