const express=require("express");
const router=express.Router();
const Bagiteam=require("../Model/BagItem");
const BagiteamController=require("../Controllers/bagController");



router.post("/",BagiteamController.createBag);   // Create bag
router.get("/", BagiteamController.getBag);       // Get bag
router.put("/", BagiteamController.updateBag);    // Update bag items
router.delete("/", BagiteamController.deleteBag); // Delete bag


module.exports=router;