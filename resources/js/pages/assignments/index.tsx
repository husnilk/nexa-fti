import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    Eye,
    ClipboardList,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowUpDown,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import { index, create, show, edit, destroy } from '@/routes/assignments';
import type { Auth } from '@/types';

type Employee = {
    id: string;
    name: string;
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
};

type PageProps = {
    auth: Auth;
    assignments: Assignment[];
    filters: {
        search: string;
        status: string;
    };
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

export default function AssignmentsIndex({
    assignments = [],
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const hasRole = (name: string) => auth.roles.includes(name);
    const hasPermission = (module: string) =>
        hasRole('super-admin') ||
        auth.permissions.some(
            (p) => p === module || p.startsWith(`${module}.`),
        );

    const canManage = hasPermission('assignment.manage');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        router.get(
            index.url(),
            {
                search: value,
                status: statusFilter !== 'all' ? statusFilter : '',
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        router.get(
            index.url(),
            { search, status: status !== 'all' ? status : '' },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm(__('Are you sure you want to delete this assignment?'))) {
            router.delete(destroy.url(id));
        }
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Assignments')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:to-violet-400">
                        {__('Assignments')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage and track task assignments across the organization.',
                        )}
                    </p>
                </div>
                {canManage && (
                    <Link href={create.url()}>
                        <Button className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 font-medium text-white shadow-md hover:from-indigo-700 hover:to-violet-700">
                            <Plus className="h-4 w-4" /> {__('New Assignment')}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={handleSearchChange}
                        placeholder={__('Search assignments...')}
                        className="bg-white pl-9 dark:bg-zinc-900"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-500">
                        {__('Status:')}
                    </span>
                    <div className="flex overflow-hidden rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        {[
                            'all',
                            'assigned',
                            'in_progress',
                            'completed',
                            'delegated',
                            'cancelled',
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status)}
                                className={`cursor-pointer px-3 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                                    statusFilter === status
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                                }`}
                            >
                                {status === 'all'
                                    ? __('All')
                                    : statusConfig[status].label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                {assignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ClipboardList className="mb-4 h-16 w-16 animate-pulse text-zinc-300 dark:text-zinc-700" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {__('No Assignments Found')}
                        </h3>
                        <p className="mt-1 max-w-md text-center text-sm text-zinc-500">
                            {__(
                                'No assignments match your current filters. Try adjusting your search or create a new assignment.',
                            )}
                        </p>
                        {canManage && (
                            <Link href={create.url()} className="mt-4">
                                <Button
                                    variant="outline"
                                    className="cursor-pointer gap-2"
                                >
                                    <Plus className="h-4 w-4" />{' '}
                                    {__('Create Assignment')}
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">
                                        {__('Assignment')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {__('Assigned By')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {__('Assigned To')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {__('Due Date')}
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        {__('Priority')}
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        {__('Status')}
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        {__('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {assignments.map((assignment) => {
                                    const status =
                                        statusConfig[assignment.status];
                                    const StatusIcon = status?.icon;

                                    return (
                                        <tr
                                            key={assignment.id}
                                            className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="max-w-xs px-6 py-4">
                                                <div className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {assignment.title}
                                                </div>
                                                {assignment.description && (
                                                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {assignment.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {assignment.assignedByEmployee
                                                    ?.name ??
                                                    assignment.assigned_by}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {assignment.assignedToEmployee
                                                    ?.name ??
                                                    assignment.assigned_to}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
                                                {assignment.due_date ? (
                                                    new Date(
                                                        assignment.due_date,
                                                    ).toLocaleDateString(
                                                        intlLocale(),
                                                        { dateStyle: 'medium' },
                                                    )
                                                ) : (
                                                    <span className="text-zinc-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold capitalize ${priorityConfig[assignment.priority]}`}
                                                >
                                                    {priorityLabels[
                                                        assignment.priority
                                                    ] ?? assignment.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${status?.color}`}
                                                >
                                                    {StatusIcon && (
                                                        <StatusIcon className="h-3 w-3" />
                                                    )}
                                                    {status?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={show.url(
                                                            assignment.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {canManage && (
                                                        <>
                                                            <Link
                                                                href={edit.url(
                                                                    assignment.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        assignment.id,
                                                                    )
                                                                }
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
