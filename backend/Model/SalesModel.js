const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const salesSchema = new Schema({
    
    CustomerId :{
        type:String,//datatype
        required:true,//validate
    },
    NumberOfPackets :{
        type:String,//datatype
        required:true,//validate
    },
   
    NumberOfReturns :{
        type:String,//datatype
        required:true,//validate
    },
     Date :{
        type:Date,//datatype
        required:true,//validate
    },
     TotalPrice:{
        type:Number,//datatype
        required:true,//validate
    },
});
// Auto-increment field 'id'
salesSchema.plugin(AutoIncrement, { inc_field: "SalesId" });

module.exports = mongoose.model("SalesModel",salesSchema);