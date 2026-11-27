import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    monthName,
    monthNames,
    sumFields,
} from './components/attendance-fields';
import AttendanceController from '@/actions/App/Http/Controllers/AttendanceController';
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
import { __ } from '@/lib/i18n';
import {
    create as attendanceCreate,
    edit as attendanceEdit,
    index as attendanceIndex,
    show as attendanceShow,
} from '@/routes/attendances';
import type { Auth } from '@/types';
import type { Attendance, AttendancePeriodOption } from '@/types/remuneration';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    auth: Auth;
    attendances: {
        data: Attendance[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    periods: AttendancePeriodOption[];
    filters: {
        search?: string | null;
        period_id?: string | null;
        month?: string | null;
    };
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

function paginationLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

export default function AttendanceIndex({
    attendances,
    periods = [],
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingAttendance, setDeletingAttendance] =
        useState<Attendance | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [periodId, setPeriodId] = useState(filters.period_id || '');
    const [month, setMonth] = useState(filters.month || '');
    const debouncedSearch = useDebounce(search, 500);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        router.get(
            attendanceIndex(),
            { search: debouncedSearch, period_id: periodId, month },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, periodId, month]);

    const mayManage = can(auth, 'attendance.manage');

    function destroyAttendance(): void {
        if (!deletingAttendance) {
            return;
        }

        router.delete(AttendanceController.destroy.url(deletingAttendance.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingAttendance(null),
        });
    }

    const selectClass =
        'h-10 rounded-md border bg-white dark:bg-zinc-900 dark:border-zinc-800 px-3 text-sm text-zinc-700 dark:text-zinc-300';

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Monthly Attendance')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Monthly Attendance')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Monthly attendance recap per employee and period: presence, leave, late arrivals, and early departures.',
                        )}
                    </p>
                </div>
                {mayManage && (
                    <Link href={attendanceCreate()}>
                        <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700">
                            <Plus className="h-4 w-4" /> {__('Add Record')}
                        </Button>
                    </Link>
                )}
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
                    <select
                        aria-label={__('Filter by period')}
                        value={periodId}
                        onChange={(e) => setPeriodId(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">{__('All periods')}</option>
                        {periods.map((period) => (
                            <option key={period.id} value={period.id}>
                                {period.name}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label={__('Filter by month')}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">{__('All months')}</option>
                        {monthNames.map((name, i) => (
                            <option key={name} value={i + 1}>
                                {name}
                            </option>
                        ))}
                    </select>
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
                                <th className="px-6 py-4">{__('Period')}</th>
                                <th className="px-6 py-4">{__('Month')}</th>
                                <th className="px-6 py-4 text-center">
                                    {__('Present')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Absent')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Late')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Early Dep.')}
                                </th>
                                <th className="px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {attendances.data.length > 0 ? (
                                attendances.data.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {record.employee?.emp_number}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {record.employee?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {record.period?.name}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {monthName(record.month)}{' '}
                                            {record.year}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-emerald-700 dark:text-emerald-400">
                                            {record.present ?? 0}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-rose-700 dark:text-rose-400">
                                            {record.absent ?? 0}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-amber-700 dark:text-amber-400">
                                            {sumFields(record, 'late_')}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-amber-700 dark:text-amber-400">
                                            {sumFields(
                                                record,
                                                'early_departure_',
                                            )}
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
                                                {mayManage && (
                                                    <>
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
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No attendance records found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {attendances.total > 0 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-4 text-sm text-muted-foreground sm:flex-row dark:border-zinc-800">
                        <span>
                            {__('Showing :from–:to of :total', {
                                from: attendances.from,
                                to: attendances.to,
                                total: attendances.total,
                            })}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {attendances.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                    >
                                        <Button
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="cursor-pointer"
                                        >
                                            {paginationLabel(link.label)}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        key={i}
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        {paginationLabel(link.label)}
                                    </Button>
                                ),
                            )}
                        </div>
                    </div>
                )}
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
                            'Are you sure you want to delete the attendance record for :name in :period?',
                            {
                                name: deletingAttendance?.employee?.name,
                                period: deletingAttendance
                                    ? `${monthName(deletingAttendance.month)} ${deletingAttendance.year}`
                                    : '',
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
        { title: __('Remuneration'), href: '#' },
        { title: __('Monthly Attendance'), href: attendanceIndex() },
    ],
};
