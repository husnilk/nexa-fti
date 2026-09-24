import { Head, Link, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    BookOpen,
    Briefcase,
    ChevronDown,
    Eye,
    Pencil,
    Plus,
    Search,
    Settings,
    Trash2,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { EmployeeFormModal } from '@/pages/employees/components/employee-form-modal';
import { index as employeeRanksIndex } from '@/routes/employee-ranks';
import { index as employeeTypesIndex } from '@/routes/employee-types';
import {
    index as employeesIndex,
    show as employeeShow,
} from '@/routes/employees';
import { index as employmentContractsIndex } from '@/routes/employment-contracts';
import { index as employmentTypesIndex } from '@/routes/employment-types';
import type { Auth } from '@/types';
import type { Employee } from '@/types/hr';

type PageProps = {
    auth: Auth;
    employees: Employee[];
    filters: {
        search?: string;
    };
    employmentTypes?: any[];
    functionalPositions?: any[];
    positions?: any[];
    supervisors?: any[];
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

export default function EmployeesIndex({
    employees,
    filters,
    employmentTypes = [],
    functionalPositions = [],
    positions = [],
    supervisors = [],
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase()) ||
            emp.emp_number.toLowerCase().includes(search.toLowerCase());
        const matchesType =
            typeFilter === 'all' ||
            (typeFilter === 'lecturer' && !!emp.lecturer) ||
            (typeFilter === 'staff' && !!emp.staff);
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && emp.status === 1) ||
            (statusFilter === 'inactive' && emp.status !== 1);

        return matchesSearch && matchesType && matchesStatus;
    });

    const mayCreate = can(auth, 'hr.manage');
    const mayUpdate = can(auth, 'hr.manage');
    const mayDelete = can(auth, 'hr.manage');

    const handleDelete = (emp: Employee) => {
        if (confirm(`Are you sure you want to delete ${emp.name}? This will also delete the associated user account.`)) {
            router.delete(employeeShow.url(emp.id));
        }
    };

    const totalLecturers = employees.filter((e) => !!e.lecturer).length;
    const totalStaff = employees.filter((e) => !!e.staff).length;
    const totalActive = employees.filter((e) => e.status === 1).length;

    return (
        <>
            <Head title="Employees" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                            Employees
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage all university employees — Lecturers &amp; Staff.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="cursor-pointer gap-2">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="text-xs text-muted-foreground font-medium">HR Configuration</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={employeeTypesIndex()} className="w-full cursor-pointer">
                                        Employee Types
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={employmentContractsIndex()} className="w-full cursor-pointer">
                                        Employment Contracts
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={employmentTypesIndex()} className="w-full cursor-pointer">
                                        Employment Types
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={employeeRanksIndex()} className="w-full cursor-pointer">
                                        Employee Ranks
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {mayCreate && (
                            <Button
                                type="button"
                                onClick={() => setIsCreateOpen(true)}
                                className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md"
                            >
                                <Plus className="h-4 w-4" />
                                Add Employee
                            </Button>
                        )}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Employees</p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {employees.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Lecturers</p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalLecturers}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/35 dark:text-amber-400">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Staff</p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalStaff}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Active</p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalActive}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search employees..."
                            className="bg-white pl-9 dark:bg-zinc-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                        >
                            <option value="all">All Types</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="staff">Staff</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <span className="inline-flex items-center h-10 rounded-full border border-input bg-white dark:bg-zinc-900 dark:border-zinc-800 px-4 text-xs font-medium tracking-wide uppercase text-muted-foreground">
                            {filteredEmployees.length} records
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Type / Category</th>
                                    <th className="px-6 py-4">Join Date</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No employees found matching the filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((emp) => (
                                        <tr
                                            key={emp.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            {/* Employee Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {emp.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {emp.email}
                                                    </span>
                                                    <code className="mt-0.5 font-mono text-[10px] text-violet-600 dark:text-violet-400">
                                                        {emp.emp_number}
                                                    </code>
                                                </div>
                                            </td>

                                            {/* Type / Category */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide
                                                            ${emp.lecturer
                                                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400'
                                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400'
                                                            }`}
                                                    >
                                                        {emp.lecturer ? (
                                                            <BookOpen className="h-3 w-3" />
                                                        ) : (
                                                            <Briefcase className="h-3 w-3" />
                                                        )}
                                                        {emp.lecturer ? 'Lecturer' : 'Staff'}
                                                    </span>
                                                    {emp.employment_type && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {emp.employment_type.employee_type.name}
                                                            {' / '}
                                                            {emp.employment_type.employment_contract.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Join Date */}
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {dateFormatter.format(new Date(emp.join_date))}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide capitalize
                                                        ${emp.status === 1
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                        }`}
                                                >
                                                    <BadgeCheck className="h-3 w-3" />
                                                    {emp.status === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={employeeShow.url(emp.id)}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                            title="View"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayUpdate && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            title="Edit"
                                                            onClick={() => setEditingEmployee(emp)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {mayDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                            title="Delete"
                                                            onClick={() => handleDelete(emp)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Employee Modal */}
            <EmployeeFormModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                employee={null}
                employmentTypes={employmentTypes}
                functionalPositions={functionalPositions}
                positions={positions}
                supervisors={supervisors}
                onSuccess={() => {
                    setSearch('');
                    setTypeFilter('all');
                    setStatusFilter('all');
                }}
            />

            {/* Edit Employee Modal */}
            <EmployeeFormModal
                open={!!editingEmployee}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingEmployee(null);
                    }
                }}
                employee={editingEmployee}
                employmentTypes={employmentTypes}
                functionalPositions={functionalPositions}
                positions={positions}
                supervisors={supervisors}
                onSuccess={() => setEditingEmployee(null)}
            />
        </>
    );
}

EmployeesIndex.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Employees', href: employeesIndex() },
    ],
};
