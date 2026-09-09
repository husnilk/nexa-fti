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
import { index as trainingsIndex, create as trainingCreate, edit as trainingEdit, show as trainingShow } from '@/routes/trainings';
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

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function TrainingsIndex({ trainings = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingTraining, setDeletingTraining] = useState<Training | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTrainings = trainings.filter(
        (tr) =>
            tr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tr.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Employee Trainings" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Employee Trainings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all university employee trainings, venues, certificates, and participants.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {mayCreate && (
                        <Link href={trainingCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                                <Plus className="h-4 w-4" /> Add Training
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search trainings..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Training Title</th>
                                <th className="py-4 px-6">Provider & Location</th>
                                <th className="py-4 px-6">Period</th>
                                <th className="py-4 px-6 text-center">Hours</th>
                                <th className="py-4 px-6">Participants</th>
                                <th className="py-4 px-6 text-center">Cert.</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredTrainings.length > 0 ? (
                                filteredTrainings.map((tr) => (
                                    <tr key={tr.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {tr.title}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                                                    {tr.provider}
                                                </span>
                                                {tr.location && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {tr.location}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                            <div className="flex flex-col text-xs">
                                                <span>{tr.start_date ? shortDateFormatter.format(new Date(tr.start_date)) : '-'}</span>
                                                <span className="text-muted-foreground">to {tr.end_date ? shortDateFormatter.format(new Date(tr.end_date)) : '-'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center text-zinc-700 dark:text-zinc-300">
                                            {tr.hours || '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {tr.employees && tr.employees.length > 0 ? (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        {tr.employees.length} Participants
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">None</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {tr.certificate_file ? (
                                                <a href={`/storage/${tr.certificate_file}`} target="_blank" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                    <Download className="h-4 w-4 mx-auto" />
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={trainingShow.url(tr.id)}>
                                                    <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayUpdate && (
                                                    <Link href={trainingEdit.url(tr.id)}>
                                                        <Button variant="ghost" size="icon" title="Edit" className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Delete"
                                                        onClick={() => setDeletingTraining(tr)}
                                                        className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
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
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No trainings found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={deletingTraining !== null} onOpenChange={(open) => !open && setDeletingTraining(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Training</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete training session "{deletingTraining?.title}"? This action cannot be undone.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setDeletingTraining(null)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroyTraining} className="cursor-pointer">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

TrainingsIndex.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Trainings', href: trainingsIndex() },
    ],
};
