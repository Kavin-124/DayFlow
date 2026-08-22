"use client";

import { useEffect, useState } from "react";
import { Payroll, User } from "@/types";
import { DollarSign, FileText, Edit, CheckCircle, Shield } from "lucide-react";

export default function PayrollPage() {
  const [user, setUser] = useState<User | null>(null);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);

  // Edit form
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchPayrolls = () => {
    fetch("/api/payroll")
      .then((res) => res.json())
      .then((data) => {
        if (data.payrolls) setPayrolls(data.payrolls);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
    fetchPayrolls();
  }, []);

  const handleUpdatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayroll) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/payroll/${editingPayroll.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basicSalary,
          allowances,
          deductions,
          monthYear: editingPayroll.monthYear,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setEditingPayroll(null);
      fetchPayrolls();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll & Salary Management</h1>
          <p className="text-sm text-gray-500">
            {isAdmin ? "Manage employee salary structures, allowances, and monthly payrolls." : "View your monthly salary slips and payment history."}
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs border border-blue-200">
          Notice: Payroll details are read-only for employees. Contact HR/Admin for salary adjustments.
        </div>
      )}

      {/* Payroll Records Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#00A09D]" />
            {isAdmin ? "Company Payroll Directory" : "My Salary History"}
          </h2>
          <span className="text-xs text-gray-500 font-semibold">{payrolls.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                {isAdmin && <th className="py-3 px-4">Employee</th>}
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Basic Pay</th>
                <th className="py-3 px-4">Allowances</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                {isAdmin && <th className="py-3 px-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {payrolls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                    No payroll records generated yet.
                  </td>
                </tr>
              ) : (
                payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition">
                    {isAdmin && (
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {p.user ? `${p.user.firstName} ${p.user.lastName}` : "N/A"}
                        <div className="text-[11px] text-gray-400">{p.user?.jobTitle}</div>
                      </td>
                    )}
                    <td className="py-3 px-4 font-bold text-gray-800">{p.monthYear}</td>
                    <td className="py-3 px-4 text-gray-700">₹{p.basicSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">+₹{p.allowances.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-red-600 font-medium">-₹{p.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 font-black text-gray-900 text-base">
                      ₹{p.netSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                        <CheckCircle className="w-3.5 h-3.5" /> {p.paymentStatus}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingPayroll(p);
                            setBasicSalary(p.basicSalary);
                            setAllowances(p.allowances);
                            setDeductions(p.deductions);
                          }}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3 text-[#714B67]" /> Edit Structure
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT SALARY MODAL FOR ADMIN */}
      {editingPayroll && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#714B67]" /> Edit Salary Structure
            </h3>

            <div className="p-3 bg-purple-50 rounded-xl text-xs space-y-0.5">
              <div><strong>Employee:</strong> {editingPayroll.user?.firstName} {editingPayroll.user?.lastName}</div>
              <div><strong>Month:</strong> {editingPayroll.monthYear}</div>
            </div>

            <form onSubmit={handleUpdatePayroll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Basic Monthly Pay (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Allowances (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={allowances}
                  onChange={(e) => setAllowances(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deductions (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={deductions}
                  onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Calculated Net Pay:</span>
                <span>₹{(basicSalary + allowances - deductions).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPayroll(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5c3d54] rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Update Salary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
