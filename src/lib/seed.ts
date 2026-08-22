import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Dayflow HRMS database...");

  // Clear existing data
  await prisma.payroll.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash("admin123", 10);

  // Admin User
  await prisma.user.create({
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

  console.log("Database reset complete! Only 1 default Admin account exists:");
  console.log("  Admin: admin@dayflow.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
