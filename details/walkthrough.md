# 🏆 40 Hourly Commits Guide — Odoo NMIT Hackathon 2026

Every team member (`NAGARAJ V`, `MOULITHARAN IR`, `KAVIN R`, `MOHITH L`) has **10 distinct, ready-to-run commit commands** below. Each member can execute **1 commit per hour** over the next 10 hours!

---

## 🎨 MEMBER 1: NAGARAJ V (UI / UX Lead — 10 Commits)

Run these 10 commands (one every 1 hour):

### ⏰ Commit 1 (Hour 1)
```bash
git add tailwind.config.js index.html
git commit -m "style(ui): configure dark mode class and hackathon branding meta tags"
```

### ⏰ Commit 2 (Hour 2)
```bash
git add src/components/ThemeToggle.tsx
git commit -m "feat(ui): create ThemeToggle component with localStorage persistence"
```

### ⏰ Commit 3 (Hour 3)
```bash
git add src/components/MobileNav.tsx
git commit -m "feat(ui): add responsive MobileNav bottom navigation bar for mobile devices"
```

### ⏰ Commit 4 (Hour 4)
```bash
git add src/components/EmptyState.tsx
git commit -m "feat(ui): add EmptyState graphic component for empty dataset tables"
```

### ⏰ Commit 5 (Hour 5)
```bash
git add src/components/SkeletonLoader.tsx
git commit -m "feat(ui): create Card and Table shimmer SkeletonLoader components"
```

### ⏰ Commit 6 (Hour 6)
```bash
git add src/components/Badge.tsx
git commit -m "feat(ui): add dark-mode compatible status Badge component"
```

### ⏰ Commit 7 (Hour 7)
```bash
git add src/components/CalendarView.tsx
git commit -m "feat(ui): create interactive monthly grid CalendarView for attendance and leaves"
```

### ⏰ Commit 8 (Hour 8)
```bash
git add src/components/AvatarUpload.tsx
git commit -m "feat(ui): add AvatarUpload component for profile picture selection"
```

### ⏰ Commit 9 (Hour 9)
```bash
git add src/components/AppLayout.tsx
git commit -m "refactor(ui): integrate ThemeToggle and MobileNav into main AppLayout shell"
```

### ⏰ Commit 10 (Hour 10)
```bash
git add src/pages/EmployeeAttendance.tsx
git commit -m "style(ui): integrate CalendarView component into employee attendance view"
```

---

## 🗄️ MEMBER 2: MOULITHARAN IR (Database Lead — 10 Commits)

Run these 10 commands (one every 1 hour):

### ⏰ Commit 1 (Hour 1)
```bash
git add supabase/migrations/20260822050000_10_audit_logs_table.sql
git commit -m "feat(db): add 10_audit_logs_table migration with RLS policies"
```

### ⏰ Commit 2 (Hour 2)
```bash
git add supabase/migrations/20260822060000_11_announcements_table.sql
git commit -m "feat(db): add 11_announcements_table migration for company broadcasts"
```

### ⏰ Commit 3 (Hour 3)
```bash
git add supabase/migrations/20260822070000_12_leave_balances_table.sql
git commit -m "feat(db): add 12_leave_balances_table migration for annual leave quotas"
```

### ⏰ Commit 4 (Hour 4)
```bash
git add supabase/migrations/20260822080000_13_holidays_calendar_table.sql
git commit -m "feat(db): add 13_holidays_calendar_table migration for public holidays"
```

### ⏰ Commit 5 (Hour 5)
```bash
git add supabase/migrations/20260822090000_14_stored_procedures.sql
git commit -m "feat(db): add 14_stored_procedures migration for analytical RPC functions"
```

### ⏰ Commit 6 (Hour 6)
```bash
git add supabase/migrations/20260822100000_15_deduct_leave_trigger.sql
git commit -m "feat(db): add 15_deduct_leave_trigger migration for auto-deducting leave balances"
```

### ⏰ Commit 7 (Hour 7)
```bash
git add supabase/migrations/20260822110000_16_performance_indexes.sql
git commit -m "perf(db): add 16_performance_indexes migration for fast date and query lookup"
```

### ⏰ Commit 8 (Hour 8)
```bash
git add supabase/migrations/20260822120000_17_realtime_publication.sql
git commit -m "feat(db): add 17_realtime_publication migration for websocket channel publishing"
```

### ⏰ Commit 9 (Hour 9)
```bash
git add supabase/seed.sql
git commit -m "seed(db): add seed.sql dataset with initial holidays and announcements"
```

### ⏰ Commit 10 (Hour 10)
```bash
git add supabase/README_DB.md
git commit -m "docs(db): add README_DB documentation for migration sequence and schema design"
```

---

## ⚙️ MEMBER 3: KAVIN R (Backend & Business Logic Lead — 10 Commits)

Run these 10 commands (one every 1 hour):

### ⏰ Commit 1 (Hour 1)
```bash
git add src/lib/types.ts
git commit -m "feat(backend): extend types.ts with AuditLog, Announcement, and LeaveBalance interfaces"
```

### ⏰ Commit 2 (Hour 2)
```bash
git add src/lib/utils/attendance.ts
git commit -m "feat(backend): add attendance.ts utility for calculating work hours, overtime, and late checkins"
```

### ⏰ Commit 3 (Hour 3)
```bash
git add src/lib/utils/leaveValidation.ts
git commit -m "feat(backend): add leaveValidation.ts utility for verifying leave quota balances"
```

### ⏰ Commit 4 (Hour 4)
```bash
git add src/lib/utils/payrollCalculator.ts
git commit -m "feat(backend): add payrollCalculator.ts utility for automated tax, PF, ESI, and net salary computation"
```

### ⏰ Commit 5 (Hour 5)
```bash
git add src/lib/utils/auditLogger.ts
git commit -m "feat(backend): add auditLogger.ts client service for recording administrative audit trails"
```

### ⏰ Commit 6 (Hour 6)
```bash
git add src/lib/utils/exporter.ts
git commit -m "feat(backend): add exporter.ts utility function for CSV data exports"
```

### ⏰ Commit 7 (Hour 7)
```bash
git add src/lib/services/announcements.ts
git commit -m "feat(backend): add announcements.ts service for reading and creating broadcast announcements"
```

### ⏰ Commit 8 (Hour 8)
```bash
git add src/lib/services/holidays.ts
git commit -m "feat(backend): add holidays.ts service for fetching company holiday schedules"
```

### ⏰ Commit 9 (Hour 9)
```bash
git add src/lib/services/leaveQuota.ts
git commit -m "feat(backend): add leaveQuota.ts service for querying employee leave balances"
```

### ⏰ Commit 10 (Hour 10)
```bash
git add src/lib/services/notifications.ts
git commit -m "feat(backend): add notifications.ts service for Supabase real-time subscriptions"
```

---

## 💻 MEMBER 4: MOHITH L (Frontend Lead — 10 Commits)

Run these 10 commands (one every 1 hour):

### ⏰ Commit 1 (Hour 1)
```bash
git add src/components/ExportButton.tsx
git commit -m "feat(frontend): create ExportButton component for exporting tabular data"
```

### ⏰ Commit 2 (Hour 2)
```bash
git add src/components/CommandMenu.tsx
git commit -m "feat(frontend): add CommandMenu spotlight search modal (Cmd+K / Ctrl+K)"
```

### ⏰ Commit 3 (Hour 3)
```bash
git add src/components/PayslipModal.tsx
git commit -m "feat(frontend): create PayslipModal component for printable salary slips"
```

### ⏰ Commit 4 (Hour 4)
```bash
git add src/components/NotificationBell.tsx
git commit -m "feat(frontend): add NotificationBell dropdown component for real-time alerts"
```

### ⏰ Commit 5 (Hour 5)
```bash
git add src/components/AttendanceChart.tsx
git commit -m "feat(frontend): create AttendanceChart component for graphical distribution"
```

### ⏰ Commit 6 (Hour 6)
```bash
git add src/pages/AdminAttendance.tsx
git commit -m "feat(frontend): integrate ExportButton into Admin Attendance page"
```

### ⏰ Commit 7 (Hour 7)
```bash
git add src/pages/EmployeePayroll.tsx
git commit -m "feat(frontend): integrate PayslipModal into Employee Payroll page"
```

### ⏰ Commit 8 (Hour 8)
```bash
git add src/components/AppLayout.tsx
git commit -m "feat(frontend): connect CommandMenu and NotificationBell to AppLayout header"
```

### ⏰ Commit 9 (Hour 9)
```bash
git add src/App.tsx
git commit -m "refactor(frontend): optimize App.tsx using nested routes with Outlet"
```

### ⏰ Commit 10 (Hour 10)
```bash
git add .
git commit -m "build(hackathon): finalize Dayflow HRMS prototype features and production build for Odoo Hackathon 2026"
```
