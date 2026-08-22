import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
    const { status, adminComments } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        adminComments: adminComments || "",
        reviewedBy: payload.userId,
      },
    });

    // If approved, sync attendance status for those leave dates to LEAVE!
    if (status === "APPROVED") {
      const start = new Date(updatedLeave.startDate);
      const end = new Date(updatedLeave.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        await prisma.attendance.upsert({
          where: {
            id: `leave-att-${updatedLeave.userId}-${dateStr}`,
          },
          create: {
            id: `leave-att-${updatedLeave.userId}-${dateStr}`,
            userId: updatedLeave.userId,
            date: dateStr,
            status: "LEAVE",
          },
          update: {
            status: "LEAVE",
          },
        });
      }
    }

    return NextResponse.json({ message: `Leave ${status.toLowerCase()} successfully`, leave: updatedLeave });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update leave status" }, { status: 500 });
  }
}
