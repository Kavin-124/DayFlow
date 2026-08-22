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

    // Check if already checked in today
    const existing = await prisma.attendance.findFirst({
      where: {
        userId: payload.userId,
        date: today,
      },
    });

    if (existing && existing.checkIn) {
      return NextResponse.json({ error: "Already checked in today", attendance: existing }, { status: 400 });
    }

    const attendance = existing
      ? await prisma.attendance.update({
          where: { id: existing.id },
          data: {
            checkIn: new Date(),
            status: "PRESENT",
          },
        })
      : await prisma.attendance.create({
          data: {
            userId: payload.userId,
            date: today,
            checkIn: new Date(),
            status: "PRESENT",
          },
        });

    return NextResponse.json({ message: "Check-in successful", attendance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Check-in failed" }, { status: 500 });
  }
}
