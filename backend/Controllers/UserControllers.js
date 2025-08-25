const User =require("../Model/UserModel");

const getAllUsers = async (req,res,next)=>{
    let Users;
    //get all 
    try{
        users =await User.find();
    }catch (err){
        console.log(err);
    }

//user not found
if(!users){
    return res.status(404).json({message:"User not found"});
}

//display all users
return res.status(200).json({users});
};

//data Insert
const addUsers=async(req,res,next)=>{
    const{name,gmail,age,address}=req.body;

    let users;//variable

    try{
        users = new User({name,gmail,age,address});
        await users.save();
    }catch (err){
        console.log(err);

    }

    //notisert users
    if(!users){
        return res.status(400).jsond({message:"unable to add users"});

    }
    return res.status(200).json({users})


}
//get by id

const getbyId=async (req,res,next) => {
    const id = req.params.id; //used to route
    let user;
    try{
        user =await User.findById(id);
    }catch (err){
        console.log(err);
    }

 //not available users
    if(!user){
        return res.status(404).json({message:"User not avable"});

    }
    return res.status(200).json({user})    

};
//update data
const updateUser=async  (req,res,next) =>{
      const id = req.params.id; //used to route
      const{name,gmail,age,address}=req.body;

      let users;//variablle

      try{
        users = await User.findByIdAndUpdate(id,{name:name,gmail:gmail,age:age,address:address});
        users= await users.save();
      }catch (err){
         console.log(err);

      }

       if(!users){
        return res.status(404).json({message:"Unabel to update data"});

    }
    return res.status(200).json({users})    






};
//Delete User details
const deleteuser =async  (req,res,next) =>{
    const id=req.params.id;

    let user;//variable
    try{
        user=await User.findByIdAndDelete(id);
    }catch(err){
         console.log(err);
    }
       if(!user){
        return res.status(404).json({message:"Unabel to Delete data"});

    }
    return res.status(200).json({user})    


}

exports.getAllUsers=getAllUsers;
exports.addUsers =addUsers;
exports.getbyId=getbyId;
exports.updateUser=updateUser;
exports.deleteuser=deleteuser;