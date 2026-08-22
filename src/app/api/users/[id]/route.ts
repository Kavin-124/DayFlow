import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
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

    const { id } = params;
    const body = await request.json();
    const { firstName, lastName, email, role, jobTitle, department, joiningDate, baseSalary, phone, address } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(role && { role }),
        ...(jobTitle && { jobTitle }),
        ...(department && { department }),
        ...(joiningDate && { joiningDate }),
        ...(baseSalary !== undefined && { baseSalary: parseFloat(baseSalary) }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
      },
    });

    return NextResponse.json({ message: "Employee updated successfully", user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update employee" }, { status: 500 });
  }
}
