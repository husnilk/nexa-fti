import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AttendanceForm from './components/attendance-form';
import { Button } from '@/components/ui/button';
import { __ } from '@/lib/i18n';
import { index as attendanceIndex } from '@/routes/attendances';
import type {
    AttendanceEmployee,
    AttendancePeriodOption,
} from '@/types/remuneration';

type PageProps = {
    employees: AttendanceEmployee[];
    periods: AttendancePeriodOption[];
};

export default function AttendanceCreate({
    employees = [],
    periods = [],
}: PageProps) {
    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head title={__('Add Monthly Attendance')} />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
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
                        {__('Add Monthly Attendance')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            "Record an employee's attendance recap for one month of a period.",
                        )}
                    </p>
                </div>
            </div>

            <AttendanceForm employees={employees} periods={periods} />
        </div>
    );
}

AttendanceCreate.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Monthly Attendance'), href: attendanceIndex() },
        { title: __('Add Record'), href: '#' },
    ],
};
