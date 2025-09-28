import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Salary({ sal }) {
  const {
    _id,
    employee_id,
    name,
    designation,
    month,
    basicSalary,
    overtime,
    bonus,
    allowances,
    deductions,
    totals,
    createdAt,
    updatedAt,
  } = sal;

  const navigate = useNavigate();

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this salary record?"
    );

    if (!confirmDelete) return; // ❌ stop if user cancels

    try {
      await axios.delete(`http://localhost:5000/salaries/${_id}`);
      alert("Salary record deleted successfully ✅");
      navigate(0); // ✅ refresh page after delete
    } catch (err) {
      console.error("Failed to delete salary:", err);
      alert("❌ Failed to delete salary. Please try again.");
    }
  };

  return (
    <tr className="bg-white border-b border-[#1B5E20] hover:bg-[#A5D6A7] transition">
      {/* Employee Details */}
      <td className="px-4 py-2">{employee_id}</td>
      <td className="px-4 py-2">{name}</td>
      <td className="px-4 py-2">{designation}</td>

      {/* Salary Month */}
      <td className="px-4 py-2">{month}</td>

      {/* Basic Salary */}
      <td className="px-4 py-2">Rs {basicSalary?.toLocaleString()}</td>

      {/* Overtime */}
      <td className="px-4 py-2">
        Hours: {overtime?.hours || 0}, Days: {overtime?.days || 0}, Pay: Rs{" "}
        {overtime?.pay?.toLocaleString() || 0}
      </td>

      {/* Bonus */}
      <td className="px-4 py-2">
        Rate: {bonus?.rate || 0}%, Amount: Rs{" "}
        {bonus?.amount?.toLocaleString() || 0}
      </td>

      {/* Allowances */}
      <td className="px-4 py-2">
        {allowances && allowances.length > 0 ? (
          allowances.map((a, index) => (
            <div key={index}>
              {a.name}: Rs {a.amount?.toLocaleString()}
            </div>
          ))
        ) : (
          <span>None</span>
        )}
      </td>

      {/* Deductions */}
      <td className="px-4 py-2">
        No Pay: Rs {deductions?.noPay?.toLocaleString() || 0}, EPF: Rs{" "}
        {deductions?.epf?.toLocaleString() || 0}, APIT: Rs{" "}
        {deductions?.apit?.toLocaleString() || 0}, Other: Rs{" "}
        {deductions?.other?.toLocaleString() || 0}
      </td>

      {/* Totals */}
      <td className="px-4 py-2">
        Total Allowances: Rs {totals?.totalAllowances?.toLocaleString() || 0},{" "}
        Total Deductions: Rs {totals?.totalDeductions?.toLocaleString() || 0},
        Net: Rs {totals?.netSalary?.toLocaleString() || 0}
      </td>

      {/* Timestamps */}
      <td className="px-4 py-2">{new Date(createdAt).toLocaleString()}</td>
      <td className="px-4 py-2">{new Date(updatedAt).toLocaleString()}</td>

      {/* Actions */}
      <td className="px-4 py-2 flex space-x-2">
        <Link
          to={`/Paydetails/${_id}`}
          className="px-3 py-1 rounded-md bg-[#4CAF50] text-white hover:bg-[#388E3C] transition"
        >
          Update
        </Link>
        <button
          onClick={deleteHandler}
          className="px-3 py-1 rounded-md bg-[#E53935] text-white hover:bg-[#B71C1C] transition"
        >
          Delete
        </button>
      </td>

      {/* Salary Slip */}
      <td className="px-4 py-2 flex space-x-2">
        <Link
          to={`/salarySlip/${_id}`}
          className="px-3 py-1 rounded-md bg-[#4CAF50] text-white hover:bg-[#388E3C] transition"
        >
          View Slip
        </Link>
      </td>
    </tr>
  );
}

export default Salary;
