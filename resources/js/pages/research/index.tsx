import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Eye, X, Microscope, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';
import {
    index as researchIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/Academic/ResearchController';
import { Badge } from '@/components/ui/badge';
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
import type { Auth, Research, ResearchStatus, User } from '@/types';

interface PageProps {
    auth: Auth;
    research: Research[];
    users: User[];
}

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
return '-';
}

    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) {
return '-';
}

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(amount));
};

export default function ResearchIndex({ research = [], users = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState(false);
    const [editingResearch, setEditingResearch] = useState<Research | null>(null);
    const [deletingResearch, setDeletingResearch] = useState<Research | null>(null);
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
            (res.funding_source && res.funding_source.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Research" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Microscope className="h-8 w-8 text-primary" /> Research Projects
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage academic research projects, funding, budget resources, and active members.
                    </p>
                </div>
                {mayCreate && (
                    <Button onClick={() => setIsCreating(true)} className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                        <Plus className="h-4 w-4" /> Add Research
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search research..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Statuses</option>
                        <option value="proposed">Proposed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Title</th>
                                <th className="py-4 px-6 w-[160px] text-center">Status</th>
                                <th className="py-4 px-6 w-[220px]">Timeline</th>
                                <th className="py-4 px-6 w-[180px]">Funding & Budget</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredResearch.length > 0 ? (
                                filteredResearch.map((res) => (
                                    <tr key={res.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50 max-w-xs truncate" title={res.title}>
                                            {res.title}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border
                                                ${res.status === 'proposed' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/35 dark:text-amber-400 dark:border-amber-900' : ''}
                                                ${res.status === 'ongoing' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/35 dark:text-indigo-400 dark:border-indigo-900' : ''}
                                                ${res.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/35 dark:text-emerald-400 dark:border-emerald-900' : ''}
                                            `}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Start: {formatDate(res.start_date)}
                                                </span>
                                                {res.end_date && (
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> End: {formatDate(res.end_date)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-0.5">
                                                    <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
                                                    {formatCurrency(res.budget)}
                                                </span>
                                                {res.funding_source && (
                                                    <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={res.funding_source}>
                                                        {res.funding_source}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/research/${res.id}`}>
                                                    <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayUpdate && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Edit"
                                                        onClick={() => openEdit(res)}
                                                        className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Delete"
                                                        onClick={() => setDeletingResearch(res)}
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
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No research projects found.
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
                        <DialogTitle>Add New Research</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new research project.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={createForm.data.title}
                                    onChange={(e) => createForm.setData('title', e.target.value)}
                                    required
                                />
                                {createForm.errors.title && (
                                    <p className="text-sm text-destructive font-medium">{createForm.errors.title}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={createForm.data.start_date}
                                        onChange={(e) => createForm.setData('start_date', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={createForm.data.end_date}
                                        onChange={(e) => createForm.setData('end_date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="funding_source">Funding Source</Label>
                                    <Input
                                        id="funding_source"
                                        value={createForm.data.funding_source}
                                        onChange={(e) => createForm.setData('funding_source', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="budget">Budget</Label>
                                    <Input
                                        id="budget"
                                        type="number"
                                        step="0.01"
                                        value={createForm.data.budget}
                                        onChange={(e) => createForm.setData('budget', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={createForm.data.status}
                                    onValueChange={(val) => createForm.setData('status', val as ResearchStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="proposed">Proposed</SelectItem>
                                        <SelectItem value="ongoing">Ongoing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing} className="cursor-pointer">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingResearch} onOpenChange={() => setEditingResearch(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Research</DialogTitle>
                        <DialogDescription>
                            Update the research project details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(e) => editForm.setData('title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-start_date">Start Date</Label>
                                    <Input
                                        id="edit-start_date"
                                        type="date"
                                        value={editForm.data.start_date}
                                        onChange={(e) => editForm.setData('start_date', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-end_date">End Date</Label>
                                    <Input
                                        id="edit-end_date"
                                        type="date"
                                        value={editForm.data.end_date}
                                        onChange={(e) => editForm.setData('end_date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-funding_source">Funding Source</Label>
                                    <Input
                                        id="edit-funding_source"
                                        value={editForm.data.funding_source}
                                        onChange={(e) => editForm.setData('funding_source', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-budget">Budget</Label>
                                    <Input
                                        id="edit-budget"
                                        type="number"
                                        step="0.01"
                                        value={editForm.data.budget}
                                        onChange={(e) => editForm.setData('budget', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    value={editForm.data.status}
                                    onValueChange={(val) => editForm.setData('status', val as ResearchStatus)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="proposed">Proposed</SelectItem>
                                        <SelectItem value="ongoing">Ongoing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingResearch(null)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing} className="cursor-pointer">
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deletingResearch} onOpenChange={() => setDeletingResearch(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Research</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "<strong className="text-zinc-950 dark:text-zinc-50">{deletingResearch?.title}</strong>"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setDeletingResearch(null)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} className="cursor-pointer">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

ResearchIndex.layout = {
    breadcrumbs: [
        { title: 'Research', href: '/research' },
    ],
};
