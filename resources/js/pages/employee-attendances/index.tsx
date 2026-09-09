import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
    Calendar as CalendarIcon,
    FileText,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import EmployeeAttendanceController from '@/actions/App/Http/Controllers/Hr/EmployeeAttendanceController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import {
    index as attendanceIndex,
    create as attendanceCreate,
    edit as attendanceEdit,
    show as attendanceShow,
} from '@/routes/employee-attendances';
import { index as reportIndex } from '@/routes/employee-attendances/reports';
import { index as holidaysIndex } from '@/routes/holidays';
import type { Auth } from '@/types';

type Attendance = {
    id: string;
    employee: {
        id: string;
        name: string;
        emp_number: string;
    };
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: 'present' | 'absent' | 'leave' | 'overtime' | 'holiday';
    notes: string | null;
};

type PageProps = {
    auth: Auth;
    attendances: Attendance[];
    filters: {
        search?: string;
        date?: string;
    };
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function AttendanceIndex({ attendances = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingAttendance, setDeletingAttendance] =
        useState<Attendance | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(
        filters.date || new Date().toISOString().split('T')[0],
    );
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        router.get(
            attendanceIndex(),
            { search: debouncedSearch, date },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, date]);

    const mayCreate = can(auth, 'hr.manage');
    const mayUpdate = can(auth, 'hr.manage');
    const mayDelete = can(auth, 'hr.manage');
    const canViewHolidays = can(auth, 'hr.view');

    function destroyAttendance(): void {
        if (!deletingAttendance) {
            return;
        }

        router.delete(
            EmployeeAttendanceController.destroy.url(deletingAttendance.id),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingAttendance(null),
            },
        );
    }

    const getStatusBadge = (status: Attendance['status']) => {
        switch (status) {
            case 'present':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400">
                        Present
                    </span>
                );
            case 'absent':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400">
                        Absent
                    </span>
                );
            case 'leave':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400">
                        Leave
                    </span>
                );
            case 'overtime':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400">
                        Overtime
                    </span>
                );
            case 'holiday':
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                        Holiday
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                        {status}
                    </span>
                );
        }
    };

    const formatTime = (dateTimeStr: string | null) => {
        if (!dateTimeStr) {
            return '-';
        }

        return new Date(dateTimeStr).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Employee Attendance" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Employee Attendance
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor and manage daily employee attendance records, statuses, work hours, and breaks.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {canViewHolidays && (
                        <Link href={holidaysIndex()}>
                            <Button variant="outline" className="cursor-pointer gap-2 border-zinc-200 dark:border-zinc-800 font-medium shadow-xs">
                                <CalendarIcon className="h-4 w-4" /> Holidays
                            </Button>
                        </Link>
                    )}
                    <Link href={reportIndex.url()}>
                        <Button variant="outline" className="cursor-pointer gap-2 border-zinc-200 dark:border-zinc-800 font-medium shadow-xs">
                            <FileText className="h-4 w-4" /> Monthly Report
                        </Button>
                    </Link>
                    {mayCreate && (
                        <Link href={attendanceCreate()}>
                            <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                                <Plus className="h-4 w-4" /> Add Record
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search employees..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-md border dark:border-zinc-800 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent border-0 outline-hidden focus:ring-0 p-0 text-sm w-32"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Emp #</th>
                                <th className="py-4 px-6">Employee Name</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Check In</th>
                                <th className="py-4 px-6">Check Out</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {attendances.length > 0 ? (
                                attendances.map((record) => (
                                    <tr key={record.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-850 dark:text-zinc-300">
                                                {record.employee.emp_number}
                                            </code>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {record.employee.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                {new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-zinc-700 dark:text-zinc-300">
                                            {formatTime(record.check_in)}
                                        </td>
                                        <td className="py-4 px-6 font-mono text-zinc-700 dark:text-zinc-300">
                                            {formatTime(record.check_out)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {getStatusBadge(record.status)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={attendanceShow.url(record.id)}>
                                                    <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayUpdate && (
                                                    <Link href={attendanceEdit.url(record.id)}>
                                                        <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        onClick={() => setDeletingAttendance(record)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No attendance records found for this date.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={deletingAttendance !== null}
                onOpenChange={(open) => !open && setDeletingAttendance(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Attendance Record</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground italic">
                        Are you sure you want to delete the attendance record for {deletingAttendance?.employee.name} on {deletingAttendance?.date}?
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingAttendance(null)}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyAttendance}
                            className="cursor-pointer"
                        >
                            Delete Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Attendance', href: attendanceIndex() },
    ],
};
