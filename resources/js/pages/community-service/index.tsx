import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import {
    index as serviceIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/Academic/CommunityServiceController';
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
import type { Auth, CommunityService, CommunityServiceStatus } from '@/types';

interface PageProps {
    auth: Auth;
    communityServices: CommunityService[];
}

const statusColors: Record<CommunityServiceStatus, string> = {
    proposed:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400',
    ongoing:
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400',
    completed:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400',
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function CommunityServiceIndex({
    communityServices = [],
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState(false);
    const [editingService, setEditingService] =
        useState<CommunityService | null>(null);
    const [deletingService, setDeletingService] =
        useState<CommunityService | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const createForm = useForm({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        funding_source: '',
        status: 'proposed' as CommunityServiceStatus,
    });

    const editForm = useForm({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        funding_source: '',
        status: 'proposed' as CommunityServiceStatus,
    });

    const mayCreate = can(auth, 'community_service.manage');
    const mayUpdate = can(auth, 'community_service.manage');
    const mayDelete = can(auth, 'community_service.manage');

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

        if (!editingService) {
            return;
        }

        editForm.patch(update.url(editingService.id), {
            onSuccess: () => {
                setEditingService(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingService) {
            return;
        }

        router.delete(destroy.url(deletingService.id), {
            onSuccess: () => setDeletingService(null),
        });
    };

    const openEdit = (svc: CommunityService) => {
        setEditingService(svc);
        editForm.setData({
            title: svc.title,
            description: svc.description || '',
            location: svc.location,
            start_date: svc.start_date,
            end_date: svc.end_date || '',
            funding_source: svc.funding_source || '',
            status: svc.status,
        });
    };

    const filteredServices = communityServices.filter((svc) => {
        const matchesSearch =
            svc.title.toLowerCase().includes(search.toLowerCase()) ||
            svc.location.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || svc.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Community Service" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Community Service
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage community service projects and member assignments.
                    </p>
                </div>
                {mayCreate && (
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md"
                    >
                        <Plus className="h-4 w-4" /> Add Project
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
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
                                <th className="py-4 px-6">Location</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6">Start Date</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredServices.length > 0 ? (
                                filteredServices.map((svc) => (
                                    <tr
                                        key={svc.id}
                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                                    >
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {svc.title}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                            {svc.location}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Badge
                                                variant="outline"
                                                className={`capitalize font-semibold ${statusColors[svc.status]}`}
                                            >
                                                {svc.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                            {svc.start_date ? dateFormatter.format(new Date(svc.start_date)) : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    title="View Details"
                                                    className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                >
                                                    <Link
                                                        href={`/community-services/${svc.id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {mayUpdate && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEdit(svc)}
                                                        title="Edit"
                                                        className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeletingService(svc)}
                                                        title="Delete"
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
                                    <td
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No community service projects found.
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
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new community service project.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={createForm.data.title}
                                    onChange={(e) =>
                                        createForm.setData('title', e.target.value)
                                    }
                                    required
                                />
                                {createForm.errors.title && (
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={createForm.data.location}
                                    onChange={(e) =>
                                        createForm.setData('location', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData('description', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={createForm.data.start_date}
                                        onChange={(e) =>
                                            createForm.setData('start_date', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={createForm.data.end_date}
                                        onChange={(e) =>
                                            createForm.setData('end_date', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="funding_source">Funding Source</Label>
                                <Input
                                    id="funding_source"
                                    value={createForm.data.funding_source}
                                    onChange={(e) =>
                                        createForm.setData('funding_source', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={createForm.data.status}
                                    onValueChange={(val) =>
                                        createForm.setData(
                                            'status',
                                            val as CommunityServiceStatus
                                        )
                                    }
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
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingService}
                onOpenChange={() => setEditingService(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Update the community service project details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(e) =>
                                        editForm.setData('title', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-location">Location</Label>
                                <Input
                                    id="edit-location"
                                    value={editForm.data.location}
                                    onChange={(e) =>
                                        editForm.setData('location', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    value={editForm.data.status}
                                    onValueChange={(val) =>
                                        editForm.setData(
                                            'status',
                                            val as CommunityServiceStatus
                                        )
                                    }
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
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingService(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingService}
                onOpenChange={() => setDeletingService(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingService?.title}"? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingService(null)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

CommunityServiceIndex.layout = {
    breadcrumbs: [
        {
            title: 'Community Service',
            href: serviceIndex(),
        },
    ],
};
