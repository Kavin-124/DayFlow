import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { employee_id: string } }
) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get("token")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    }
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { employee_id } = params;
    const { basicSalary, allowances, deductions, monthYear } = await request.json();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: employee_id }, { employeeId: employee_id }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const basic = parseFloat(basicSalary) || user.baseSalary / 12;
    const allow = parseFloat(allowances) || 0;
    const ded = parseFloat(deductions) || 0;
    const net = basic + allow - ded;
    const targetMonth = monthYear || "2026-08";

    // Upsert payroll for employee for target month
    const existingPayroll = await prisma.payroll.findFirst({
      where: { userId: user.id, monthYear: targetMonth },
    });

    const payroll = existingPayroll
      ? await prisma.payroll.update({
          where: { id: existingPayroll.id },
          data: {
            basicSalary: basic,
            allowances: allow,
            deductions: ded,
            netSalary: net,
          },
        })
      : await prisma.payroll.create({
          data: {
            userId: user.id,
            monthYear: targetMonth,
            basicSalary: basic,
            allowances: allow,
            deductions: ded,
            netSalary: net,
            paymentStatus: "PAID",
          },
        });

    return NextResponse.json({ message: "Payroll updated successfully", payroll });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update payroll" }, { status: 500 });
  }
}
