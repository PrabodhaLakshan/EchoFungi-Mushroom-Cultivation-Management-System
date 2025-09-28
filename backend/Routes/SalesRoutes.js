const express = require("express");
const PDFDocument = require("pdfkit");
const router = express.Router();

const Sale = require("../Model/SalesModel");
const SaleController = require("../Controllers/SalesControllers");

// ✅ CRUD Routes
router.get("/", SaleController.getAllSales);
router.post("/", SaleController.addSales);
router.get("/:id", SaleController.getById);
router.put("/:id", SaleController.updatesale);
router.delete("/:id", SaleController.deletesale);

// ✅ PDF Report Route
router.get("/report/pdf", async (req, res) => {
  try {
    const sales = await Sale.find();

    const doc = new PDFDocument();
    const filename = "Sales_Report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Sales Details Report", { align: "center" });
    doc.moveDown();

    sales.forEach((s) => {
      doc.fontSize(12).text(` Sales ID: ${s.SalesId}`);
      doc.text(` Shop Name: ${s.ShopName}`);
      doc.text(` Product ID: ${s.ProductId}`);
      doc.text(` Date: ${new Date(s.Date).toLocaleDateString()}`);
      doc.text(` Number of Packets: ${s.NumberOfPackets}`);
      doc.text(` Number of Returns: ${s.NumberOfReturns}`);
      doc.text(` Total Price: ${s.TotalPrice}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
