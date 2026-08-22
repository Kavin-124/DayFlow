"use client";

import { useEffect, useState } from "react";
import { LeaveRequest, User } from "@/types";
import { Calendar, Plus, CheckCircle2, XCircle, Clock, MessageSquare, Shield } from "lucide-react";

export default function LeavesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [reviewingLeave, setReviewingLeave] = useState<LeaveRequest | null>(null);

  // Apply Form
  const [leaveType, setLeaveType] = useState<"PAID" | "SICK" | "UNPAID">("PAID");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [adminComments, setAdminComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLeaves = () => {
    fetch("/api/leaves")
      .then((res) => res.json())
      .then((data) => {
        if (data.leaves) setLeaves(data.leaves);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveType, startDate, endDate, remarks }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Application failed");

      setMessage("Leave application submitted successfully!");
      setShowApplyModal(false);
      fetchLeaves();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status: "APPROVED" | "REJECTED") => {
    if (!reviewingLeave) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/leaves/${reviewingLeave.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminComments }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setReviewingLeave(null);
      setAdminComments("");
      fetchLeaves();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave & Time-Off Management</h1>
          <p className="text-sm text-gray-500">Apply for time-off, track leave balances, and approve employee requests.</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#714B67] hover:bg-[#5c3d54] text-white rounded-xl font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-sm border border-emerald-200">
          {message}
        </div>
      )}

      {/* Leaves List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00A09D]" />
            {user?.role === "ADMIN" ? "All Leave Requests" : "My Leave Applications"}
          </h2>
          <span className="text-xs text-gray-500 font-semibold">{leaves.length} Requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                {user?.role === "ADMIN" && <th className="py-3 px-4">Employee</th>}
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Total Days</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4">Status</th>
                {user?.role === "ADMIN" && <th className="py-3 px-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    No leave requests found. Click &quot;Apply for Leave&quot; to submit a new request.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50/50 transition">
                    {user?.role === "ADMIN" && (
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {leave.user ? `${leave.user.firstName} ${leave.user.lastName}` : "N/A"}
                        <div className="text-[11px] text-gray-400">{leave.user?.employeeId}</div>
                      </td>
                    )}
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{leave.leaveType}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {leave.startDate} to {leave.endDate}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">{leave.totalDays} days</td>
                    <td className="py-3 px-4 text-xs text-gray-600 max-w-xs truncate">
                      {leave.remarks || "No remarks"}
                      {leave.adminComments && (
                        <div className="text-[11px] text-purple-700 mt-0.5 italic">Admin: {leave.adminComments}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(leave.status)}</td>
                    {user?.role === "ADMIN" && (
                      <td className="py-3 px-4 text-right">
                        {leave.status === "PENDING" ? (
                          <button
                            onClick={() => {
                              setReviewingLeave(leave);
                              setAdminComments("");
                            }}
                            className="px-3 py-1 bg-[#00A09D] hover:bg-[#008784] text-white text-xs font-bold rounded-lg transition inline-flex items-center gap-1"
                          >
                            <Shield className="w-3 h-3" /> Review
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLY LEAVE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Apply for Time-Off</h3>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e: any) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                >
                  <option value="PAID">Paid Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Remarks / Reason</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Reason for leave application..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5c3d54] rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN REVIEW MODAL */}
      {reviewingLeave && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Review Leave Request</h3>

            <div className="p-3 bg-purple-50 rounded-xl space-y-1 text-xs">
              <div><strong className="text-gray-700">Applicant:</strong> {reviewingLeave.user?.firstName} {reviewingLeave.user?.lastName}</div>
              <div><strong className="text-gray-700">Type & Dates:</strong> {reviewingLeave.leaveType} ({reviewingLeave.startDate} to {reviewingLeave.endDate})</div>
              <div><strong className="text-gray-700">Total Duration:</strong> {reviewingLeave.totalDays} Days</div>
              <div><strong className="text-gray-700">Remarks:</strong> {reviewingLeave.remarks || "None"}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Comments / Note</label>
              <textarea
                rows={2}
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                placeholder="Optional feedback or approval notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewingLeave(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus("REJECTED")}
                disabled={submitting}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Reject Request
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus("APPROVED")}
                disabled={submitting}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
