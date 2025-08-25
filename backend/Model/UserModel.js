const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,

    },
    age:{
        type:Number,
         required:true,
    },
    gmail:{
        type:String,
         required:true,
    },
    address:{
        type:String,//data type
         required:true,//validate
    }
});

module.exports=mongoose.model(
    "UserModel",//file name
    userSchema //function name
)