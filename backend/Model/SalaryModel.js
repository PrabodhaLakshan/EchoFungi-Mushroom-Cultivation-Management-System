const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Salary Schema
const salarySchema = new Schema({
  employee_id: { type: String, required: true },       // Employee ID
  name: { type: String, required: true },
  designation: { type: String, required: true },
  month: { type: String, required: true },   // Salary month (YYYY-MM)
  basicSalary: { type: Number, default: 0 },          // Basic salary
  overtime: {
    hours: { type: Number, default: 0 },             // OT hours
    days: { type: Number, default: 0 },              // OT days
    pay: { type: Number, default: 0 }                // Overtime pay
  },
  bonus: {
    rate: { type: Number, default: 0 },              // Bonus rate
    amount: { type: Number, default: 0 }             // Bonus amount
  },
  allowances: [
    {
      name: { type: String },       // Allowance name
      amount: { type: Number, default: 0 }          // Allowance amount
    }
  ],
  deductions: {
    noPay: { type: Number, default: 0 },             // No pay deduction
    epf: { type: Number, default: 0 },               // EPF deduction
    apit: { type: Number, default: 0 },              // APIT deduction
    other: { type: Number, default: 0 }              // Other deductions
  },
  totals: {
    totalAllowances: { type: Number, default: 0 },   // Computed total allowances
    totalDeductions: { type: Number, default: 0 },   // Computed total deductions
    netSalary: { type: Number, default: 0 }          // Computed net salary
  }
}, { timestamps: true });

// Auto-increment salary_id
salarySchema.plugin(AutoIncrement, { inc_field: "salary_id" });

module.exports = mongoose.model("SalaryModel", salarySchema);
