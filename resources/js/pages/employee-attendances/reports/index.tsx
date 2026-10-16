import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, X, Calendar, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { __ } from '@/lib/i18n';
import { index as attendanceIndex } from '@/routes/employee-attendances';
import {
    index as reportIndex,
    show as reportShow,
} from '@/routes/employee-attendances/reports';
import type { Auth } from '@/types';

type EmployeeReport = {
    id: string;
    name: string;
    emp_number: string;
    present_count: number;
    absent_count: number;
    leave_count: number;
    overtime_count: number;
    holiday_count: number;
};

type PageProps = {
    auth: Auth;
    report: EmployeeReport[];
    filters: {
        search?: string;
        month?: string;
    };
    [key: string]: any;
};

export default function ReportsIndex({ report = [], filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [month, setMonth] = useState(
        filters.month || new Date().toISOString().split('T')[0].substring(0, 7),
    );
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        router.get(
            reportIndex.url(),
            { search: debouncedSearch, month },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, month]);

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Attendance Monthly Report')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Link href={attendanceIndex()}>
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
                            {__('Attendance Monthly Report')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__(
                                'Monthly summary of employee attendance stats (Presents, Absents, Leaves, Overtime, Holidays).',
                            )}
                        </p>
                    </div>
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
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
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
                                <th className="px-6 py-4">{__('Emp #')}</th>
                                <th className="px-6 py-4">
                                    {__('Employee Name')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Presents')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Absents')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Leaves')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Overtime')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Holidays')}
                                </th>
                                <th className="px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {report.length > 0 ? (
                                report.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {row.emp_number}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {row.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                                            {row.present_count}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-rose-600 dark:text-rose-400">
                                            {row.absent_count}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                                            {row.leave_count}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-amber-600 dark:text-amber-400">
                                            {row.overtime_count}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-zinc-500 dark:text-zinc-400">
                                            {row.holiday_count}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={reportShow.url(
                                                    { employee: row.id },
                                                    { query: { month } },
                                                )}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="cursor-pointer gap-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <Eye className="h-4 w-4" />{' '}
                                                    {__('View Details')}
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No employee records found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        { title: __('Attendance'), href: attendanceIndex() },
        { title: __('Monthly Report'), href: reportIndex.url() },
    ],
};
