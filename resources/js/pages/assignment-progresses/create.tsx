import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/assignment-progresses';
import { index } from '@/routes/assignment-progresses';
import { show as assignmentShow } from '@/routes/assignments';

type Employee = {
    id: string;
    name: string;
};

type Assignment = {
    id: number;
    title: string;
};

type PageProps = {
    assignments: Assignment[];
    employees: Employee[];
    selected_assignment_id?: number;
};

export default function AssignmentProgressesCreate({ assignments, employees, selected_assignment_id }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        assignment_id: selected_assignment_id ? String(selected_assignment_id) : '',
        description: '',
        progress_date: new Date().toISOString().split('T')[0],
        status: 'in_progress',
        employee_id: '',
        created_by: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Head title="Add Progress Update" />

            <div className="flex items-center gap-3 mb-6">
                <Link href={selected_assignment_id ? assignmentShow.url(selected_assignment_id) : index.url()}>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Add Progress Update
                    </h1>
                    <p className="text-sm text-muted-foreground">Record progress for an assignment.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <div className="space-y-2">
                    <Label htmlFor="assignment_id">Assignment <span className="text-rose-500">*</span></Label>
                    <select
                        id="assignment_id"
                        value={data.assignment_id}
                        onChange={(e) => setData('assignment_id', e.target.value)}
                        className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700 ${errors.assignment_id ? 'border-rose-500' : ''}`}
                    >
                        <option value="">Select assignment</option>
                        {assignments.map((a) => (
                            <option key={a.id} value={a.id}>{a.title}</option>
                        ))}
                    </select>
                    {errors.assignment_id && <p className="text-xs text-rose-500">{errors.assignment_id}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="employee_id">Employee <span className="text-rose-500">*</span></Label>
                        <select
                            id="employee_id"
                            value={data.employee_id}
                            onChange={(e) => {
                                setData('employee_id', e.target.value);
                                setData('created_by', e.target.value);
                            }}
                            className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700 ${errors.employee_id ? 'border-rose-500' : ''}`}
                        >
                            <option value="">Select employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                        {errors.employee_id && <p className="text-xs text-rose-500">{errors.employee_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="progress_date">Progress Date <span className="text-rose-500">*</span></Label>
                        <Input
                            id="progress_date"
                            type="date"
                            value={data.progress_date}
                            onChange={(e) => setData('progress_date', e.target.value)}
                            className={errors.progress_date ? 'border-rose-500' : ''}
                        />
                        {errors.progress_date && <p className="text-xs text-rose-500">{errors.progress_date}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status <span className="text-rose-500">*</span></Label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700"
                    >
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        placeholder="Describe the progress made..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:border-zinc-700"
                    />
                    {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t dark:border-zinc-800">
                    <Link href={selected_assignment_id ? assignmentShow.url(selected_assignment_id) : index.url()}>
                        <Button variant="outline" type="button" className="cursor-pointer">Cancel</Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                    >
                        <Save className="h-4 w-4" />
                        {processing ? 'Saving...' : 'Save Progress'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
