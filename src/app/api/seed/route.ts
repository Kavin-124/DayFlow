import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Clear all existing records
    await prisma.payroll.deleteMany();
    await prisma.leaveRequest.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.user.deleteMany();

    const hashedAdminPassword = await bcrypt.hash("admin123", 10);

    // Create 1 clean Admin account
    const admin = await prisma.user.create({
      data: {
        employeeId: "EMP-001",
        email: "admin@dayflow.com",
        passwordHash: hashedAdminPassword,
        role: "ADMIN",
        firstName: "Admin",
        lastName: "Officer",
        jobTitle: "HR Administrator",
        department: "Human Resources",
        joiningDate: "2026-01-01",
        baseSalary: 100000,
      },
    });

    return NextResponse.json({
      message: "Database cleaned & reset successfully! No dummy employees or logs exist.",
      adminAccount: "admin@dayflow.com / admin123",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Reset failed" }, { status: 500 });
  }
}
