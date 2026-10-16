import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { __ } from '@/lib/i18n';
import { update } from '@/routes/assignment-progresses';
import { index } from '@/routes/assignment-progresses';

type Employee = {
    id: string;
    name: string;
};

type Assignment = {
    id: number;
    title: string;
};

type AssignmentProgress = {
    id: number;
    assignment_id: number;
    description?: string;
    progress_date: string;
    status: string;
    attachment?: string;
    employee_id: string;
    created_by: string;
};

type PageProps = {
    assignmentProgress: AssignmentProgress;
    assignments: Assignment[];
    employees: Employee[];
};

export default function AssignmentProgressesEdit({
    assignmentProgress,
    assignments,
    employees,
}: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        assignment_id: String(assignmentProgress.assignment_id),
        description: assignmentProgress.description ?? '',
        progress_date: assignmentProgress.progress_date ?? '',
        status: assignmentProgress.status ?? 'in_progress',
        employee_id: assignmentProgress.employee_id ?? '',
        created_by: assignmentProgress.created_by ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(assignmentProgress.id));
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <Head title={__('Edit Progress Update')} />

            <div className="mb-6 flex items-center gap-3">
                <Link
                    href={index.url({
                        assignment_id: String(assignmentProgress.assignment_id),
                    })}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {__('Edit Progress Update')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {__('Update the progress entry details.')}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="space-y-2">
                    <Label htmlFor="assignment_id">
                        {__('Assignment')}{' '}
                        <span className="text-rose-500">*</span>
                    </Label>
                    <select
                        id="assignment_id"
                        value={data.assignment_id}
                        onChange={(e) =>
                            setData('assignment_id', e.target.value)
                        }
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-700"
                    >
                        <option value="">{__('Select assignment')}</option>
                        {assignments.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.title}
                            </option>
                        ))}
                    </select>
                    {errors.assignment_id && (
                        <p className="text-xs text-rose-500">
                            {errors.assignment_id}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="employee_id">
                            {__('Employee')}{' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <select
                            id="employee_id"
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-700"
                        >
                            <option value="">{__('Select employee')}</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                        {errors.employee_id && (
                            <p className="text-xs text-rose-500">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="progress_date">
                            {__('Progress Date')}{' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="progress_date"
                            type="date"
                            value={data.progress_date}
                            onChange={(e) =>
                                setData('progress_date', e.target.value)
                            }
                        />
                        {errors.progress_date && (
                            <p className="text-xs text-rose-500">
                                {errors.progress_date}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">
                        {__('Status')} <span className="text-rose-500">*</span>
                    </Label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-700"
                    >
                        <option value="in_progress">{__('In Progress')}</option>
                        <option value="completed">{__('Completed')}</option>
                    </select>
                    {errors.status && (
                        <p className="text-xs text-rose-500">{errors.status}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{__('Description')}</Label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        placeholder={__('Describe the progress made...')}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:border-zinc-700"
                    />
                    {errors.description && (
                        <p className="text-xs text-rose-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-2 dark:border-zinc-800">
                    <Link
                        href={index.url({
                            assignment_id: String(
                                assignmentProgress.assignment_id,
                            ),
                        })}
                    >
                        <Button
                            variant="outline"
                            type="button"
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
                    >
                        <Save className="h-4 w-4" />
                        {processing ? __('Saving...') : __('Update Progress')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
