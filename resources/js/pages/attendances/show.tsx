import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarRange, Pencil, UserRound } from 'lucide-react';
import {
    attendanceFieldGroups,
    monthName,
} from './components/attendance-fields';
import { Button } from '@/components/ui/button';
import { __, intlLocale } from '@/lib/i18n';
import {
    edit as attendanceEdit,
    index as attendanceIndex,
} from '@/routes/attendances';
import type { Auth } from '@/types';
import type { Attendance } from '@/types/remuneration';

type PageProps = {
    auth: Auth;
    attendance: Attendance;
};

export default function AttendanceShow({ attendance }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayUpdate =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('attendance.manage');

    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head title={__('Monthly Attendance Detail')} />

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
                            {__('Attendance Details')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__(
                                'Monthly attendance recap used for remuneration.',
                            )}
                        </p>
                    </div>
                </div>
                {mayUpdate && (
                    <Link href={attendanceEdit.url(attendance.id)}>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 border-zinc-200 font-medium shadow-xs dark:border-zinc-800"
                        >
                            <Pencil className="h-4 w-4" /> {__('Edit')}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <UserRound className="size-6 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {attendance.employee?.name}
                            </h3>
                            <p className="font-mono text-sm text-muted-foreground">
                                {attendance.employee?.emp_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <CalendarRange className="size-4 text-muted-foreground" />
                        <span className="font-medium">
                            {monthName(attendance.month)} {attendance.year}
                        </span>
                        <span className="text-muted-foreground">
                            · {attendance.period?.name}
                        </span>
                    </div>
                </div>
            </div>

            {attendanceFieldGroups.map((group) => (
                <div
                    key={group.key}
                    className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            {group.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {group.description}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {group.fields.map((field) => (
                            <div key={field.name}>
                                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    {field.label}
                                </p>
                                <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    {attendance[field.name] ?? 0}
                                </p>
                                {field.hint && (
                                    <p className="text-xs text-muted-foreground">
                                        {field.hint}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {attendance.creator && (
                <p className="text-xs text-muted-foreground">
                    {__('Recorded by :name on :date', {
                        name: attendance.creator.name,
                        date: new Date(
                            attendance.created_at,
                        ).toLocaleDateString(intlLocale(), {
                            dateStyle: 'medium',
                        }),
                    })}
                </p>
            )}
        </div>
    );
}

AttendanceShow.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Monthly Attendance'), href: attendanceIndex() },
        { title: __('Detail'), href: '' },
    ],
};
