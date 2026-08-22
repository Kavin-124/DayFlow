"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, DashboardStats } from "@/types";
import { User as UserIcon, Users, Clock, CalendarCheck, DollarSign, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          if (data.user.role === "ADMIN") {
            fetch("/api/dashboard/stats")
              .then((res) => res.json())
              .then((sData) => {
                if (sData.stats) setStats(sData.stats);
              });
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header Welcome Card */}
      <div className="bg-gradient-to-r from-[#714B67] to-[#00A09D] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            {user.role === "ADMIN" ? "Admin / HR Officer Portal" : "Employee Portal"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Welcome back, {user.firstName}!
          </h1>
          <p className="mt-1 text-sm text-white/80 max-w-xl">
            {user.role === "ADMIN"
              ? "Manage company employees, approve leave applications, monitor attendance, and review monthly payrolls."
              : "Track your daily work hours, apply for leaves, check salary details, and keep your profile updated."}
          </p>
        </div>
      </div>

      {/* ADMIN DASHBOARD OVERVIEW */}
      {user.role === "ADMIN" && stats && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Organization Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Total Employees</div>
                <div className="text-3xl font-black text-gray-900 mt-1">{stats.totalEmployees}</div>
              </div>
              <div className="p-3 bg-purple-50 text-[#714B67] rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Present Today</div>
                <div className="text-3xl font-black text-gray-900 mt-1">{stats.presentToday}</div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Pending Leaves</div>
                <div className="text-3xl font-black text-gray-900 mt-1">{stats.pendingLeaves}</div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase">Monthly Payroll Cost</div>
                <div className="text-2xl font-black text-gray-900 mt-1">
                  ₹{stats.monthlyPayrollCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="p-3 bg-teal-50 text-[#00A09D] rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACCESS MODULE CARDS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Quick Access Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Link
            href="/profile"
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-50 text-[#714B67] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">My Profile</h3>
              <p className="text-xs text-gray-500">
                View personal info, job title, department & update contact details.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#714B67] group-hover:translate-x-1 transition-transform">
              Open Profile <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Attendance Card */}
          <Link
            href="/attendance"
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Attendance</h3>
              <p className="text-xs text-gray-500">
                Check in/out daily, track working hours, and review attendance logs.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              Track Hours <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Leave Card */}
          <Link
            href="/leaves"
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Leave & Time-Off</h3>
              <p className="text-xs text-gray-500">
                Apply for paid/sick leave and view approval status & remarks.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
              Apply Leave <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Payroll Card */}
          <Link
            href="/payroll"
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Payroll</h3>
              <p className="text-xs text-gray-500">
                View monthly salary breakdown, allowances, and deduction details.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              View Payroll <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
