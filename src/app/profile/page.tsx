"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { User as UserIcon, Phone, MapPin, Briefcase, DollarSign, Save, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    profilePictureUrl: "",
    jobTitle: "",
    department: "",
    baseSalary: 0,
  });

  const loadCurrentUser = () => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setSelectedUserId(data.user.id);
          populateForm(data.user);
          if (data.user.role === "ADMIN") {
            fetch("/api/users")
              .then((r) => r.json())
              .then((uData) => {
                if (uData.users) setAllUsers(uData.users);
              });
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const populateForm = (u: User) => {
    setFormData({
      phone: u.phone || "",
      address: u.address || "",
      profilePictureUrl: u.profilePictureUrl || "",
      jobTitle: u.jobTitle || "",
      department: u.department || "",
      baseSalary: u.baseSalary || 0,
    });
  };

  const handleSelectUser = (targetId: string) => {
    setSelectedUserId(targetId);
    const target = allUsers.find((u) => u.id === targetId);
    if (target) populateForm(target);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const isEditingSelf = selectedUserId === user?.id;
      const endpoint = isEditingSelf ? "/api/auth/me" : `/api/users/${selectedUserId}`;
      const method = isEditingSelf ? "PUT" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setMessage({ type: "success", text: "Profile details updated successfully!" });
      loadCurrentUser();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  if (!user) return null;

  const targetUser = allUsers.find((u) => u.id === selectedUserId) || user;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile Management</h1>
          <p className="text-sm text-gray-500">
            {isAdmin ? "Manage and edit details for any company employee." : "View personal profile and update your contact information."}
          </p>
        </div>

        {/* Switch Employee Dropdown for Admin */}
        {isAdmin && allUsers.length > 0 && (
          <div className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded-xl shadow-sm">
            <span className="text-xs font-semibold text-gray-600">Select Employee:</span>
            <select
              value={selectedUserId}
              onChange={(e) => handleSelectUser(e.target.value)}
              className="text-xs font-medium bg-gray-50 border border-gray-300 rounded-lg p-1.5 focus:outline-none"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.employeeId})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <ShieldAlert className="w-5 h-5 text-red-600" />}
          {message.text}
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#714B67] text-white flex items-center justify-center text-2xl font-black shadow-inner">
            {targetUser.firstName?.[0]}
            {targetUser.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {targetUser.firstName} {targetUser.lastName}
            </h2>
            <div className="text-xs text-gray-300 flex items-center gap-2 mt-0.5">
              <span>{targetUser.jobTitle || "Employee"}</span> • <span>{targetUser.department || "General"}</span> •{" "}
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold">{targetUser.role}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Read-Only Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-xs font-semibold text-gray-500 uppercase">Employee ID</div>
              <div className="text-sm font-bold text-gray-900 mt-1">{targetUser.employeeId}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-xs font-semibold text-gray-500 uppercase">Work Email</div>
              <div className="text-sm font-bold text-gray-900 mt-1">{targetUser.email}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-xs font-semibold text-gray-500 uppercase">Date of Joining</div>
              <div className="text-sm font-bold text-gray-900 mt-1">{targetUser.joiningDate || "N/A"}</div>
            </div>
          </div>

          {/* Editable Fields Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Editable Information</h3>

            {!isAdmin && (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                Notice: As an employee, you can edit your Phone, Address, and Avatar. Admin approval is required for job/salary changes.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#714B67] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Residential Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, City, Country"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#714B67] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Admin-Only Editable Fields */}
            {isAdmin && (
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-4 mt-4">
                <div className="text-xs font-bold text-[#714B67] uppercase tracking-wider">Admin Restricted Fields</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#714B67] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#714B67] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Base Annual Salary (₹)</label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#714B67] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#714B67] text-white rounded-lg text-sm font-bold hover:bg-[#5c3d54] transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
