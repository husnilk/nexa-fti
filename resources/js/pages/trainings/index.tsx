import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X, Download } from 'lucide-react';
import { useState } from 'react';
import TrainingController from '@/actions/App/Http/Controllers/Hr/TrainingController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import {
    index as trainingsIndex,
    create as trainingCreate,
    edit as trainingEdit,
    show as trainingShow,
} from '@/routes/trainings';
import type { Auth } from '@/types';

interface Employee {
    id: string;
    name: string;
}

interface Training {
    id: string;
    title: string;
    description?: string;
    provider: string;
    location?: string;
    start_date: string;
    end_date: string;
    hours?: number;
    certificate_file?: string;
    employees?: Employee[];
}

interface PageProps {
    auth: Auth;
    trainings: Training[];
    [key: string]: any;
}

const shortDateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function TrainingsIndex({ trainings = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingTraining, setDeletingTraining] = useState<Training | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTrainings = trainings.filter(
        (tr) =>
            tr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const mayCreate = can(auth, 'training.manage');
    const mayUpdate = can(auth, 'training.manage');
    const mayDelete = can(auth, 'training.manage');

    function destroyTraining(): void {
        if (!deletingTraining) {
            return;
        }

        router.delete(TrainingController.destroy.url(deletingTraining.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingTraining(null),
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Employee Trainings')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Employee Trainings')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage all university employee trainings, venues, certificates, and participants.',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {mayCreate && (
                        <Link href={trainingCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                                <Plus className="h-4 w-4" />{' '}
                                {__('Add Training')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search trainings...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">
                                    {__('Training Title')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Provider & Location')}
                                </th>
                                <th className="px-6 py-4">{__('Period')}</th>
                                <th className="px-6 py-4 text-center">
                                    {__('Hours')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Participants')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Cert.')}
                                </th>
                                <th className="w-[150px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {filteredTrainings.length > 0 ? (
                                filteredTrainings.map((tr) => (
                                    <tr
                                        key={tr.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {tr.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                                    {tr.provider}
                                                </span>
                                                {tr.location && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {tr.location}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            <div className="flex flex-col text-xs">
                                                <span>
                                                    {tr.start_date
                                                        ? shortDateFormatter.format(
                                                              new Date(
                                                                  tr.start_date,
                                                              ),
                                                          )
                                                        : '-'}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {__('to :date', {
                                                        date: tr.end_date
                                                            ? shortDateFormatter.format(
                                                                  new Date(
                                                                      tr.end_date,
                                                                  ),
                                                              )
                                                            : '-',
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-zinc-700 dark:text-zinc-300">
                                            {tr.hours || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {tr.employees &&
                                                tr.employees.length > 0 ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[10px]"
                                                    >
                                                        {__(
                                                            ':count Participants',
                                                            {
                                                                count: tr
                                                                    .employees
                                                                    .length,
                                                            },
                                                        )}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        {__('None')}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {tr.certificate_file ? (
                                                <a
                                                    href={`/storage/${tr.certificate_file}`}
                                                    target="_blank"
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <Download className="mx-auto h-4 w-4" />
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={trainingShow.url(
                                                        tr.id,
                                                    )}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__(
                                                            'View Detail',
                                                        )}
                                                        className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayUpdate && (
                                                    <Link
                                                        href={trainingEdit.url(
                                                            tr.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={__('Edit')}
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Delete')}
                                                        onClick={() =>
                                                            setDeletingTraining(
                                                                tr,
                                                            )
                                                        }
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No trainings found matching the filters.',
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={deletingTraining !== null}
                onOpenChange={(open) => !open && setDeletingTraining(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Training')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__(
                            'Are you sure you want to delete training session ":title"? This action cannot be undone.',
                            { title: deletingTraining?.title },
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingTraining(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyTraining}
                            className="cursor-pointer"
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

TrainingsIndex.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        { title: __('Trainings'), href: trainingsIndex() },
    ],
};
