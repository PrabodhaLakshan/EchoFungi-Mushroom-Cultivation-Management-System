const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
//insert model
const Product = require("../Model/ProductModel");
const Sale = require("../Model/SalesModel");
//insert product controller 
const ProductController = require("../Controllers/ProductControllers")

router.get("/",ProductController.getAllProducts);
router.post("/",ProductController.addProducts);
router.get("/:id",ProductController.getById);
router.put("/:id",ProductController.updateproduct);
router.delete("/:id",ProductController.deleteproduct);

router.get("/report/pdf", async (req, res) => {
  try {
    const products = await Product.find();

    const doc = new PDFDocument();
    const filename = "Product_Report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text(" Product Details Report", { align: "center" });
    doc.moveDown();

    products.forEach((p) => {
      doc.fontSize(12).text(` Product ID: ${p.ProductId}`);
      doc.text(` Product Name: ${p.ProductName}`);
      doc.text(` Mushroom Type: ${p.MushroomType}`);
      doc.text(` Unit Price: ${p.UnitPrice}`);
      doc.text(` Status: ${p.Status}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});
//export
module.exports = router;