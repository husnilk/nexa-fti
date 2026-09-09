import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Eye, ClipboardList, CheckCircle2, Clock, XCircle, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    status: 'assigned' | 'in_progress' | 'completed' | 'delegated' | 'cancelled';
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

export default function AssignmentsIndex({ assignments = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const hasRole = (name: string) => auth.roles.includes(name);
    const hasPermission = (module: string) =>
        hasRole('super-admin') ||
        auth.permissions.some((p) => p === module || p.startsWith(`${module}.`));

    const canManage = hasPermission('assignment.manage');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        router.get(index.url(), { search: value, status: statusFilter !== 'all' ? statusFilter : '' }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        router.get(index.url(), { search, status: status !== 'all' ? status : '' }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this assignment?')) {
            router.delete(destroy.url(id));
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Assignments" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                        Assignments
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage and track task assignments across the organization.</p>
                </div>
                {canManage && (
                    <Link href={create.url()}>
                        <Button className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium shadow-md">
                            <Plus className="h-4 w-4" /> New Assignment
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search assignments..."
                        className="pl-9 bg-white dark:bg-zinc-900"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 font-medium">Status:</span>
                    <div className="flex rounded-lg border dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                        {['all', 'assigned', 'in_progress', 'completed', 'delegated', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status)}
                                className={`px-3 py-2 text-xs font-semibold capitalize transition-all duration-200 cursor-pointer ${
                                    statusFilter === status
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                                }`}
                            >
                                {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                {assignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <ClipboardList className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4 animate-pulse" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No Assignments Found</h3>
                        <p className="text-zinc-500 text-sm mt-1 max-w-md text-center">
                            No assignments match your current filters. Try adjusting your search or create a new assignment.
                        </p>
                        {canManage && (
                            <Link href={create.url()} className="mt-4">
                                <Button variant="outline" className="gap-2 cursor-pointer">
                                    <Plus className="h-4 w-4" /> Create Assignment
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-4 px-6">Assignment</th>
                                    <th className="py-4 px-6">Assigned By</th>
                                    <th className="py-4 px-6">Assigned To</th>
                                    <th className="py-4 px-6">Due Date</th>
                                    <th className="py-4 px-6 text-center">Priority</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                {assignments.map((assignment) => {
                                    const status = statusConfig[assignment.status];
                                    const StatusIcon = status?.icon;

                                    return (
                                        <tr key={assignment.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="py-4 px-6 max-w-xs">
                                                <div className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">{assignment.title}</div>
                                                {assignment.description && (
                                                    <div className="text-xs text-muted-foreground truncate mt-0.5">{assignment.description}</div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                                {assignment.assignedByEmployee?.name ?? assignment.assigned_by}
                                            </td>
                                            <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                                {assignment.assignedToEmployee?.name ?? assignment.assigned_to}
                                            </td>
                                            <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 text-xs">
                                                {assignment.due_date
                                                    ? new Date(assignment.due_date).toLocaleDateString(undefined, { dateStyle: 'medium' })
                                                    : <span className="text-zinc-400">—</span>}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize ${priorityConfig[assignment.priority]}`}>
                                                    {assignment.priority}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${status?.color}`}>
                                                    {StatusIcon && <StatusIcon className="h-3 w-3" />}
                                                    {status?.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={show.url(assignment.id)}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {canManage && (
                                                        <>
                                                            <Link href={edit.url(assignment.id)}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                onClick={() => handleDelete(assignment.id)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300 cursor-pointer"
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
