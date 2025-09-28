const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
//insert model
const Stock = require("../Model/StockModel");
const Sale = require("../Model/SalesModel");
//insert product controller 
const StockController = require("../Controllers/StockControllers")

router.get("/",StockController.getAllStocks);
router.post("/",StockController.addStocks);
router.get("/:id",StockController.getById);
router.put("/:id",StockController.updatestock);
router.delete("/:id",StockController.deletestock);

router.get("/report/pdf", async (req, res) => {
  try {
    const stocks = await Stock.find();

    const doc = new PDFDocument();
    const filename = "Stock_Report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text(" Stock Details Report", { align: "center" });
    doc.moveDown();

    stocks.forEach((s) => {
      doc.fontSize(12).text(` Stock ID: ${s.StockId}`);
      doc.text(` Mushroom Type: ${s.MushroomType}`);
      doc.text(` Manufacture Date: ${new Date(s.ManufactureDate).toISOString().split("T")[0]}`);
      doc.text(` Expire Date: ${new Date(s.ExpireDate).toISOString().split("T")[0]}`);
      doc.text(` Packets: ${s.Unit}`);
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