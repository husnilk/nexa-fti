import { Head, Link, router } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Trash2,
    Eye,
    Clock,
    CheckCircle2,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { __, intlLocale } from '@/lib/i18n';
import { create, show, edit, destroy } from '@/routes/assignment-progresses';
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
    assignmentProgresses: AssignmentProgress[];
    filters: {
        assignment_id: string;
    };
};

export default function AssignmentProgressesIndex({
    assignmentProgresses = [],
    filters,
}: PageProps) {
    const handleDelete = (id: number) => {
        if (
            confirm(__('Are you sure you want to delete this progress entry?'))
        ) {
            router.delete(destroy.url(id));
        }
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Assignment Progresses')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    {filters.assignment_id && (
                        <Link
                            href={assignmentShow.url(
                                Number(filters.assignment_id),
                            )}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {__('Progress Updates')}
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {__('Track progress for assignments.')}
                        </p>
                    </div>
                </div>
                <Link
                    href={create.url(
                        filters.assignment_id
                            ? { assignment_id: filters.assignment_id }
                            : undefined,
                    )}
                >
                    <Button className="cursor-pointer gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 font-medium text-white shadow-md hover:from-indigo-700 hover:to-violet-700">
                        <Plus className="h-4 w-4" /> {__('Add Progress')}
                    </Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                {assignmentProgresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Clock className="mb-4 h-16 w-16 animate-pulse text-zinc-300 dark:text-zinc-700" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {__('No Progress Updates')}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                            {__(
                                'No progress entries found for this assignment.',
                            )}
                        </p>
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
                                        {__('Description')}
                                    </th>
                                    <th className="px-6 py-4">{__('Date')}</th>
                                    <th className="px-6 py-4 text-center">
                                        {__('Status')}
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        {__('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {assignmentProgresses.map((progress) => (
                                    <tr
                                        key={progress.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4 font-medium text-zinc-800 dark:text-zinc-200">
                                            {progress.assignment?.title ??
                                                __('Assignment #:id', {
                                                    id: progress.assignment_id,
                                                })}
                                        </td>
                                        <td className="max-w-xs px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            <p className="truncate">
                                                {progress.description || (
                                                    <span className="text-zinc-400">
                                                        —
                                                    </span>
                                                )}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
                                            {new Date(
                                                progress.progress_date,
                                            ).toLocaleDateString(intlLocale(), {
                                                dateStyle: 'medium',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {progress.status === 'completed' ? (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    <CheckCircle2 className="h-3 w-3" />{' '}
                                                    {__('Completed')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                                                    <Clock className="h-3 w-3" />{' '}
                                                    {__('In Progress')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={show.url(progress.id)}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={edit.url(progress.id)}
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
                                                            progress.id,
                                                        )
                                                    }
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
