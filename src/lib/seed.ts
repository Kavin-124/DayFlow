import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@dayflow.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.length < 12) {
    throw new Error("Set SEED_ADMIN_PASSWORD to a unique password of at least 12 characters before running the seed script.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Upsert only the administrator account. Existing employee, attendance,
  // leave, and payroll records are preserved.
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      employeeId: "EMP-001",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "Officer",
      jobTitle: "HR Administrator",
      department: "Human Resources",
      joiningDate: "2026-01-01",
      baseSalary: 100000,
    },
  });

  console.log(`Administrator account configured for ${adminEmail}.`);
  console.log("The password is read from SEED_ADMIN_PASSWORD and is not printed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
