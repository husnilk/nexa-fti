import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Clock, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index, edit, destroy } from '@/routes/assignment-progresses';
import { show as assignmentShow } from '@/routes/assignments';

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
    assignmentProgress: AssignmentProgress;
};

export default function AssignmentProgressesShow({ assignmentProgress }: PageProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this progress entry?')) {
            router.delete(destroy.url(assignmentProgress.id));
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Head title="Progress Update Details" />

            <div className="flex items-center gap-3 mb-6">
                <Link href={index.url({ assignment_id: String(assignmentProgress.assignment_id) })}>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Progress Update
                    </h1>
                    <p className="text-sm text-muted-foreground">Progress entry details.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                    {assignmentProgress.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                            <CheckCircle2 className="h-4 w-4" /> Completed
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                            <Clock className="h-4 w-4" /> In Progress
                        </span>
                    )}
                    <div className="flex gap-2">
                        <Link href={edit.url(assignmentProgress.id)}>
                            <Button variant="outline" size="sm" className="cursor-pointer gap-1.5">
                                <Pencil className="h-3.5 w-3.5" /> Edit
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            size="sm"
                            className="cursor-pointer gap-1.5 border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Assignment</p>
                        {assignmentProgress.assignment ? (
                            <Link href={assignmentShow.url(assignmentProgress.assignment_id)}>
                                <p className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                                    {assignmentProgress.assignment.title}
                                </p>
                            </Link>
                        ) : (
                            <p className="font-medium text-zinc-800 dark:text-zinc-200">#{assignmentProgress.assignment_id}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Employee</p>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                            {assignmentProgress.employee?.name ?? assignmentProgress.employee_id}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Progress Date</p>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                            {new Date(assignmentProgress.progress_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                    </div>
                </div>

                {assignmentProgress.description && (
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Description</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {assignmentProgress.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
