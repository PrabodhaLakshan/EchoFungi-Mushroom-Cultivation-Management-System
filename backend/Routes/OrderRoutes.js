const express = require("express");
const PDFDocument = require("pdfkit");
const Order = require("../Model/OrderModel");
const OrderController = require("../Controllers/OrderControllers");

const router = express.Router();

//  CRUD routes
router.get("/", OrderController.getAllOrders);
router.post("/", OrderController.addOrder);
router.get("/:id", OrderController.getById);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

//  Generate PDF report for all orders
router.get("/report/pdf", async (req, res) => {
  try {
    const orders = await Order.find();

    const doc = new PDFDocument();
    const filename = "Order_Report.pdf";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("📦 Order Details Report", { align: "center" });
    doc.moveDown();

    orders.forEach(o => {
      doc.fontSize(12).text(`Order ID: ${o.OrderId}`);
      doc.text(`Shop Name: ${o.ShopName}`);
      doc.text(`Product ID: ${o.ProductId}`);
      doc.text(`Order Date: ${new Date(o.OrderDate).toLocaleDateString()}`);
      doc.text(`Quantity: ${o.Quantity}`);
      doc.text(`Status: ${o.Status}`);
      doc.text(`Delivered Date: ${o.DeliveredDate ? new Date(o.DeliveredDate).toLocaleDateString() : "Not Delivered"}`);
      doc.text(`Sales ID: ${o.SalesId || "N/A"}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
