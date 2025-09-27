import React, { useState, useEffect } from "react";
import axios from "axios";
import BatchNav from "../BatchNav/BatchNav";
function BagForm() {
  const [bagName, setBagName] = useState("");
  const [items, setItems] = useState([{ inventoryId: "", quantity: "" }]);
  const [inventory, setInventory] = useState([]);

  // Fetch inventory list from backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/items");
        console.log("Inventory API response:", res.data);

        // Extract the array from res.data.items
        if (res.data && Array.isArray(res.data.items)) {
          setInventory(res.data.items);
        } else {
          console.error("Unexpected inventory format:", res.data);
          setInventory([]);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };
    fetchInventory();
  }, []);

  // Handle change in inventory selection or quantity
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, { inventoryId: "", quantity: "" }]);
  };

  // Remove item row
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Submit bag to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { bagName, items };
      console.log("Submitting Bag:", payload);

      await axios.post("http://localhost:5000/bag", payload);
      alert("Bag saved successfully!");

      // Reset form
      setBagName("");
      setItems([{ inventoryId: "", quantity: "" }]);
    } catch (err) {
      console.error("Error saving bag:", err);
      alert("Failed to save bag");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
      <BatchNav />
      <h2 className="text-2xl font-bold mb-6">Create Mushroom Bag</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bag Name */}
        <div>
          <label className="block font-medium mb-2">Bag Name</label>
          <input
            type="text"
            value={bagName}
            onChange={(e) => setBagName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Bag Items */}
        <div>
          <label className="block font-medium mb-2">Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-3 items-center">
              {/* Inventory Dropdown */}
              <select
                value={item.inventoryId}
                onChange={(e) =>
                  handleItemChange(index, "inventoryId", e.target.value)
                }
                className="flex-1 border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Item</option>
                {inventory.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.Item_name}
                  </option>
                ))}
              </select>

              {/* Quantity */}
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="w-32 border rounded-lg px-3 py-2"
                min="1"
                required
              />

              {/* Remove Button */}
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg"
                >
                  X
                </button>
              )}
            </div>
          ))}

          {/* Add Item Button */}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            + Add Item
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Save Bag
        </button>
      </form>
    </div>
  );
}

export default BagForm;
