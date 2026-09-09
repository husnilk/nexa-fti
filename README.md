# Centra FTI - Institutional Management System

**Centra FTI** is a high-performance, centralized management system designed specifically for the Faculty of Information Technology. Built with a modern Laravel and React stack, it provides a seamless and robust experience for managing personnel, academic output, HR workflows, and institutional inventory.

## 🏛️ Core Modules

### 1. Personnel & Identity
- **Comprehensive Tracking**: Manage detailed profiles for Employees, Lecturers, Staff, and Students.
- **Historical Data**: Track education history, position changes, and nomenclature classifications over time.

### 2. HR & Operations
- **Leave Management**: Full workflow for leave requests with multi-level approvals and automatic balance tracking.
- **Overtime Requests**: Streamlined submission and approval process for staff overtime.
- **Attendance**: Real-time tracking of employee attendance and holidays.

### 3. Academic Activity
- **Research Tracking**: Manage institutional research projects and their members.
- **Publication Hub**: Centralized database for Journal Publications and Conference Proceedings.
- **Community Service**: Track outreach and community engagement activities.

### 4. Inventory Management
- **Stock Overview**: Real-time monitoring of items across multiple warehouses with low-stock alerts.
- **Inbound Workflow**: Full procurement lifecycle from request and approval to item receipt.
- **Outbound Workflow**: Employee request system for inventory items with fulfillment tracking.

## 🛠️ Technology Stack

- **Backend**: Laravel 13 (PHP 8.4)
- **Frontend**: React 19 via **Inertia.js v3** (SPA experience)
- **Styling**: Tailwind CSS v4
- **Auth & Security**: Laravel Fortify & Spatie Laravel Permission (RBAC)
- **Type Safety**: Laravel Wayfinder (Auto-generated TypeScript actions)
- **Testing**: Pest v4

## 🚀 Getting Started

### Prerequisites
- PHP 8.4+
- Node.js 20+
- Composer & NPM

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   composer install
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database & Demo Data:**
   ```bash
   touch database/database.sqlite
   php artisan migrate:fresh --seed
   ```
   *Note: This will seed the system with realistic data for all modules, including Inventory and HR.*

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 🏗️ Development Standards

### Routing & Type Safety
This project uses **Laravel Wayfinder**. Never hardcode URLs in the frontend. Always use the generated actions:
```typescript
import { index as researchIndex } from '@/actions/App/Http/Controllers/Academic/ResearchController';

// Usage:
<Link href={researchIndex().url}>Research</Link>
```
If you add new routes, regenerate the actions:
```bash
php artisan wayfinder:generate
```

### UI Consistency
Follow the established patterns in `resources/js/pages/`:
- **Card-based layouts** for detail and creation views.
- **Standardized Heading components** for page titles and descriptions.
- **Persistent Layouts**: Use the `Page.layout` pattern for breadcrumbs instead of wrapping every page in `<AppLayout>`.

### Testing
We prioritize feature tests using **Pest**. Run the suite with:
```bash
php artisan test
```

### Code Quality
Ensure PHP code follows standards using **Laravel Pint**:
```bash
./vendor/bin/pint
```
