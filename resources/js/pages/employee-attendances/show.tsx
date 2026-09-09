import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Calendar as CalendarIcon,
    UserRound,
    ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index as attendanceIndex } from '@/routes/employee-attendances';

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
    break_in: string | null;
    break_out: string | null;
    status: 'present' | 'absent' | 'leave' | 'overtime' | 'holiday';
    notes: string | null;
};

type PageProps = {
    attendance: Attendance;
};

export default function AttendanceShow({ attendance }: PageProps) {
    const formatDateTime = (dateTimeStr: string | null) => {
        if (!dateTimeStr) {
            return '-';
        }

        return new Date(dateTimeStr).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
            <Head title="Attendance Record Detail" />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={attendanceIndex()}>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Attendance Details
                    </h1>
                    <p className="text-muted-foreground mt-1">Detailed log of the employee's work and break hours.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <UserRound className="size-6 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {attendance.employee.name}
                            </h3>
                            <p className="font-mono text-sm text-muted-foreground">
                                {attendance.employee.emp_number}
                            </p>
                        </div>
                    </div>
                    <div>{getStatusBadge(attendance.status)}</div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <CalendarIcon className="size-4" />
                            <span>Date</span>
                        </div>
                        <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                            {new Date(attendance.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Clock className="size-4" />
                            <span>Work Hours</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Check In
                                </p>
                                <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    {formatDateTime(attendance.check_in)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Check Out
                                </p>
                                <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    {formatDateTime(attendance.check_out)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Clock className="size-4" />
                            <span>Break Time</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Break Start
                                </p>
                                <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    {formatDateTime(attendance.break_in)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Break End
                                </p>
                                <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    {formatDateTime(attendance.break_out)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 col-span-1 md:col-span-2 border-t pt-4 dark:border-zinc-800">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <ClipboardList className="size-4" />
                            <span>Notes</span>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border dark:border-zinc-800 italic">
                            {attendance.notes || 'No notes available for this record.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

AttendanceShow.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Attendance', href: attendanceIndex() },
        { title: 'Detail', href: '' },
    ],
};
