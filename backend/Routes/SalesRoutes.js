const express = require("express");
const router = express.Router();

//insert model
const Sale = require("../Model/SalesModel");
//const Product= require("../Model/ProductModel");
//insert customer controller 
const SaleController = require("../Controlers/SalesControllers")

router.get("/",SaleController.getAllSales);
router.post("/",SaleController.addSales);
router.get("/:id",SaleController.getById);
router.put("/:id",SaleController.updateSale);
router.delete("/:id",SaleController.deleteSale);
//export
module.exports = router;