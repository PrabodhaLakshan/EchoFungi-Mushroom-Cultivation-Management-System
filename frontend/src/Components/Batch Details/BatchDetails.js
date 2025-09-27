import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import BatchNav from "../BatchNav/BatchNav";

const URL = "http://localhost:5000/batches";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function BatchDetails() {
  const [batches, setBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResult, setNoResult] = useState(false);

  const componentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandler().then((data) => {
      setBatches(data.batches || []);
    });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Batch Report",
    onAfterPrint: () => alert("Batch Report Successfully Downloaded! ✅"),
  });

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredBatches = data.batches.filter((batch) =>
        Object.values(batch).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setBatches(filteredBatches);
      setNoResult(filteredBatches.length === 0);
    });
  };

  const handleSendReport = () => {
    const phoneNumber = "+94718943262";
    const message = `Selected Batch Reports`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(WhatsAppUrl, "_blank");
  };

  // Delete batch
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      await axios.delete(`${URL}/${id}`);
      setBatches((prev) => prev.filter((batch) => batch._id !== id));
    }
  };

  return (
    <div className="ml-64 flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6">
        {/* Sidebar */}
        <BatchNav />

        {/* Report Content (Printable Section) */}
        <div ref={componentRef}>
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Batch Details
          </h1>

          {/* Search Section */}
          <div className="flex gap-3 mb-6 print:hidden">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              name="search"
              placeholder="Search batch details..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Batch Cards */}
          {noResult ? (
            <div className="text-center text-red-600 font-medium">
              <p>No batch found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {batches &&
                batches.map((batch, i) => (
                  <div
                    key={i}
                    className="p-5 border rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        Batch #{i + 1}
                      </h2>
                      <p>
                        <span className="font-medium">Batch ID:</span>{" "}
                        {batch._id}
                      </p>
                      <p>
                        <span className="font-medium">Create Date:</span>{" "}
                        {new Date(batch.createDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Expire Date:</span>{" "}
                        {new Date(batch.expireDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${
                            batch.status.toLowerCase() === "active"
                              ? "bg-green-600"
                              : "bg-red-500"
                          }`}
                        >
                          {batch.status}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Quantity:</span>{" "}
                        {batch.quantity}
                      </p>
                      <p>
                        <span className="font-medium">Removed:</span>{" "}
                        {batch.removedQuantity}
                      </p>
                    </div>

                    {/* Update & Delete Buttons (hidden in print) */}
                    <div className="flex gap-3 mt-4 print:hidden">
                      <button
                        onClick={() => navigate(`/updatebatch/${batch._id}`)}
                        className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(batch._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Action Buttons (hidden in print) */}
        <div className="flex justify-end gap-4 mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Download Report
          </button>
          <button
            onClick={handleSendReport}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Send WhatsApp Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default BatchDetails;
