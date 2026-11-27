# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Centra FTI** is an institutional management system for a Faculty of Information Technology. It covers personnel/HR, leave and overtime workflows, academic output (research, publications, community service), inventory, equipment/assets, facilities, committees, meetings and events.

Framework-level conventions (Laravel Boost guidelines, package versions, Pint/Pest/Wayfinder rules) live in `AGENTS.md`, and domain skills live in `.github/skills/`. Follow both. This file only covers what is specific to this project.

## Commands

```bash
composer setup                 # first-time install: deps, .env, key, migrate, build
composer dev                   # serve + queue + pail logs + vite (concurrently)
php artisan migrate:fresh --seed   # rebuild DB with realistic demo data for all modules

php artisan test --compact                                  # full suite
php artisan test --compact tests/Feature/InventoryItemManagementTest.php
php artisan test --compact --filter="can view items"        # single test by name
composer test                  # config:clear + pint --test + full suite

vendor/bin/pint --dirty --format agent   # format changed PHP files
npm run lint        # eslint --fix
npm run format      # prettier on resources/
npm run types:check # tsc --noEmit
composer ci:check   # eslint + prettier + tsc + tests (what CI runs)

php artisan wayfinder:generate   # regenerate TS route/action helpers after route changes
```

The database is SQLite. Tests use `DB_DATABASE=testing`, which resolves to the `testing` SQLite file at the repo root. Feature tests use `RefreshDatabase` (configured in `tests/Pest.php`).

## Architecture

### Identity model: User ⇄ Employee share a UUID primary key
`employees.id` is a UUID that is also a foreign key to `users.id` (cascade delete). `User::employee()` is `hasOne(Employee::class, 'id', 'id')`, and `EmployeeFactory` creates a `User` first and reuses its id. `Lecturer` and `Staff` hang off `Employee`. In tests, the usual pattern is `$employee = Employee::factory()->create(); $user = User::find($employee->id);`.

### Authorization: Spatie permissions enforced at the route level
- Most access control is done with `permission:<name>` route middleware in `routes/web.php` (e.g. `permission:equipment.view|equipment.manage`), inside one big `auth` + `verified` group. Permission names follow `<module>.<action>` (`inventory.manage`, `leave.approval`, `committee.view`, …) and are seeded in `database/seeders/RolePermissionsSeeder.php`.
- `AppServiceProvider` registers a `Gate::before` that grants everything to the `super-admin` role.
- Policies exist only for a few ownership-sensitive models (`app/Policies/`: Research, RoomUsage, RoomMaintenanceRequest, EquipmentUsage, EquipmentMaintenanceRequest).
- `HandleInertiaRequests` shares `auth.permissions` (every permission name the user has) with the frontend. UI gating reads from that prop.
- Tests typically call `Permission::findOrCreate(...)` / `Role::findOrCreate('super-admin')` in `beforeEach`, clear the `PermissionRegistrar` cache, and disable `PreventRequestForgery`.

### Backend layout
- Controllers are grouped by domain in subfolders: `Acl/` (organizations, positions, nomenclatures, roles, permissions, users), `Hr/` (employees and their histories, attendance, leave, overtime, students, trainings), `Academic/` (research, publications, community service), `Inventory/`, `Settings/`. Newer modules (equipment, rooms, committees, meetings, events, documents) sit flat in `app/Http/Controllers/`.
- **Duplicate inventory controllers:** `routes/web.php` uses `App\Http\Controllers\Inventory\*` (items, categories, warehouses, stock, procurements, receipts, requests, issues). The root-level `Inventory*Controller`, `ItemController`, `WarehouseController`, `StockOpnameController`, etc. are older scaffolding and are only referenced by the tests in `tests/Feature/Http/Controllers/`. Edit the `Inventory/` versions when changing live behavior.
- Much of the CRUD scaffolding (Store/Update form requests, factories, seeders, `tests/Feature/Http/Controllers/*ControllerTest.php`) was generated with Laravel Blueprint (`laravel-shift/blueprint`; see `draft-backup.yaml`). Hand-written feature tests live directly in `tests/Feature/` (e.g. `EmployeeManagementTest.php`, `InventoryItemManagementTest.php`).
- Workflow modules follow a consistent shape: a header record, `*Item` line records, and `*Approval` records, with `approve`/`reject` POST routes (inventory procurement/request, equipment procurement/usage/disposal, leave, overtime).

### Frontend
- Inertia pages live in `resources/js/pages/<kebab-case-module>/` (`index.tsx`, `create.tsx`, `edit.tsx`, `show.tsx`, plus a local `components/` folder for module-specific modals and forms). Shared types are per domain in `resources/js/types/*.ts`.
- Layouts are resolved centrally in `resources/js/app.tsx`: `AppLayout` is the default, `auth/*` pages get `AuthLayout`, `settings/*` get `[AppLayout, SettingsLayout]`, and `welcome` gets none. Pages should **not** wrap themselves in `<AppLayout>`. Set breadcrumbs through the static `Page.layout = { breadcrumbs: [...] }` property.
- Never hardcode URLs. Import Wayfinder helpers from `@/actions/App/Http/Controllers/...` or `@/routes/...`.
- UI conventions (from README): card-based layouts for detail and create views, and the shared `Heading` component for page titles and descriptions. Primitives come from `resources/js/components/ui/` (shadcn-style).
