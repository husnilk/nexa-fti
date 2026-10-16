import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Clock, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { __, intlLocale } from '@/lib/i18n';
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

export default function AssignmentProgressesShow({
    assignmentProgress,
}: PageProps) {
    const handleDelete = () => {
        if (
            confirm(__('Are you sure you want to delete this progress entry?'))
        ) {
            router.delete(destroy.url(assignmentProgress.id));
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <Head title={__('Progress Update Details')} />

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
                        {__('Progress Update')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {__('Progress entry details.')}
                    </p>
                </div>
            </div>

            <div className="space-y-5 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                    {assignmentProgress.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />{' '}
                            {__('Completed')}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                            <Clock className="h-4 w-4" /> {__('In Progress')}
                        </span>
                    )}
                    <div className="flex gap-2">
                        <Link href={edit.url(assignmentProgress.id)}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer gap-1.5"
                            >
                                <Pencil className="h-3.5 w-3.5" /> {__('Edit')}
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            size="sm"
                            className="cursor-pointer gap-1.5 border-rose-500/30 text-rose-600 hover:bg-rose-500/10"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> {__('Delete')}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            {__('Assignment')}
                        </p>
                        {assignmentProgress.assignment ? (
                            <Link
                                href={assignmentShow.url(
                                    assignmentProgress.assignment_id,
                                )}
                            >
                                <p className="cursor-pointer font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                                    {assignmentProgress.assignment.title}
                                </p>
                            </Link>
                        ) : (
                            <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                #{assignmentProgress.assignment_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            {__('Employee')}
                        </p>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                            {assignmentProgress.employee?.name ??
                                assignmentProgress.employee_id}
                        </p>
                    </div>
                    <div>
                        <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            {__('Progress Date')}
                        </p>
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                            {new Date(
                                assignmentProgress.progress_date,
                            ).toLocaleDateString(intlLocale(), {
                                dateStyle: 'long',
                            })}
                        </p>
                    </div>
                </div>

                {assignmentProgress.description && (
                    <div>
                        <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            {__('Description')}
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                            {assignmentProgress.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
