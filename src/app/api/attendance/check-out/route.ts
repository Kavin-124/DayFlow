import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

    const existing = await prisma.attendance.findFirst({
      where: {
        userId: payload.userId,
        date: today,
      },
    });

    if (!existing || !existing.checkIn) {
      return NextResponse.json({ error: "You must check in first before checking out" }, { status: 400 });
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(existing.checkIn);
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

    let finalStatus = "PRESENT";
    if (totalHours < 4) {
      finalStatus = "HALF_DAY";
    }

    const updated = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: checkOutTime,
        totalHours,
        status: finalStatus,
      },
    });

    return NextResponse.json({ message: "Check-out successful", attendance: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Check-out failed" }, { status: 500 });
  }
}
