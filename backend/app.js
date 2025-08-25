
//pass==PEBoucdH5xqbb77k



const express = require("express");

const mongoose =require("mongoose");
const userrouter =require("./Routes/UserRoutes")







const app= express();
const cors =require("cors");
//middleware
app.use(express.json());
app.use(cors());
app.use("/users",userrouter);//router varibale in line 9




mongoose.connect("mongodb+srv://admin:PEBoucdH5xqbb77k@cluster0.ipui4cg.mongodb.net/")
.then(()=> console.log("Connect to Mongo DB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));


module.exports = app; // Export the app for testing purposes