import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/assignments';
import { index } from '@/routes/assignments';

type Employee = {
    id: string;
    name: string;
};

type AssignmentOption = {
    id: number;
    title: string;
};

type Assignment = {
    id: number;
    title: string;
    description?: string;
    assigned_by: string;
    assigned_to: string;
    parent_id?: number;
    start_date?: string;
    due_date?: string;
    status: string;
    priority: string;
};

type PageProps = {
    assignment: Assignment;
    employees: Employee[];
    parentAssignments: AssignmentOption[];
};

export default function AssignmentsEdit({ assignment, employees, parentAssignments }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: assignment.title ?? '',
        description: assignment.description ?? '',
        assigned_by: assignment.assigned_by ?? '',
        assigned_to: assignment.assigned_to ?? '',
        parent_id: assignment.parent_id ? String(assignment.parent_id) : '',
        start_date: assignment.start_date ?? '',
        due_date: assignment.due_date ?? '',
        status: assignment.status ?? 'assigned',
        priority: assignment.priority ?? 'medium',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(assignment.id));
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <Head title="Edit Assignment" />

            <div className="flex items-center gap-3 mb-6">
                <Link href={index.url()}>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Edit Assignment
                    </h1>
                    <p className="text-sm text-muted-foreground">Update task assignment details.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                <div className="space-y-2">
                    <Label htmlFor="title">Title <span className="text-rose-500">*</span></Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Enter assignment title"
                        className={errors.title ? 'border-rose-500' : ''}
                    />
                    {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        placeholder="Enter assignment description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700"
                    />
                    {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="assigned_by">Assigned By <span className="text-rose-500">*</span></Label>
                        <select
                            id="assigned_by"
                            value={data.assigned_by}
                            onChange={(e) => setData('assigned_by', e.target.value)}
                            className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700 ${errors.assigned_by ? 'border-rose-500' : ''}`}
                        >
                            <option value="">Select employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                        {errors.assigned_by && <p className="text-xs text-rose-500">{errors.assigned_by}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assigned_to">Assigned To <span className="text-rose-500">*</span></Label>
                        <select
                            id="assigned_to"
                            value={data.assigned_to}
                            onChange={(e) => setData('assigned_to', e.target.value)}
                            className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700 ${errors.assigned_to ? 'border-rose-500' : ''}`}
                        >
                            <option value="">Select employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                        {errors.assigned_to && <p className="text-xs text-rose-500">{errors.assigned_to}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status <span className="text-rose-500">*</span></Label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700"
                        >
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="delegated">Delegated</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority <span className="text-rose-500">*</span></Label>
                        <select
                            id="priority"
                            value={data.priority}
                            onChange={(e) => setData('priority', e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        {errors.priority && <p className="text-xs text-rose-500">{errors.priority}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                            id="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                        {errors.start_date && <p className="text-xs text-rose-500">{errors.start_date}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                        />
                        {errors.due_date && <p className="text-xs text-rose-500">{errors.due_date}</p>}
                    </div>
                </div>

                {parentAssignments.length > 0 && (
                    <div className="space-y-2">
                        <Label htmlFor="parent_id">Parent Assignment</Label>
                        <select
                            id="parent_id"
                            value={data.parent_id}
                            onChange={(e) => setData('parent_id', e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700"
                        >
                            <option value="">None (top-level task)</option>
                            {parentAssignments.map((a) => (
                                <option key={a.id} value={a.id}>{a.title}</option>
                            ))}
                        </select>
                        {errors.parent_id && <p className="text-xs text-rose-500">{errors.parent_id}</p>}
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2 border-t dark:border-zinc-800">
                    <Link href={index.url()}>
                        <Button variant="outline" type="button" className="cursor-pointer">Cancel</Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                    >
                        <Save className="h-4 w-4" />
                        {processing ? 'Saving...' : 'Update Assignment'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
