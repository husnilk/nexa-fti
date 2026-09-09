import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, CheckCircle2, Clock, ClipboardList, XCircle, ArrowUpDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as progressStore } from '@/routes/assignment-progresses';
import { edit, destroy, index } from '@/routes/assignments';
import type { Auth } from '@/types';

type Employee = {
    id: string;
    name: string;
};

type Progress = {
    id: number;
    description?: string;
    progress_date: string;
    status: 'in_progress' | 'completed';
    attachment?: string;
    employee_id: string;
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
    status: 'assigned' | 'in_progress' | 'completed' | 'delegated' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    assignedByEmployee?: Employee;
    assignedToEmployee?: Employee;
    parent?: { id: number; title: string };
    progresses: Progress[];
};

type PageProps = {
    auth: Auth;
    assignment: Assignment;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    assigned: { label: 'Assigned', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800', icon: ClipboardList },
    in_progress: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800', icon: Clock },
    completed: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800', icon: CheckCircle2 },
    delegated: { label: 'Delegated', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800', icon: ArrowUpDown },
    cancelled: { label: 'Cancelled', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800', icon: XCircle },
};

const priorityConfig: Record<string, string> = {
    low: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    high: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
};

export default function AssignmentsShow({ assignment }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [showProgressForm, setShowProgressForm] = useState(false);

    const hasRole = (name: string) => auth.roles.includes(name);
    const hasPermission = (module: string) =>
        hasRole('super-admin') ||
        auth.permissions.some((p) => p === module || p.startsWith(`${module}.`));

    const canManage = hasPermission('assignment.manage');

    const status = statusConfig[assignment.status];
    const StatusIcon = status?.icon ?? AlertCircle;

    const progressForm = useForm({
        assignment_id: assignment.id,
        description: '',
        progress_date: new Date().toISOString().split('T')[0],
        status: 'in_progress',
        employee_id: assignment.assigned_to,
        created_by: assignment.assigned_to,
    });

    const handleProgressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        progressForm.post(progressStore.url(), {
            onSuccess: () => {
                setShowProgressForm(false);
                progressForm.reset('description');
            },
        });
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this assignment?')) {
            router.put(edit.url(assignment.id), {
                title: assignment.title,
                description: assignment.description ?? '',
                assigned_by: assignment.assigned_by,
                assigned_to: assignment.assigned_to,
                start_date: assignment.start_date ?? '',
                due_date: assignment.due_date ?? '',
                status: 'cancelled',
                priority: assignment.priority,
            });
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
            <Head title={`Assignment: ${assignment.title}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href={index.url()}>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {assignment.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">Assignment Details</p>
                    </div>
                </div>

                {canManage && (
                    <div className="flex gap-2">
                        {assignment.status !== 'cancelled' && assignment.status !== 'completed' && (
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="cursor-pointer border-rose-500/30 text-rose-600 hover:bg-rose-500/10 gap-2"
                            >
                                <XCircle className="h-4 w-4" /> Cancel
                            </Button>
                        )}
                        <Link href={edit.url(assignment.id)}>
                            <Button variant="outline" className="cursor-pointer gap-2">
                                <Pencil className="h-4 w-4" /> Edit
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main details */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${status?.color}`}>
                                <StatusIcon className="h-4 w-4" />
                                {status?.label}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold capitalize ${priorityConfig[assignment.priority]}`}>
                                {assignment.priority} Priority
                            </span>
                        </div>

                        {assignment.description && (
                            <div className="mb-4">
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {assignment.description}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4 dark:border-zinc-800">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Assigned By</p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {assignment.assignedByEmployee?.name ?? assignment.assigned_by}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Assigned To</p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {assignment.assignedToEmployee?.name ?? assignment.assigned_to}
                                </p>
                            </div>
                            {assignment.start_date && (
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Start Date</p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {new Date(assignment.start_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </p>
                                </div>
                            )}
                            {assignment.due_date && (
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Due Date</p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {new Date(assignment.due_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </p>
                                </div>
                            )}
                            {assignment.parent && (
                                <div className="col-span-2">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Parent Assignment</p>
                                    <p className="font-medium text-indigo-600 dark:text-indigo-400">{assignment.parent.title}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress section */}
                    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Progress Updates</h2>
                            {assignment.status !== 'cancelled' && (
                                <Button
                                    onClick={() => setShowProgressForm(!showProgressForm)}
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer gap-1.5"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Update
                                </Button>
                            )}
                        </div>

                        {showProgressForm && (
                            <form onSubmit={handleProgressSubmit} className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border dark:border-zinc-700 space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="progress_date" className="text-xs">Progress Date</Label>
                                    <Input
                                        id="progress_date"
                                        type="date"
                                        value={progressForm.data.progress_date}
                                        onChange={(e) => progressForm.setData('progress_date', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="progress_status" className="text-xs">Status</Label>
                                    <select
                                        id="progress_status"
                                        value={progressForm.data.status}
                                        onChange={(e) => progressForm.setData('status', e.target.value)}
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-700"
                                    >
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="progress_description" className="text-xs">Description</Label>
                                    <textarea
                                        id="progress_description"
                                        value={progressForm.data.description}
                                        onChange={(e) => progressForm.setData('description', e.target.value)}
                                        rows={2}
                                        placeholder="Describe the progress..."
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:border-zinc-700"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowProgressForm(false)} className="cursor-pointer">Cancel</Button>
                                    <Button type="submit" size="sm" disabled={progressForm.processing} className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white">
                                        {progressForm.processing ? 'Saving...' : 'Save Update'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {assignment.progresses.length === 0 ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <Clock className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" />
                                <p className="text-sm text-muted-foreground">No progress updates yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignment.progresses.map((progress) => (
                                    <div key={progress.id} className="flex gap-3 p-3 rounded-lg border dark:border-zinc-800">
                                        <div className="mt-0.5">
                                            {progress.status === 'completed'
                                                ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                : <Clock className="h-4 w-4 text-amber-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                <span className="capitalize font-medium">{progress.status.replace('_', ' ')}</span>
                                                <span>{new Date(progress.progress_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                            </div>
                                            {progress.description && (
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300">{progress.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar meta */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-5 shadow-xs text-sm">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href={edit.url(assignment.id)} className="block">
                                <Button variant="outline" className="w-full cursor-pointer justify-start gap-2">
                                    <Pencil className="h-4 w-4" /> Edit Assignment
                                </Button>
                            </Link>
                            {canManage && assignment.status !== 'cancelled' && assignment.status !== 'completed' && (
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="w-full cursor-pointer justify-start gap-2 border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                                >
                                    <XCircle className="h-4 w-4" /> Cancel Assignment
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
