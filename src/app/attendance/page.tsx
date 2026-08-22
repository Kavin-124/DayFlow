"use client";

import { useEffect, useState } from "react";
import { Attendance, User } from "@/types";
import { Clock, Play, Square, Calendar, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

export default function AttendancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const todayStr = new Date().toISOString().split("T")[0];
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);

  const fetchAttendance = () => {
    fetch("/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        if (data.attendances) {
          setAttendances(data.attendances);
          const currentToday = data.attendances.find((a: Attendance) => a.date === todayStr);
          if (currentToday) setTodayAttendance(currentToday);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/attendance/check-in", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check-in failed");
      setMessage("Checked in successfully!");
      fetchAttendance();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/attendance/check-out", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check-out failed");
      setMessage("Checked out successfully!");
      fetchAttendance();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Present</span>;
      case "HALF_DAY":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Half Day</span>;
      case "LEAVE":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">On Leave</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Absent</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  const isCheckedIn = !!todayAttendance?.checkIn;
  const isCheckedOut = !!todayAttendance?.checkOut;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-sm text-gray-500">Record daily check-in / check-out times and view attendance logs.</p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600">
          Today: {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
        </div>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-200">
          {message}
        </div>
      )}

      {/* Check-In / Check-Out Widget */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-[#714B67] rounded-2xl">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-gray-400">Daily Status</div>
            <div className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              {isCheckedOut ? "Work Completed" : isCheckedIn ? "Currently Working" : "Not Checked In Yet"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {todayAttendance?.checkIn && `Check In: ${new Date(todayAttendance.checkIn).toLocaleTimeString()}`}
              {todayAttendance?.checkOut && ` • Check Out: ${new Date(todayAttendance.checkOut).toLocaleTimeString()}`}
              {todayAttendance?.totalHours ? ` • Total: ${todayAttendance.totalHours} hrs` : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isCheckedIn && (
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="flex items-center gap-2 px-6 py-3 bg-[#00A09D] hover:bg-[#008784] text-white rounded-xl font-bold shadow-md transition disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" /> Check In Now
            </button>
          )}

          {isCheckedIn && !isCheckedOut && (
            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md transition disabled:opacity-50"
            >
              <Square className="w-5 h-5 fill-current" /> Check Out Now
            </button>
          )}

          {isCheckedOut && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-200">
              <CheckCircle className="w-5 h-5 text-emerald-600" /> Done for Today
            </div>
          )}
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#714B67]" />
            {user?.role === "ADMIN" ? "Company Attendance Overview" : "My Attendance History"}
          </h2>
          <span className="text-xs text-gray-500 font-semibold">{attendances.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold uppercase text-gray-500 border-b border-gray-100">
                {user?.role === "ADMIN" && <th className="py-3 px-4">Employee</th>}
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    No attendance records found. Click Check In to start tracking!
                  </td>
                </tr>
              ) : (
                attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50/50 transition">
                    {user?.role === "ADMIN" && (
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {att.user ? `${att.user.firstName} ${att.user.lastName}` : "N/A"}
                        <div className="text-[11px] text-gray-400">{att.user?.employeeId}</div>
                      </td>
                    )}
                    <td className="py-3 px-4 font-medium text-gray-900">{att.date}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {att.totalHours ? `${att.totalHours} hrs` : "0 hrs"}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(att.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
