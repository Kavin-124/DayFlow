"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User as UserIcon, Calendar, Clock, DollarSign, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-[#714B67]">
                Day<span className="text-[#00A09D]">Flow</span>
              </span>
            </Link>
          </div>

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard" ? "text-[#714B67] font-semibold border-b-2 border-[#714B67] pb-1" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === "/profile" ? "text-[#714B67] font-semibold border-b-2 border-[#714B67] pb-1" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <UserIcon className="w-4 h-4" /> Profile
              </Link>
              <Link
                href="/attendance"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === "/attendance" ? "text-[#714B67] font-semibold border-b-2 border-[#714B67] pb-1" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Clock className="w-4 h-4" /> Attendance
              </Link>
              <Link
                href="/leaves"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === "/leaves" ? "text-[#714B67] font-semibold border-b-2 border-[#714B67] pb-1" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="w-4 h-4" /> Leaves
              </Link>
              <Link
                href="/payroll"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === "/payroll" ? "text-[#714B67] font-semibold border-b-2 border-[#714B67] pb-1" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <DollarSign className="w-4 h-4" /> Payroll
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    {user.role === "ADMIN" && <Shield className="w-3 h-3 text-[#00A09D]" />}
                    {user.role} • {user.employeeId}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#714B67] rounded-lg hover:bg-[#5c3d54] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
