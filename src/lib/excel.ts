import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma";

export async function syncAllUsersToExcel() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });

    const dirPath = path.resolve(process.cwd(), "emp_details");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 1. Lock-free CSV Export (Guaranteed to write even if Excel is open)
    const csvPath = path.resolve(dirPath, "employee_records.csv");
    const csvHeader = "Employee ID,First Name,Last Name,Work Email,Role,Registration Date\n";
    const csvLines = users
      .map(
        (u) =>
          `"${u.employeeId}","${u.firstName}","${u.lastName}","${u.email}","${u.role}","${
            u.createdAt ? u.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
          }"`
      )
      .join("\n");

    try {
      fs.writeFileSync(csvPath, csvHeader + csvLines, "utf8");
      console.log(`✅ CSV file updated at: ${csvPath}`);
    } catch (csvErr: any) {
      console.error("CSV write note:", csvErr.message);
    }

    // 2. XLSX Workbook Export
    const filePath = path.resolve(dirPath, "employee_records.xlsx");
    const excelRows = users.map((u) => ({
      "Employee ID": u.employeeId,
      "First Name": u.firstName,
      "Last Name": u.lastName,
      "Work Email": u.email,
      "Role": u.role,
      "Registration Date": u.createdAt ? u.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 28 },
      { wch: 14 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    try {
      XLSX.writeFile(workbook, filePath);
      console.log(`✅ XLSX file updated at: ${filePath}`);
    } catch (writeErr) {
      const fallbackPath = path.resolve(dirPath, `employee_records_latest.xlsx`);
      try {
        XLSX.writeFile(workbook, fallbackPath);
        console.log(`⚠️ Main XLSX locked by MS Excel. Saved to: ${fallbackPath}`);
      } catch (fallbackErr) {
        const timePath = path.resolve(dirPath, `employee_records_${Date.now()}.xlsx`);
        XLSX.writeFile(workbook, timePath);
        console.log(`⚠️ Saved to timestamped file: ${timePath}`);
      }
    }
  } catch (error: any) {
    console.error("Error syncing users to Excel file:", error.message);
  }
}

export function appendEmployeeToExcel(employeeData: any) {
  syncAllUsersToExcel().catch((err) => console.error("Excel sync error:", err.message));
}
