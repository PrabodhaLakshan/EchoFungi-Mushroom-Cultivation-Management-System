import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Exp(props) {
  const { _id, date, expenseId, category, description, paymentMethod, amount } = props.ex;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toISOString().split("T")[0];
  };

  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/expenses/${_id}`);
      navigate("/exdetails");
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  return (
    <tr className="bg-white border-b border-green-200 hover:bg-[#A5D6A7] transition">
      <td className="px-4 py-2">{formatDate(date)}</td>
      <td className="px-4 py-2">{expenseId}</td>
      <td className="px-4 py-2">{category}</td>
      <td className="px-4 py-2">{description}</td>
      <td className="px-4 py-2">{paymentMethod}</td>
      <td className="px-4 py-2">Rs. {amount}</td>
      <td className="px-4 py-2 space-x-2">
        <Link
          to={`/exdetails/${_id}`}
          className="px-3 py-1 bg-[#4CAF50] text-white rounded hover:bg-[#1B5E20] transition"
        >
          Update
        </Link>
        <button
          onClick={deleteHandler}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default Exp;
