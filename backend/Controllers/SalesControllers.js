const Sale = require("../Model/SalesModel");

const getAllSales = async (req,res,next) => {
   let  Sales;

   try{
    Sales= await Sale.find();
   }catch (err) {
        console.log(err);
   }
   //not found
   if (Sales){
        return res.status(404).json({message:"Product not found"});
   }
   //display
   return res.status(200).json({Sales})

};

//insert
const addSales = async (req,res,next) => {


    const {CustomerId,NumberOfPackets,NumberOfReturns,Date,TotalPrice} = req.body;

    let Sales;

    try{
        Sales = new Sale({CustomerId,NumberOfPackets,NumberOfReturns,Date,TotalPrice});
        await Sales.save();
    }catch (err) {
        console.log(err);
    }
    //not insert Sales
     if (!Sales){
        return res.status(404).json({message:"unable to add Sales"});
   }
   return res.status(200).json({ Sales});
    
};

//get by id

const getById = async (req,res,next)=> {

    const id = req.params.id;

    let Sales;

    try{
    Sales = await Sale.findById(id);
    }catch (err) {
        console.log(err);
    }
     //not available Sales
     if (!Sales){
        return res.status(404).json({message:"Sales not found"});
   }
   return res.status(200).json({ Sales});
    

}

//update
const updateSale = async (req,res,next)=> {

    const id = req.params.id;
    const {CustomerId,NumberOfPackets,NumberOfReturns,Date,TotalPrice} = req.body;

    let Sales;

    try{
        Sales = await Sale.findByIdAndUpdate(id,{CustomerId:CustomerId,NumberOfPackets:NumberOfPackets,NumberOfReturns:NumberOfReturns,Date:Date,TotalPrice:TotalPrice});
        Sales = await Sales.save();
    }catch (err) {
        console.log(err);
    }
     //not Sale
     if (!Sales){
        return res.status(404).json({message:"Unable to update Sale details"});
   }
   return res.status(200).json({ Sales});

}

//delete

const deleteSale = async (req,res,next)=> {

    const id = req.params.id;
   
    let Sales;

    try{
    Sales = await Sale.findByIdAndDelete(id);
    }catch (err) {
        console.log(err);
    }
     //not available Sales
     if (!Sales){
        return res.status(404).json({message:"Unable to delete Sale details"});
   }
   return res.status(200).json({ Sales});

}

exports.getAllSales = getAllSales;
exports.addSales = addSales;
exports.getById = getById;
exports.updateSale = updateSale;
exports.deleteSale = deleteSale;