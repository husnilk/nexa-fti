import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    ArrowLeft,
    Clock,
    ClipboardList,
    CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { __, intlLocale } from '@/lib/i18n';
import { index as attendanceIndex } from '@/routes/employee-attendances';
import {
    index as reportIndex,
    show as reportShow,
} from '@/routes/employee-attendances/reports';
import type { Auth } from '@/types';

type Attendance = {
    id: string;
    employee_id: string;
    date: string;
    check_in: string | null;
    check_out: string | null;
    break_in: string | null;
    break_out: string | null;
    status: 'present' | 'absent' | 'leave' | 'overtime' | 'holiday';
    notes: string | null;
};

type Employee = {
    id: string;
    name: string;
    emp_number: string;
};

type PageProps = {
    auth: Auth;
    employee: Employee;
    attendances: Attendance[];
    filters: {
        month: string;
    };
    [key: string]: any;
};

export default function ReportShow({
    employee,
    attendances = [],
    filters,
}: PageProps) {
    const [month, setMonth] = useState(filters.month);

    const handleMonthChange = (newMonth: string) => {
        setMonth(newMonth);
        router.get(
            reportShow.url({ employee: employee.id }),
            { month: newMonth },
            { preserveState: true },
        );
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

    const getStatusBadge = (status: Attendance['status'] | 'not_logged') => {
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
            case 'not_logged':
            default:
                return (
                    <span className="inline-flex items-center rounded-full border border-dashed bg-zinc-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-400 capitalize dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500">
                        {__('Not Logged')}
                    </span>
                );
        }
    };

    // Calculate dates in month
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr);
    const monthNum = parseInt(monthStr); // 1-indexed (1-12)
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    const dates = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;

        return `${yearStr}-${monthStr}-${day.toString().padStart(2, '0')}`;
    });

    const parsedMonthName = new Date(year, monthNum - 1).toLocaleDateString(
        intlLocale(),
        { month: 'long', year: 'numeric' },
    );

    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head
                title={__('Attendance Details - :name', {
                    name: employee.name,
                })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Link href={reportIndex.url({ month })}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                            {employee.name}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__(
                                'Daily attendance sheet for :month (Emp #: :number)',
                                {
                                    month: parsedMonthName,
                                    number: employee.emp_number,
                                },
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {__('Showing details for:')}{' '}
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {parsedMonthName}
                    </span>
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            className="w-36 border-0 bg-transparent p-0 text-sm outline-hidden focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="w-1/4 px-6 py-4">
                                    {__('Date')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="px-6 py-4">{__('Check In')}</th>
                                <th className="px-6 py-4">{__('Check Out')}</th>
                                <th className="px-6 py-4">
                                    {__('Break Duration')}
                                </th>
                                <th className="px-6 py-4">{__('Notes')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {dates.map((dateStr) => {
                                const record = attendances.find((att) => {
                                    const attDate =
                                        typeof att.date === 'string'
                                            ? att.date.substring(0, 10)
                                            : new Date(att.date)
                                                  .toISOString()
                                                  .split('T')[0];

                                    return attDate === dateStr;
                                });

                                const dateObj = new Date(dateStr);
                                const dayName = dateObj.toLocaleDateString(
                                    intlLocale(),
                                    { weekday: 'short' },
                                );
                                const dateFormatted =
                                    dateObj.toLocaleDateString(intlLocale(), {
                                        day: '2-digit',
                                        month: 'short',
                                    });
                                const isWeekend =
                                    dateObj.getDay() === 0 ||
                                    dateObj.getDay() === 6;

                                return (
                                    <tr
                                        key={dateStr}
                                        className={`transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 ${
                                            isWeekend && !record
                                                ? 'bg-zinc-50/30 dark:bg-zinc-900/10'
                                                : ''
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <span
                                                className={`font-semibold ${isWeekend ? 'text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}
                                            >
                                                {dayName}, {dateFormatted}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(
                                                record
                                                    ? record.status
                                                    : 'not_logged',
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-zinc-700 dark:text-zinc-300">
                                            {record
                                                ? formatTime(record.check_in)
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-zinc-700 dark:text-zinc-300">
                                            {record
                                                ? formatTime(record.check_out)
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {record &&
                                            record.break_in &&
                                            record.break_out ? (
                                                <span className="flex items-center gap-1 font-mono">
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {formatTime(
                                                        record.break_in,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatTime(
                                                        record.break_out,
                                                    )}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td
                                            className="max-w-xs truncate px-6 py-4 text-xs text-muted-foreground italic"
                                            title={record?.notes || ''}
                                        >
                                            {record?.notes || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

ReportShow.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        { title: __('Attendance'), href: attendanceIndex() },
        { title: __('Monthly Report'), href: reportIndex.url() },
        { title: __('Detail'), href: '' },
    ],
};
