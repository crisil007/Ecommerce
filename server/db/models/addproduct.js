const mongoose=require('mongoose')
const user_type=require("./user_type")
const category = require('./category')

const AddData=new mongoose.Schema({

    name:{
        type:String,
    },

     price:{
        type:String,
     },

     image:{
        type:String,
     },
     category:{
       type:mongoose.Schema.Types.ObjectId,
           ref:"category"
     }
})
module.exports =mongoose.model("products",AddData)