const Bag = require("../Model/BagItem");
; // Use capital B for model

// Create Bag with items
const createBag = async (req, res) => {
  try {
    const { bagName, items } = req.body;

    const newBag = new Bag({ bagName, items });
    await newBag.save();

    res.status(201).json(newBag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Bag (only one bag)
const getBag = async (req, res) => {
  try {
    const bag = await Bag.findOne().populate("items.inventoryId"); // get first/only bag
    if (!bag) return res.status(404).json({ message: "No bag found" });
    res.json(bag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Bag items
const updateBag = async (req, res) => {
  try {
    const { items } = req.body;

    const bag = await Bag.findOneAndUpdate(
      {},
      { $set: { items } }, // replace items array
      { new: true }
    );

    if (!bag) return res.status(404).json({ message: "No bag found" });

    res.json(bag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Bag
const deleteBag = async (req, res) => {
  try {
    await Bag.deleteOne({});
    res.json({ message: "Bag deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBag,
  getBag,
  updateBag,
  deleteBag,
};
