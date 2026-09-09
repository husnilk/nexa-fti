import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import EmployeeAttendanceController from '@/actions/App/Http/Controllers/Hr/EmployeeAttendanceController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index as attendanceIndex } from '@/routes/employee-attendances';

type Employee = {
    id: string;
    name: string;
    emp_number: string;
};

type PageProps = {
    employees: Employee[];
};

export default function AttendanceCreate({ employees = [] }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        check_in: '',
        check_out: '',
        break_in: '',
        break_out: '',
        status: 'present' as
            | 'present'
            | 'absent'
            | 'leave'
            | 'overtime'
            | 'holiday',
        notes: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        // Prepare data for submission
        const submissionData = { ...data };

        // Format date-time if they are provided
        ['check_in', 'check_out', 'break_in', 'break_out'].forEach((field) => {
            if (submissionData[field as keyof typeof submissionData]) {
                submissionData[field as keyof typeof submissionData] =
                    `${data.date} ${submissionData[field as keyof typeof submissionData]}:00`;
            } else {
                submissionData[field as keyof typeof submissionData] = null;
            }
        });

        post(EmployeeAttendanceController.store.url(), {
            data: submissionData as any,
        });
    }

    const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 bg-white dark:bg-zinc-900";

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
            <Head title="Add Attendance Record" />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={attendanceIndex()}>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Add Attendance Record
                    </h1>
                    <p className="text-muted-foreground mt-1">Manually log daily attendance for an employee.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="employee_id">Employee *</Label>
                        <select
                            id="employee_id"
                            value={data.employee_id}
                            onChange={(e) => setData('employee_id', e.target.value)}
                            required
                            className={selectClass}
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.emp_number})
                                </option>
                            ))}
                        </select>
                        {errors.employee_id && <p className="text-sm text-destructive">{errors.employee_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            required
                        />
                        {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status *</Label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as any)}
                            required
                            className={selectClass}
                        >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="leave">Leave</option>
                            <option value="overtime">Overtime</option>
                            <option value="holiday">Holiday</option>
                        </select>
                        {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4 dark:border-zinc-800">
                    <div className="grid gap-2">
                        <Label htmlFor="check_in">Check In Time</Label>
                        <Input
                            id="check_in"
                            type="time"
                            value={data.check_in}
                            onChange={(e) => setData('check_in', e.target.value)}
                            disabled={
                                data.status !== 'present' &&
                                data.status !== 'overtime'
                            }
                        />
                        {errors.check_in && <p className="text-sm text-destructive">{errors.check_in}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="check_out">Check Out Time</Label>
                        <Input
                            id="check_out"
                            type="time"
                            value={data.check_out}
                            onChange={(e) => setData('check_out', e.target.value)}
                            disabled={
                                data.status !== 'present' &&
                                data.status !== 'overtime'
                            }
                        />
                        {errors.check_out && <p className="text-sm text-destructive">{errors.check_out}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4 dark:border-zinc-800">
                    <div className="grid gap-2">
                        <Label htmlFor="break_in">Break Start</Label>
                        <Input
                            id="break_in"
                            type="time"
                            value={data.break_in}
                            onChange={(e) => setData('break_in', e.target.value)}
                            disabled={data.status !== 'present'}
                        />
                        {errors.break_in && <p className="text-sm text-destructive">{errors.break_in}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="break_out">Break End</Label>
                        <Input
                            id="break_out"
                            type="time"
                            value={data.break_out}
                            onChange={(e) => setData('break_out', e.target.value)}
                            disabled={data.status !== 'present'}
                        />
                        {errors.break_out && <p className="text-sm text-destructive">{errors.break_out}</p>}
                    </div>
                </div>

                <div className="grid gap-2 border-t pt-4 dark:border-zinc-800">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        placeholder="Reason for absence, leave details, etc."
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={3}
                    />
                    {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                    <Link href={attendanceIndex()}>
                        <Button type="button" variant="outline" className="cursor-pointer">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing} className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                        <Save className="h-4 w-4" /> Save Attendance
                    </Button>
                </div>
            </form>
        </div>
    );
}

AttendanceCreate.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Attendance', href: attendanceIndex() },
        { title: 'Add Record', href: '#' },
    ],
};
