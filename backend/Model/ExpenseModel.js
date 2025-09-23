const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AutoIncrement = require("mongoose-sequence")(mongoose);

const expenseSchema = new Schema({
    date:{
        type:Date,
        required: true,
    },

    category:{
        type:String,
    },

    description:{
        type:String,
    },

    paymentMethod:{
        type:String,
       
    },

    amount:{
        type:Number,
        required: true,
    }
});

expenseSchema.plugin(AutoIncrement, { inc_field: "expenseId" });

module.exports = mongoose.model(
    "ExpenseModel",
    expenseSchema
)