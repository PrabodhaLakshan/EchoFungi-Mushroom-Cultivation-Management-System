import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/salaries/${_id}`);
      alert("Salary record deleted successfully ✅");
      navigate(0); // refresh page
    } catch (err) {
      console.error("Failed to delete salary:", err);
      alert("❌ Failed to delete salary. Please try again.");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md border border-[#1B5E20] p-6 hover:shadow-lg transition flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-3 mb-3">
        <div>
          <h2 className="text-xl font-bold text-[#1B5E20] mb-1">Employee ID: {employee_id}</h2>
          <p className="text-gray-700 font-semibold">Name: {name}</p>
          <p className="text-gray-600">Designation: {designation}</p>
          <p className="text-gray-600">Month: {month}</p>
        </div>
        <div className="text-right text-gray-500 text-sm">
          <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Salary Details */}
      <div className="flex flex-col md:flex-row gap-6 mb-4">
        {/* Earnings */}
        <div className="flex-1">
          <h3 className="font-bold text-[#1B5E20] mb-2">Earnings</h3>
          <ul className="space-y-1 text-gray-700">
            <li>Basic Salary: Rs {basicSalary?.toLocaleString()}</li>
            <li>
              Overtime — Hours: {overtime?.hours || 0}, Days: {overtime?.days || 0}, Pay: Rs{" "}
              {overtime?.pay?.toLocaleString() || 0}
            </li>
            <li>
              Bonus — Rate: {bonus?.rate || 0}%, Amount: Rs {bonus?.amount?.toLocaleString() || 0}
            </li>
            {allowances && allowances.length > 0 ? (
              allowances.map((a, index) => (
                <li key={index}>
                  {a.name}: Rs {a.amount?.toLocaleString()}
                </li>
              ))
            ) : (
              <li>Allowances: None</li>
            )}
          </ul>
        </div>

        {/* Deductions */}
        <div className="flex-1">
          <h3 className="font-bold text-red-700 mb-2">Deductions</h3>
          <ul className="space-y-1 text-gray-700">
            <li>No Pay: Rs {deductions?.noPay?.toLocaleString() || 0}</li>
            <li>EPF: Rs {deductions?.epf?.toLocaleString() || 0}</li>
            <li>APIT: Rs {deductions?.apit?.toLocaleString() || 0}</li>
            <li>Other: Rs {deductions?.other?.toLocaleString() || 0}</li>
          </ul>
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-3 mb-4">
        <p className="font-semibold text-gray-800">
          Total Allowances: Rs {totals?.totalAllowances?.toLocaleString() || 0}
        </p>
        <p className="font-semibold text-gray-800">
          Total Deductions: Rs {totals?.totalDeductions?.toLocaleString() || 0}
        </p>
        <p className="text-lg font-bold text-[#1B5E20] mt-2">
          Net Salary: Rs {totals?.netSalary?.toLocaleString() || 0}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-end gap-3 mt-auto">
        <Link
          to={`/Paydetails/${_id}`}
          className="px-4 py-2 rounded-md bg-[#4CAF50] text-white hover:bg-[#388E3C] transition"
        >
          Update
        </Link>
        <button
          onClick={deleteHandler}
          className="px-4 py-2 rounded-md bg-[#E53935] text-white hover:bg-[#B71C1C] transition"
        >
          Delete
        </button>
        <Link
          to={`/salarySlip/${_id}`}
          className="px-4 py-2 rounded-md bg-[#2196F3] text-white hover:bg-[#1565C0] transition"
        >
          View Slip
        </Link>
      </div>
    </div>
  );
}

export default Salary;
