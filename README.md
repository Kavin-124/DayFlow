# DayFlow - Enterprise Human Resource Management System (HRMS)

> **Every workday, perfectly aligned.**

DayFlow is a modern, enterprise-grade Human Resource Management System (HRMS) designed to digitize and streamline workforce operations, attendance tracking, leave request approvals, profile administration, and payroll management with role-based access control (RBAC).

---

## 🌟 Key Modules & Features

### 🔐 1. Authentication & Role-Based Access Control (RBAC)
- Dual-role authentication model: **`ADMIN` (HR Officer)** vs **`EMPLOYEE`**.
- Secure JSON Web Token (JWT) stateless auth stored in HttpOnly cookies using `jose`.
- Password encryption using `bcryptjs`.
- Registration portal supporting Employee ID, work email, and role selection.

### 👤 2. Employee Profile Management
- Comprehensive profile views (job title, department, work email, joining date, salary structure).
- Granular edit authorization:
  - **Employees**: Can edit contact phone, residential address, and profile avatar.
  - **Admins**: Full editing privileges across job titles, departments, base pay, and employee roles.

### ⏰ 3. Attendance Tracking System
- Real-time Check-in and Check-out widget with automated working hours counter.
- Automated status classification: `PRESENT`, `HALF_DAY`, `ABSENT`, `LEAVE`.
- History log supporting daily & weekly attendance views.

### 📅 4. Leave & Time-Off Management
- Leave application workflow supporting `PAID`, `SICK`, and `UNPAID` leave types.
- Real-time status pipeline: `PENDING` $\rightarrow$ `APPROVED` / `REJECTED`.
- Admin review modal with feedback comments and immediate database reflection.
- Automatic synchronization: Approving a leave application auto-updates the employee's attendance status for those dates to `LEAVE`.

### 💰 5. Payroll Administration
- **Employee View**: Read-only breakdown of basic salary, allowances, deductions, and net pay in Indian Rupees (₹).
- **Admin View**: Interactive modal to adjust basic pay, monthly allowances, and tax deductions with automatic net salary recalculation.
- Metric indicators for total company monthly payroll expenditure.

### 📊 6. Executive Dashboard & Operations Overview
- Real-time metric cards for Admins: `Total Employees`, `Present Today`, `Pending Leaves`, `Monthly Payroll Cost`.
- Quick-access module navigation for employees.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 14 (App Router)](https://nextjs.org/) + React 18
- **Language**: TypeScript
- **Styling & UI**: Tailwind CSS + Lucide React Icons
- **Database & ORM**: SQLite + [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (`jose`) + `bcryptjs`

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` or `yarn`

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
npm run db:push
```

### 4. Seed Clean Initial Data (Optional)
```bash
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

---

## 🔑 Default Accounts

After running database initialization, use the following default credentials to log in:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin / HR Officer** | `admin@dayflow.com` | `admin123` | Full Administrative Privileges |

*Note: New employees can register directly via the `/register` portal.*

---

## 📁 Project Folder Structure

```
DayFlow/
├── prisma/
│   └── schema.prisma        # Database models (User, Attendance, LeaveRequest, Payroll)
├── src/
│   ├── app/                 # Next.js App Router (Pages & API routes)
│   │   ├── api/             # REST API endpoints (Auth, Attendance, Leaves, Payroll, Users)
│   │   ├── attendance/      # Attendance tracking view
│   │   ├── dashboard/       # HR Operations Dashboard
│   │   ├── leaves/          # Leave management portal
│   │   ├── payroll/         # Payroll administration
│   │   ├── profile/         # Profile management
│   │   └── layout.tsx       # Root app layout
│   ├── components/          # Reusable UI & Navigation components
│   │   ├── layout/          # Footer and Layout containers
│   │   └── ui/              # Design system primitives (Badge, Button)
│   ├── hooks/               # Custom React hooks (useAuth)
│   ├── lib/                 # Database client & JWT helper utilities
│   └── types/               # TypeScript interfaces
├── package.json
└── README.md
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
