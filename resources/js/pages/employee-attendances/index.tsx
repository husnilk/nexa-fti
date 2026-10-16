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
import { __, intlLocale } from '@/lib/i18n';
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

export default function AttendanceIndex({
    attendances = [],
    filters,
}: PageProps) {
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
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-emerald-700 capitalize dark:bg-emerald-950/35 dark:text-emerald-400">
                        {__('Present')}
                    </span>
                );
            case 'absent':
                return (
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-rose-700 capitalize dark:bg-rose-950/35 dark:text-rose-400">
                        {__('Absent')}
                    </span>
                );
            case 'leave':
                return (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-indigo-700 capitalize dark:bg-indigo-950/35 dark:text-indigo-400">
                        {__('Leave')}
                    </span>
                );
            case 'overtime':
                return (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-amber-700 capitalize dark:bg-amber-950/35 dark:text-amber-400">
                        {__('Overtime')}
                    </span>
                );
            case 'holiday':
                return (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-700 capitalize dark:bg-zinc-800 dark:text-zinc-400">
                        {__('Holiday')}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-700 capitalize dark:bg-zinc-800 dark:text-zinc-400">
                        {status}
                    </span>
                );
        }
    };

    const formatTime = (dateTimeStr: string | null) => {
        if (!dateTimeStr) {
            return '-';
        }

        return new Date(dateTimeStr).toLocaleTimeString(intlLocale(), {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Employee Attendance')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Employee Attendance')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Monitor and manage daily employee attendance records, statuses, work hours, and breaks.',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {canViewHolidays && (
                        <Link href={holidaysIndex()}>
                            <Button
                                variant="outline"
                                className="cursor-pointer gap-2 border-zinc-200 font-medium shadow-xs dark:border-zinc-800"
                            >
                                <CalendarIcon className="h-4 w-4" />{' '}
                                {__('Holidays')}
                            </Button>
                        </Link>
                    )}
                    <Link href={reportIndex.url()}>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 border-zinc-200 font-medium shadow-xs dark:border-zinc-800"
                        >
                            <FileText className="h-4 w-4" />{' '}
                            {__('Monthly Report')}
                        </Button>
                    </Link>
                    {mayCreate && (
                        <Link href={attendanceCreate()}>
                            <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700">
                                <Plus className="h-4 w-4" /> {__('Add Record')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search employees...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-32 border-0 bg-transparent p-0 text-sm outline-hidden focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Emp #')}</th>
                                <th className="px-6 py-4">
                                    {__('Employee Name')}
                                </th>
                                <th className="px-6 py-4">{__('Date')}</th>
                                <th className="px-6 py-4">{__('Check In')}</th>
                                <th className="px-6 py-4">{__('Check Out')}</th>
                                <th className="px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {attendances.length > 0 ? (
                                attendances.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="text-zinc-850 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800 dark:text-zinc-300">
                                                {record.employee.emp_number}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {record.employee.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                {new Date(
                                                    record.date,
                                                ).toLocaleDateString(
                                                    intlLocale(),
                                                    { dateStyle: 'medium' },
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-zinc-700 dark:text-zinc-300">
                                            {formatTime(record.check_in)}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-zinc-700 dark:text-zinc-300">
                                            {formatTime(record.check_out)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(record.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={attendanceShow.url(
                                                        record.id,
                                                    )}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayUpdate && (
                                                    <Link
                                                        href={attendanceEdit.url(
                                                            record.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        onClick={() =>
                                                            setDeletingAttendance(
                                                                record,
                                                            )
                                                        }
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
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
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No attendance records found for this date.',
                                        )}
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
                        <DialogTitle>
                            {__('Delete Attendance Record')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground italic">
                        {__(
                            'Are you sure you want to delete the attendance record for :name on :date?',
                            {
                                name: deletingAttendance?.employee.name,
                                date: deletingAttendance?.date,
                            },
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingAttendance(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyAttendance}
                            className="cursor-pointer"
                        >
                            {__('Delete Record')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

AttendanceIndex.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        { title: __('Attendance'), href: attendanceIndex() },
    ],
};
