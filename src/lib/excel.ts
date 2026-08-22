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
    const dirPath = path.join(process.cwd(), "emp_details");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, "employee_records.xlsx");
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
      workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0] || "Employees";
      const worksheet = workbook.Sheets[sheetName];
      existingData = XLSX.utils.sheet_to_json(worksheet);
      existingData.push(newRecord);
    } else {
      workbook = XLSX.utils.book_new();
      existingData = [newRecord];
    }

    const newWorksheet = XLSX.utils.json_to_sheet(existingData);

    // Set column widths
    newWorksheet["!cols"] = [
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 28 },
      { wch: 14 },
      { wch: 18 },
    ];

    if (workbook.SheetNames.length === 0) {
      XLSX.utils.book_append_sheet(workbook, newWorksheet, "Employees");
    } else {
      workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    }

    XLSX.writeFile(workbook, filePath);
    console.log(`✅ Excel updated: ${filePath}`);
  } catch (error: any) {
    console.error("Error writing employee to Excel:", error.message);
  }
}
