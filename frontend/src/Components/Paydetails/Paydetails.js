//import React from 'react'
import axios from "axios";
import React, { useState, useEffect } from 'react';
import PayNav from "../PayNav/PayNav";
import Salary from "../Salary/Salary";

const URL = "http://localhost:5000/salaries";

const fetchHandler = async () =>{
  return await axios.get(URL).then((res) => res.data);
}

function Paydetails() {
  const [salaries, setSalary] = useState();

  useEffect(() => {
    fetchHandler().then((data) => setSalary(data.salaries))
  }, [])

  return (
    <div className="flex">
      {/* Sidebar */}
      <PayNav/>

      {/* Content Area */}
      <div className="flex-1 bg-[#F9FAF9] p-6 min-h-screen ml-52">
        <h1 className="text-center text-2xl font-bold text-[#4CAF50] mb-6">
          Salary Details
        </h1>

        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full border border-[#A5D6A7] rounded-lg">
            <thead className="bg-[#1B5E20] text-white">
              <tr>
                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Designation</th>
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Basic Salary</th>
                <th className="px-4 py-2">Overtime</th>
                <th className="px-4 py-2">Bonus</th>
                <th className="px-4 py-2">Allowance</th>
                <th className="px-4 py-2">Deductions</th>
                <th className="px-4 py-2">Totals</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F9FAF9]">
              {salaries && salaries.map((sal, i) => (
                <Salary key={i} sal={sal} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Paydetails;
