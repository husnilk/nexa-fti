import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Plus,
    CheckCircle2,
    Clock,
    ClipboardList,
    XCircle,
    ArrowUpDown,
    AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { __, intlLocale } from '@/lib/i18n';
import { store as progressStore } from '@/routes/assignment-progresses';
import { edit, index } from '@/routes/assignments';
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
    status:
        | 'assigned'
        | 'in_progress'
        | 'completed'
        | 'delegated'
        | 'cancelled';
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

const statusConfig: Record<
    string,
    {
        label: string;
        color: string;
        icon: React.ComponentType<{ className?: string }>;
    }
> = {
    assigned: {
        label: __('Assigned'),
        color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
        icon: ClipboardList,
    },
    in_progress: {
        label: __('In Progress'),
        color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
        icon: Clock,
    },
    completed: {
        label: __('Completed'),
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
        icon: CheckCircle2,
    },
    delegated: {
        label: __('Delegated'),
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
        icon: ArrowUpDown,
    },
    cancelled: {
        label: __('Cancelled'),
        color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
        icon: XCircle,
    },
};

const priorityLabels: Record<string, string> = {
    low: __('Low'),
    medium: __('Medium'),
    high: __('High'),
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
        auth.permissions.some(
            (p) => p === module || p.startsWith(`${module}.`),
        );

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
        if (confirm(__('Are you sure you want to cancel this assignment?'))) {
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
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head
                title={__('Assignment: :title', { title: assignment.title })}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Link href={index.url()}>
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
                            {assignment.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {__('Assignment Details')}
                        </p>
                    </div>
                </div>

                {canManage && (
                    <div className="flex gap-2">
                        {assignment.status !== 'cancelled' &&
                            assignment.status !== 'completed' && (
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="cursor-pointer gap-2 border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                                >
                                    <XCircle className="h-4 w-4" />{' '}
                                    {__('Cancel')}
                                </Button>
                            )}
                        <Link href={edit.url(assignment.id)}>
                            <Button
                                variant="outline"
                                className="cursor-pointer gap-2"
                            >
                                <Pencil className="h-4 w-4" /> {__('Edit')}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main details */}
                <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${status?.color}`}
                            >
                                <StatusIcon className="h-4 w-4" />
                                {status?.label}
                            </span>
                            <span
                                className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold capitalize ${priorityConfig[assignment.priority]}`}
                            >
                                {__(':priority Priority', {
                                    priority:
                                        priorityLabels[assignment.priority] ??
                                        assignment.priority,
                                })}
                            </span>
                        </div>

                        {assignment.description && (
                            <div className="mb-4">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                    {assignment.description}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm dark:border-zinc-800">
                            <div>
                                <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    {__('Assigned By')}
                                </p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {assignment.assignedByEmployee?.name ??
                                        assignment.assigned_by}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    {__('Assigned To')}
                                </p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {assignment.assignedToEmployee?.name ??
                                        assignment.assigned_to}
                                </p>
                            </div>
                            {assignment.start_date && (
                                <div>
                                    <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        {__('Start Date')}
                                    </p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {new Date(
                                            assignment.start_date,
                                        ).toLocaleDateString(intlLocale(), {
                                            dateStyle: 'medium',
                                        })}
                                    </p>
                                </div>
                            )}
                            {assignment.due_date && (
                                <div>
                                    <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        {__('Due Date')}
                                    </p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {new Date(
                                            assignment.due_date,
                                        ).toLocaleDateString(intlLocale(), {
                                            dateStyle: 'medium',
                                        })}
                                    </p>
                                </div>
                            )}
                            {assignment.parent && (
                                <div className="col-span-2">
                                    <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        {__('Parent Assignment')}
                                    </p>
                                    <p className="font-medium text-indigo-600 dark:text-indigo-400">
                                        {assignment.parent.title}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress section */}
                    <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                                {__('Progress Updates')}
                            </h2>
                            {assignment.status !== 'cancelled' && (
                                <Button
                                    onClick={() =>
                                        setShowProgressForm(!showProgressForm)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer gap-1.5"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    {__('Add Update')}
                                </Button>
                            )}
                        </div>

                        {showProgressForm && (
                            <form
                                onSubmit={handleProgressSubmit}
                                className="mb-4 space-y-3 rounded-xl border bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
                            >
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="progress_date"
                                        className="text-xs"
                                    >
                                        {__('Progress Date')}
                                    </Label>
                                    <Input
                                        id="progress_date"
                                        type="date"
                                        value={progressForm.data.progress_date}
                                        onChange={(e) =>
                                            progressForm.setData(
                                                'progress_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="progress_status"
                                        className="text-xs"
                                    >
                                        {__('Status')}
                                    </Label>
                                    <select
                                        id="progress_status"
                                        value={progressForm.data.status}
                                        onChange={(e) =>
                                            progressForm.setData(
                                                'status',
                                                e.target.value,
                                            )
                                        }
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-700"
                                    >
                                        <option value="in_progress">
                                            {__('In Progress')}
                                        </option>
                                        <option value="completed">
                                            {__('Completed')}
                                        </option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="progress_description"
                                        className="text-xs"
                                    >
                                        {__('Description')}
                                    </Label>
                                    <textarea
                                        id="progress_description"
                                        value={progressForm.data.description}
                                        onChange={(e) =>
                                            progressForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        rows={2}
                                        placeholder={__(
                                            'Describe the progress...',
                                        )}
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:border-zinc-700"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setShowProgressForm(false)
                                        }
                                        className="cursor-pointer"
                                    >
                                        {__('Cancel')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={progressForm.processing}
                                        className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        {progressForm.processing
                                            ? __('Saving...')
                                            : __('Save Update')}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {assignment.progresses.length === 0 ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <Clock className="mb-2 h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                                <p className="text-sm text-muted-foreground">
                                    {__('No progress updates yet.')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignment.progresses.map((progress) => (
                                    <div
                                        key={progress.id}
                                        className="flex gap-3 rounded-lg border p-3 dark:border-zinc-800"
                                    >
                                        <div className="mt-0.5">
                                            {progress.status === 'completed' ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-amber-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-medium capitalize">
                                                    {progress.status ===
                                                    'completed'
                                                        ? __('Completed')
                                                        : __('In Progress')}
                                                </span>
                                                <span>
                                                    {new Date(
                                                        progress.progress_date,
                                                    ).toLocaleDateString(
                                                        intlLocale(),
                                                        { dateStyle: 'medium' },
                                                    )}
                                                </span>
                                            </div>
                                            {progress.description && (
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                    {progress.description}
                                                </p>
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
                    <div className="rounded-2xl border bg-white p-5 text-sm shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            {__('Quick Actions')}
                        </h3>
                        <div className="space-y-2">
                            <Link
                                href={edit.url(assignment.id)}
                                className="block"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer justify-start gap-2"
                                >
                                    <Pencil className="h-4 w-4" />{' '}
                                    {__('Edit Assignment')}
                                </Button>
                            </Link>
                            {canManage &&
                                assignment.status !== 'cancelled' &&
                                assignment.status !== 'completed' && (
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="w-full cursor-pointer justify-start gap-2 border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                                    >
                                        <XCircle className="h-4 w-4" />{' '}
                                        {__('Cancel Assignment')}
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
