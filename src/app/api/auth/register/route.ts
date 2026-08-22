import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { appendEmployeeToExcel } from "@/lib/excel";

export async function POST(request: Request) {
  try {
    const { employeeId, email, password, role, firstName, lastName } = await request.json();

    if (!employeeId || !email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { employeeId }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Employee ID or Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        employeeId,
        email,
        passwordHash: hashedPassword,
        role: role || "EMPLOYEE",
        firstName,
        lastName,
      },
    });

    // Auto append new employee details to Excel spreadsheet in D:\Antigravity\ODOO 2k26\emp_details
    appendEmployeeToExcel({
      employeeId: user.employeeId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });

    const token = await signToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json({
      message: "Registration successful",
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
