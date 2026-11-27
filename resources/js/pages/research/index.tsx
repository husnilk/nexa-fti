import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    Eye,
    X,
    Microscope,
    Calendar,
    DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import {
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/Academic/ResearchController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { __, intlLocale } from '@/lib/i18n';
import type { Auth, Research, ResearchStatus, User } from '@/types';

interface PageProps {
    auth: Auth;
    research: Research[];
    users: User[];
}

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

const STATUS_LABELS: Record<string, string> = {
    proposed: __('Proposed'),
    ongoing: __('Ongoing'),
    completed: __('Completed'),
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
        return '-';
    }

    return new Date(dateString).toLocaleDateString(intlLocale(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) {
        return '-';
    }

    return new Intl.NumberFormat(intlLocale(), {
        style: 'currency',
        currency: 'USD',
    }).format(Number(amount));
};

export default function ResearchIndex({ research = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState(false);
    const [editingResearch, setEditingResearch] = useState<Research | null>(
        null,
    );
    const [deletingResearch, setDeletingResearch] = useState<Research | null>(
        null,
    );
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const createForm = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        funding_source: '',
        budget: '',
        status: 'proposed' as ResearchStatus,
    });

    const editForm = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        funding_source: '',
        budget: '',
        status: 'proposed' as ResearchStatus,
    });

    const mayCreate = can(auth, 'research.manage');
    const mayUpdate = can(auth, 'research.manage');
    const mayDelete = can(auth, 'research.manage');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store.url(), {
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingResearch) {
            return;
        }

        editForm.patch(update.url(editingResearch.id), {
            onSuccess: () => {
                setEditingResearch(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingResearch) {
            return;
        }

        router.delete(destroy.url(deletingResearch.id), {
            onSuccess: () => setDeletingResearch(null),
        });
    };

    const openEdit = (res: Research) => {
        setEditingResearch(res);
        editForm.setData({
            title: res.title,
            description: res.description || '',
            start_date: res.start_date,
            end_date: res.end_date || '',
            funding_source: res.funding_source || '',
            budget: res.budget?.toString() || '',
            status: res.status,
        });
    };

    const filteredResearch = research.filter((res) => {
        const matchesSearch =
            res.title.toLowerCase().includes(search.toLowerCase()) ||
            (res.funding_source &&
                res.funding_source
                    .toLowerCase()
                    .includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === 'all' || res.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Research')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        <Microscope className="h-8 w-8 text-primary" />{' '}
                        {__('Research Projects')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage academic research projects, funding, budget resources, and active members.',
                        )}
                    </p>
                </div>
                {mayCreate && (
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" /> {__('Add Research')}
                    </Button>
                )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search research...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Statuses')}</option>
                        <option value="proposed">{__('Proposed')}</option>
                        <option value="ongoing">{__('Ongoing')}</option>
                        <option value="completed">{__('Completed')}</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Title')}</th>
                                <th className="w-[160px] px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="w-[220px] px-6 py-4">
                                    {__('Timeline')}
                                </th>
                                <th className="w-[180px] px-6 py-4">
                                    {__('Funding & Budget')}
                                </th>
                                <th className="w-[150px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {filteredResearch.length > 0 ? (
                                filteredResearch.map((res) => (
                                    <tr
                                        key={res.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td
                                            className="max-w-xs truncate px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50"
                                            title={res.title}
                                        >
                                            {res.title}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${res.status === 'proposed' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-400' : ''} ${res.status === 'ongoing' ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${res.status === 'completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} `}
                                            >
                                                {STATUS_LABELS[res.status] ??
                                                    res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />{' '}
                                                    {__('Start: :date', {
                                                        date: formatDate(
                                                            res.start_date,
                                                        ),
                                                    })}
                                                </span>
                                                {res.end_date && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />{' '}
                                                        {__('End: :date', {
                                                            date: formatDate(
                                                                res.end_date,
                                                            ),
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                                                    <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
                                                    {formatCurrency(res.budget)}
                                                </span>
                                                {res.funding_source && (
                                                    <span
                                                        className="max-w-[150px] truncate text-xs text-muted-foreground"
                                                        title={
                                                            res.funding_source
                                                        }
                                                    >
                                                        {res.funding_source}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/research/${res.id}`}
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Edit')}
                                                        onClick={() =>
                                                            openEdit(res)
                                                        }
                                                        className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Delete')}
                                                        onClick={() =>
                                                            setDeletingResearch(
                                                                res,
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
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No research projects found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{__('Add New Research')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Enter the details of the new research project.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">{__('Title')}</Label>
                                <Input
                                    id="title"
                                    value={createForm.data.title}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.title && (
                                    <p className="text-sm font-medium text-destructive">
                                        {createForm.errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">
                                    {__('Description')}
                                </Label>
                                <Input
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">
                                        {__('Start Date')}
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={createForm.data.start_date}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">
                                        {__('End Date')}
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={createForm.data.end_date}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'end_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="funding_source">
                                        {__('Funding Source')}
                                    </Label>
                                    <Input
                                        id="funding_source"
                                        value={createForm.data.funding_source}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'funding_source',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="budget">
                                        {__('Budget')}
                                    </Label>
                                    <Input
                                        id="budget"
                                        type="number"
                                        step="0.01"
                                        value={createForm.data.budget}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'budget',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">{__('Status')}</Label>
                                <Select
                                    value={createForm.data.status}
                                    onValueChange={(val) =>
                                        createForm.setData(
                                            'status',
                                            val as ResearchStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="proposed">
                                            {__('Proposed')}
                                        </SelectItem>
                                        <SelectItem value="ongoing">
                                            {__('Ongoing')}
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            {__('Completed')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                                className="cursor-pointer"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                className="cursor-pointer"
                            >
                                {__('Save')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingResearch}
                onOpenChange={() => setEditingResearch(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{__('Edit Research')}</DialogTitle>
                        <DialogDescription>
                            {__('Update the research project details.')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">
                                    {__('Title')}
                                </Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">
                                    {__('Description')}
                                </Label>
                                <Input
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-start_date">
                                        {__('Start Date')}
                                    </Label>
                                    <Input
                                        id="edit-start_date"
                                        type="date"
                                        value={editForm.data.start_date}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-end_date">
                                        {__('End Date')}
                                    </Label>
                                    <Input
                                        id="edit-end_date"
                                        type="date"
                                        value={editForm.data.end_date}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'end_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-funding_source">
                                        {__('Funding Source')}
                                    </Label>
                                    <Input
                                        id="edit-funding_source"
                                        value={editForm.data.funding_source}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'funding_source',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-budget">
                                        {__('Budget')}
                                    </Label>
                                    <Input
                                        id="edit-budget"
                                        type="number"
                                        step="0.01"
                                        value={editForm.data.budget}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'budget',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">
                                    {__('Status')}
                                </Label>
                                <Select
                                    value={editForm.data.status}
                                    onValueChange={(val) =>
                                        editForm.setData(
                                            'status',
                                            val as ResearchStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="proposed">
                                            {__('Proposed')}
                                        </SelectItem>
                                        <SelectItem value="ongoing">
                                            {__('Ongoing')}
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            {__('Completed')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingResearch(null)}
                                className="cursor-pointer"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="cursor-pointer"
                            >
                                {__('Update')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingResearch}
                onOpenChange={() => setDeletingResearch(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Research')}</DialogTitle>
                        <DialogDescription>
                            {__('Are you sure you want to delete')} "
                            <strong className="text-zinc-950 dark:text-zinc-50">
                                {deletingResearch?.title}
                            </strong>
                            "? {__('This action cannot be undone.')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeletingResearch(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
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

ResearchIndex.layout = {
    breadcrumbs: [{ title: __('Research'), href: '/research' }],
};
