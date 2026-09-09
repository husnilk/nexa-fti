import { Head, Link, router } from '@inertiajs/react';
import { Calendar as CalendarIcon, ArrowLeft, Clock, ClipboardList, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { index as attendanceIndex } from '@/routes/employee-attendances';
import { index as reportIndex, show as reportShow } from '@/routes/employee-attendances/reports';
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

export default function ReportShow({ employee, attendances = [], filters }: PageProps) {
    const [month, setMonth] = useState(filters.month);

    const handleMonthChange = (newMonth: string) => {
        setMonth(newMonth);
        router.get(
            reportShow.url({ employee: employee.id }),
            { month: newMonth },
            { preserveState: true }
        );
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

    const getStatusBadge = (status: Attendance['status'] | 'not_logged') => {
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
            case 'not_logged':
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize bg-zinc-50 text-zinc-400 border border-dashed dark:bg-zinc-900/50 dark:text-zinc-500 dark:border-zinc-800">
                        Not Logged
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

    const parsedMonthName = new Date(year, monthNum - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <div className="container mx-auto py-8 px-4 space-y-6 max-w-4xl">
            <Head title={`Attendance Details - ${employee.name}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                    <Link href={reportIndex.url({ month })}>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                            {employee.name}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Daily attendance sheet for {parsedMonthName} (Emp #: {employee.emp_number})
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Showing details for: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{parsedMonthName}</span>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-md border dark:border-zinc-800 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            className="bg-transparent border-0 outline-hidden focus:ring-0 p-0 text-sm w-36"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6 w-1/4">Date</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6">Check In</th>
                                <th className="py-4 px-6">Check Out</th>
                                <th className="py-4 px-6">Break Duration</th>
                                <th className="py-4 px-6">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {dates.map((dateStr) => {
                                const record = attendances.find((att) => {
                                    const attDate = typeof att.date === 'string'
                                        ? att.date.substring(0, 10)
                                        : new Date(att.date).toISOString().split('T')[0];

                                    return attDate === dateStr;
                                });

                                const dateObj = new Date(dateStr);
                                const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
                                const dateFormatted = dateObj.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
                                const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                                return (
                                    <tr
                                        key={dateStr}
                                        className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors ${
                                            isWeekend && !record ? 'bg-zinc-50/30 dark:bg-zinc-900/10' : ''
                                        }`}
                                    >
                                        <td className="py-4 px-6">
                                            <span className={`font-semibold ${isWeekend ? 'text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                {dayName}, {dateFormatted}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {getStatusBadge(record ? record.status : 'not_logged')}
                                        </td>
                                        <td className="py-4 px-6 font-mono text-zinc-700 dark:text-zinc-300">
                                            {record ? formatTime(record.check_in) : '-'}
                                        </td>
                                        <td className="py-4 px-6 font-mono text-zinc-700 dark:text-zinc-300">
                                            {record ? formatTime(record.check_out) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                            {record && record.break_in && record.break_out ? (
                                                <span className="flex items-center gap-1 font-mono">
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {formatTime(record.break_in)} - {formatTime(record.break_out)}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-xs text-muted-foreground italic max-w-xs truncate" title={record?.notes || ''}>
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
        { title: 'HR', href: '#' },
        { title: 'Attendance', href: attendanceIndex() },
        { title: 'Monthly Report', href: reportIndex.url() },
        { title: 'Detail', href: '' },
    ],
};
