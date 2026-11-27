import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    attendanceCountFields,
    attendanceFieldGroups,
    monthName,
} from './attendance-fields';
import AttendanceController from '@/actions/App/Http/Controllers/AttendanceController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { __ } from '@/lib/i18n';
import { index as attendanceIndex } from '@/routes/attendances';
import type {
    Attendance,
    AttendanceCountField,
    AttendanceEmployee,
    AttendancePeriodOption,
} from '@/types/remuneration';

type Props = {
    attendance?: Attendance;
    employees: AttendanceEmployee[];
    periods: AttendancePeriodOption[];
};

type FormData = {
    period_id: string;
    employee_id: string;
    year: string;
    month: string;
} & Record<AttendanceCountField, string>;

const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 bg-white dark:bg-zinc-900';

function initialData(attendance?: Attendance): FormData {
    const counts = Object.fromEntries(
        attendanceCountFields.map((field) => [
            field,
            attendance?.[field] != null ? String(attendance[field]) : '0',
        ]),
    ) as Record<AttendanceCountField, string>;

    return {
        period_id: attendance?.period_id ?? '',
        employee_id: attendance?.employee_id ?? '',
        year: attendance
            ? String(attendance.year)
            : String(new Date().getFullYear()),
        month: attendance ? String(attendance.month) : '',
        ...counts,
    };
}

export default function AttendanceForm({
    attendance,
    employees,
    periods,
}: Props) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>(
        initialData(attendance),
    );

    const selectedPeriod = periods.find(
        (period) => period.id === data.period_id,
    );
    const monthOptions =
        selectedPeriod && selectedPeriod.months.length > 0
            ? [...new Set(selectedPeriod.months.map((m) => m.month))].sort(
                  (a, b) => a - b,
              )
            : Array.from({ length: 12 }, (_, i) => i + 1);

    function changePeriod(periodId: string): void {
        const period = periods.find((p) => p.id === periodId);

        setData((current) => ({
            ...current,
            period_id: periodId,
            year: period ? String(period.year) : current.year,
            month: '',
        }));
    }

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();

        if (attendance) {
            put(AttendanceController.update.url(attendance.id));
        } else {
            post(AttendanceController.store.url());
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {__('Employee & Period')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {__('Who and which month this recap covers.')}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="employee_id">{__('Employee *')}</Label>
                        <select
                            id="employee_id"
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            required
                            className={selectClass}
                        >
                            <option value="">{__('Select Employee')}</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.emp_number})
                                </option>
                            ))}
                        </select>
                        {errors.employee_id && (
                            <p className="text-sm text-destructive">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="period_id">{__('Period *')}</Label>
                        <select
                            id="period_id"
                            value={data.period_id}
                            onChange={(e) => changePeriod(e.target.value)}
                            required
                            className={selectClass}
                        >
                            <option value="">{__('Select Period')}</option>
                            {periods.map((period) => (
                                <option key={period.id} value={period.id}>
                                    {period.name}
                                </option>
                            ))}
                        </select>
                        {errors.period_id && (
                            <p className="text-sm text-destructive">
                                {errors.period_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="month">{__('Month *')}</Label>
                        <select
                            id="month"
                            value={data.month}
                            onChange={(e) => setData('month', e.target.value)}
                            required
                            className={selectClass}
                        >
                            <option value="">{__('Select Month')}</option>
                            {monthOptions.map((month) => (
                                <option key={month} value={month}>
                                    {monthName(month)}
                                </option>
                            ))}
                        </select>
                        {errors.month && (
                            <p className="text-sm text-destructive">
                                {errors.month}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="year">{__('Year *')}</Label>
                        <Input
                            id="year"
                            type="number"
                            min={2000}
                            max={2100}
                            value={data.year}
                            onChange={(e) => setData('year', e.target.value)}
                            required
                        />
                        {errors.year && (
                            <p className="text-sm text-destructive">
                                {errors.year}
                            </p>
                        )}
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
                            <div key={field.name} className="grid gap-1.5">
                                <Label htmlFor={field.name}>
                                    {field.label}
                                </Label>
                                <Input
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    max={31}
                                    value={data[field.name]}
                                    onChange={(e) =>
                                        setData(field.name, e.target.value)
                                    }
                                />
                                {field.hint && (
                                    <p className="text-xs text-muted-foreground">
                                        {field.hint}
                                    </p>
                                )}
                                {errors[field.name] && (
                                    <p className="text-sm text-destructive">
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="flex justify-end gap-3">
                <Link href={attendanceIndex()}>
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                    >
                        {__('Cancel')}
                    </Button>
                </Link>
                <Button
                    type="submit"
                    disabled={processing}
                    className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                >
                    <Save className="h-4 w-4" /> {__('Save Attendance')}
                </Button>
            </div>
        </form>
    );
}
