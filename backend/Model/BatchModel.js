const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema({
    createDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    removedQuantity: {
        type: Number,
        required: true,
    },
    expireDate: {
        type: Date,
        required: true,
    }
    
});
module.exports = mongoose.model("BatchModel",//file name
                                batchSchema //function name
)