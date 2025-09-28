const express = require("express");
const PDFDocument = require('pdfkit');
const Customer = require("../Model/CustomerModel");
//insert customer controller 
const CustomerController = require("../Controllers/CustomerControllers")

const router = express.Router();

router.get("/",CustomerController.getAllCustomers);
router.post("/",CustomerController.addCustomers);
router.get("/:id",CustomerController.getById);
router.put("/:id",CustomerController.updatecustomer);
router.delete("/:id",CustomerController.deletecustomer);
//pdf
router.get("/report/pdf", async (req, res) => {
  try {
    const customers = await Customer.find();

    const doc = new PDFDocument();
    const filename = "Customer_Report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text(" Customer Details Report", { align: "center" });
    doc.moveDown();

    customers.forEach(c => {
      doc.fontSize(12).text(` ID: ${c.CustomerId}`);
      doc.text(` Shop: ${c.ShopName}`);
      doc.text(` Owner: ${c.OwnerName}`);
      doc.text(` Email: ${c.Email}`);
      doc.text(` Phone: ${c.PhoneNo}`);
      doc.text(` City: ${c.City}`);
      doc.text(` Status: ${c.Status}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});
router.get("/:id",CustomerController.getById);

//export
module.exports = router;