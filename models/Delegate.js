const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  delegateId:String,
  firstName:String,
  lastName:String,
  email:String,
  phone:String,
  institution:String,
  year:String,
  workshops:String,
  checked:{type:Boolean,default:false},
  timestamp:Date
});

module.exports = mongoose.model("Delegate",schema);