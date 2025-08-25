const express = require("express");
const router =express.Router();
//Insert Model
const User = require("../Model/UserModel");
//Insert User Controller
const UserController = require("../Controllers/UserControllers");

router.get("/",UserController.getAllUsers);
router.post("/",UserController.addUsers);
router.get("/:id",UserController.getbyId);
router.put("/:id",UserController.updateUser);
router.delete("/:id",UserController.deleteuser);
//export
module.exports=router;
