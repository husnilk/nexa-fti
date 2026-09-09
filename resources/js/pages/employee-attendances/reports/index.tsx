import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, X, Calendar, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { index as attendanceIndex } from '@/routes/employee-attendances';
import { index as reportIndex, show as reportShow } from '@/routes/employee-attendances/reports';
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
        filters.month || new Date().toISOString().split('T')[0].substring(0, 7)
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
            }
        );
    }, [debouncedSearch, month]);

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Attendance Monthly Report" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                    <Link href={attendanceIndex()}>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                            Attendance Monthly Report
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Monthly summary of employee attendance stats (Presents, Absents, Leaves, Overtime, Holidays).
                        </p>
                    </div>
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
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
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
                                <th className="py-4 px-6">Emp #</th>
                                <th className="py-4 px-6">Employee Name</th>
                                <th className="py-4 px-6 text-center">Presents</th>
                                <th className="py-4 px-6 text-center">Absents</th>
                                <th className="py-4 px-6 text-center">Leaves</th>
                                <th className="py-4 px-6 text-center">Overtime</th>
                                <th className="py-4 px-6 text-center">Holidays</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {report.length > 0 ? (
                                report.map((row) => (
                                    <tr key={row.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                                {row.emp_number}
                                            </code>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {row.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                                            {row.present_count}
                                        </td>
                                        <td className="py-4 px-6 text-center font-semibold text-rose-600 dark:text-rose-400">
                                            {row.absent_count}
                                        </td>
                                        <td className="py-4 px-6 text-center font-semibold text-indigo-600 dark:text-indigo-400">
                                            {row.leave_count}
                                        </td>
                                        <td className="py-4 px-6 text-center font-semibold text-amber-600 dark:text-amber-400">
                                            {row.overtime_count}
                                        </td>
                                        <td className="py-4 px-6 text-center font-semibold text-zinc-500 dark:text-zinc-400">
                                            {row.holiday_count}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link href={reportShow.url({ employee: row.id }, { query: { month } })}>
                                                <Button variant="ghost" size="sm" className="cursor-pointer gap-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    <Eye className="h-4 w-4" /> View Details
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                                        No employee records found.
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
        { title: 'HR', href: '#' },
        { title: 'Attendance', href: attendanceIndex() },
        { title: 'Monthly Report', href: reportIndex.url() },
    ],
};
