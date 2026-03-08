const express = require("express");
const Listing =require("../models/listing.js");
const mongoose = require("mongoose");
const InitData = require("./Data.js");







main()

.then(()=>{
    console.log("Your Database connected from your MongoDB");
})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/GoExplore');

 
}


const groupData =async()=>{
  await Listing.deleteMany({});
  await Listing.insertMany(InitData.Data);
  console.log("Your all Data saved from DataBase");
};


groupData();
