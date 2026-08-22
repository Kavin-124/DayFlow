import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export function appendEmployeeToExcel(employeeData: {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  registrationDate?: string;
}) {
  try {
    const dirPath = path.resolve(process.cwd(), "emp_details");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.resolve(dirPath, "employee_records.xlsx");
    let workbook: XLSX.WorkBook;
    let existingData: any[] = [];

    const newRecord = {
      "Employee ID": employeeData.employeeId,
      "First Name": employeeData.firstName,
      "Last Name": employeeData.lastName,
      "Work Email": employeeData.email,
      "Role": employeeData.role,
      "Registration Date": employeeData.registrationDate || new Date().toISOString().split("T")[0],
    };

    if (fs.existsSync(filePath)) {
      try {
        workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0] || "Employees";
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet) {
          existingData = XLSX.utils.sheet_to_json(worksheet);
        }
      } catch (e) {
        existingData = [];
      }
    }

    const isDuplicate = existingData.some(
      (row) => row["Employee ID"] === employeeData.employeeId || row["Work Email"] === employeeData.email
    );

    if (!isDuplicate) {
      existingData.push(newRecord);
    }

    workbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(existingData);

    newWorksheet["!cols"] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 28 },
      { wch: 14 },
      { wch: 18 },
    ];

    XLSX.utils.book_append_sheet(workbook, newWorksheet, "Employees");

    try {
      XLSX.writeFile(workbook, filePath);
      console.log(`✅ Real-time Excel record updated at: ${filePath}`);
    } catch (writeErr) {
      // Fallback if main file is open/locked in MS Excel
      const fallbackPath = path.resolve(dirPath, `employee_records_latest.xlsx`);
      XLSX.writeFile(workbook, fallbackPath);
      console.log(`⚠️ Main file locked by Excel. Saved update to: ${fallbackPath}`);
    }
  } catch (error: any) {
    console.error("Error updating employee Excel file:", error.message);
  }
}
