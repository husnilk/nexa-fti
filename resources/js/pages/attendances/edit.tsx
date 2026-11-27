import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AttendanceForm from './components/attendance-form';
import { Button } from '@/components/ui/button';
import { __ } from '@/lib/i18n';
import { index as attendanceIndex } from '@/routes/attendances';
import type {
    Attendance,
    AttendanceEmployee,
    AttendancePeriodOption,
} from '@/types/remuneration';

type PageProps = {
    attendance: Attendance;
    employees: AttendanceEmployee[];
    periods: AttendancePeriodOption[];
};

export default function AttendanceEdit({
    attendance,
    employees = [],
    periods = [],
}: PageProps) {
    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head title={__('Edit Monthly Attendance')} />

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
                        {__('Edit Monthly Attendance')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Update the attendance recap for this employee and month.',
                        )}
                    </p>
                </div>
            </div>

            <AttendanceForm
                attendance={attendance}
                employees={employees}
                periods={periods}
            />
        </div>
    );
}

AttendanceEdit.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Monthly Attendance'), href: attendanceIndex() },
        { title: __('Edit Record'), href: '#' },
    ],
};
