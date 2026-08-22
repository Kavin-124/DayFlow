import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    let token = cookieStore.get("token")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    }
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const today = new Date().toISOString().split("T")[0];

    const totalEmployees = await prisma.user.count({
      where: { role: "EMPLOYEE" },
    });

    const presentToday = await prisma.attendance.count({
      where: {
        date: today,
        status: { in: ["PRESENT", "HALF_DAY"] },
      },
    });

    const pendingLeaves = await prisma.leaveRequest.count({
      where: { status: "PENDING" },
    });

    const payrolls = await prisma.payroll.findMany();
    const monthlyPayrollCost = payrolls.reduce((acc, curr) => acc + curr.netSalary, 0);

    return NextResponse.json({
      stats: {
        totalEmployees,
        presentToday,
        pendingLeaves,
        monthlyPayrollCost,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
