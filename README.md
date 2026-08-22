# DayFlow - Enterprise Human Resource Management System (HRMS)

<div align="center">

![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)
![Vercel Deployed](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)

**Every workday, perfectly aligned.**

[Live Demo](https://dayflow.vercel.app) • [GitHub Repository](https://github.com/Kavin-124/DayFlow) • [Documentation](#-key-modules--features)

</div>

---

## 📖 Overview

**DayFlow** is a modern, enterprise-grade Human Resource Management System (HRMS) built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Prisma ORM. Designed for modern organizations, DayFlow digitizes workforce operations, real-time attendance tracking, leave request approval pipelines, profile administration, payroll calculation, and automated Excel/CSV data exports.

---

## 🌐 Live Application & Links

- 🚀 **Live Production App (Vercel)**: [https://dayflow.vercel.app](https://dayflow.vercel.app)
- 📦 **GitHub Repository**: [https://github.com/Kavin-124/DayFlow](https://github.com/Kavin-124/DayFlow)

---

## 🔑 Demo Account Credentials

Use the pre-configured administrator account below for 1-click testing:

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| 👑 **Admin / HR Officer** | `admin@dayflow.com` | `admin123` | Full Administrative Privileges & Payroll Access |
| 👤 **Employee** | *Register via `/register`* | *Custom* | Self-service Attendance, Leaves, Profile & Payslips |

*(Click the **Demo Admin** banner on the Login page for instant 1-click auto-fill!)*

---

## 🌟 Key Modules & Features

### 🔐 1. Authentication & Role-Based Access Control (RBAC)
- Dual-role security model: **`ADMIN` (HR Officer)** vs **`EMPLOYEE`**.
- Secure JSON Web Token (JWT) stateless auth stored in HttpOnly cookies using `jose`.
- Password encryption using `bcryptjs`.
- Automatic email normalization (`.trim().toLowerCase()`) ensuring seamless re-authentication.

### 👤 2. Employee Profile Management
- Comprehensive profile views (Job Title, Department, Work Email, Joining Date, Base Salary).
- Role-scoped edit permissions:
  - **Employees**: Update phone number, address, and profile avatar.
  - **Admins**: Full management of employee titles, departments, base pay, and account roles.

### ⏰ 3. Attendance Tracking System
- Real-time Check-In and Check-Out widget with live working hours calculation.
- Automated status classification: `PRESENT`, `HALF_DAY`, `ABSENT`, `LEAVE`.
- History log supporting daily & weekly attendance audit views.

### 📅 4. Leave & Time-Off Management Workflow
- Multi-type leave request portal (`PAID`, `SICK`, `UNPAID`).
- Real-time status pipeline: `PENDING` $\rightarrow$ `APPROVED` / `REJECTED`.
- Admin review modal with custom feedback comments.
- **Auto-Sync**: Approving a leave application automatically updates the employee's attendance log for those dates to `LEAVE`.

### 💰 5. Payroll Administration
- **Employee View**: Read-only breakdown of basic salary, allowances, deductions, and net pay in Indian Rupees (₹).
- **Admin View**: Interactive edit modal for basic pay, monthly allowances, and tax deductions with instant net salary recalculation.
- Total organization monthly payroll cost metrics.

### 📊 6. Executive Dashboard & KPI Metrics
- Real-time KPI cards for HR Officers: `Total Employees`, `Present Today`, `Pending Leaves`, `Monthly Payroll Cost`.
- Employee self-service quick actions.

### 📊 7. Real-Time Excel & CSV Export
- Automatic dual-format export to `D:\Antigravity\ODOO 2k26\emp_details\`:
  - 📄 **`employee_records.csv`**: Lock-free CSV export that updates in real-time even when Microsoft Excel is open.
  - 📊 **`employee_records.xlsx`**: Excel workbook sheet format.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 14 (App Router)](https://nextjs.org/) + React 18 |
| **Language** | TypeScript |
| **Styling & Icons** | Tailwind CSS + Lucide React Icons |
| **Database & ORM** | SQLite + [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | JWT (`jose`) + `bcryptjs` |
| **Data Export** | SheetJS (`xlsx`) + Native CSV Stream |
| **Hosting & Deployment** | Vercel Serverless Platform |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18.0.0 or higher
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Kavin-124/DayFlow.git
cd DayFlow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Database Schema
```bash
npx prisma db push
```

### 4. Seed Default Admin Account
```bash
npm run db:seed
```

### 5. Run Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Directory Architecture

```
DayFlow/
├── emp_details/             # Real-time CSV & XLSX employee export directory
│   ├── employee_records.csv
│   └── employee_records.xlsx
├── prisma/
│   ├── schema.prisma        # Database models (User, Attendance, LeaveRequest, Payroll)
│   └── dev.db               # SQLite database
├── src/
│   ├── app/                 # Next.js App Router (Pages & REST API Endpoints)
│   │   ├── api/             # API routes (Auth, Attendance, Leaves, Payroll, Users)
│   │   ├── attendance/      # Attendance tracking view
│   │   ├── dashboard/       # Operations dashboard
│   │   ├── leaves/          # Leave management portal
│   │   ├── payroll/         # Payroll administration
│   │   ├── profile/         # Employee profile management
│   │   ├── login/           # Sign-in portal
│   │   └── register/        # Account creation portal
│   ├── components/          # Design system UI & navigation components
│   ├── hooks/               # Custom React hooks (useAuth)
│   └── lib/                 # Database client, JWT helpers, and Excel exporter
├── next.config.js           # Serverless file tracing & Next.js config
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
