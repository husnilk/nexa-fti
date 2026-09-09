import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Eye, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index, create, show, edit, destroy } from '@/routes/assignment-progresses';
import { index as assignmentsIndex, show as assignmentShow } from '@/routes/assignments';

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
    status: 'in_progress' | 'completed';
    attachment?: string;
    employee_id: string;
    assignment?: Assignment;
    employee?: Employee;
};

type PageProps = {
    assignmentProgresses: AssignmentProgress[];
    filters: {
        assignment_id: string;
    };
};

export default function AssignmentProgressesIndex({ assignmentProgresses = [], filters }: PageProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this progress entry?')) {
            router.delete(destroy.url(id));
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Assignment Progresses" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                    {filters.assignment_id && (
                        <Link href={assignmentShow.url(Number(filters.assignment_id))}>
                            <Button variant="ghost" size="icon" className="cursor-pointer">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Progress Updates
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Track progress for assignments.</p>
                    </div>
                </div>
                <Link href={create.url(filters.assignment_id ? { assignment_id: filters.assignment_id } : undefined)}>
                    <Button className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium shadow-md">
                        <Plus className="h-4 w-4" /> Add Progress
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                {assignmentProgresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Clock className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4 animate-pulse" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No Progress Updates</h3>
                        <p className="text-zinc-500 text-sm mt-1">No progress entries found for this assignment.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <th className="py-4 px-6">Assignment</th>
                                    <th className="py-4 px-6">Description</th>
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                {assignmentProgresses.map((progress) => (
                                    <tr key={progress.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-zinc-800 dark:text-zinc-200">
                                            {progress.assignment?.title ?? `Assignment #${progress.assignment_id}`}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 max-w-xs">
                                            <p className="truncate">{progress.description || <span className="text-zinc-400">—</span>}</p>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 text-xs">
                                            {new Date(progress.progress_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {progress.status === 'completed' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                                                    <CheckCircle2 className="h-3 w-3" /> Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                                                    <Clock className="h-3 w-3" /> In Progress
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={show.url(progress.id)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={edit.url(progress.id)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDelete(progress.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
