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
import { __, intlLocale } from '@/lib/i18n';
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

const statusLabels: Record<CommunityServiceStatus, string> = {
    proposed: __('Proposed'),
    ongoing: __('Ongoing'),
    completed: __('Completed'),
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
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

        const matchesStatus =
            statusFilter === 'all' || svc.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Community Service')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Community Service')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage community service projects and member assignments.',
                        )}
                    </p>
                </div>
                {mayCreate && (
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" /> {__('Add Project')}
                    </Button>
                )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search projects...')}
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
                                <th className="px-6 py-4">{__('Location')}</th>
                                <th className="px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Start Date')}
                                </th>
                                <th className="w-[150px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {filteredServices.length > 0 ? (
                                filteredServices.map((svc) => (
                                    <tr
                                        key={svc.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {svc.title}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {svc.location}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                variant="outline"
                                                className={`font-semibold capitalize ${statusColors[svc.status]}`}
                                            >
                                                {statusLabels[svc.status] ??
                                                    svc.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {svc.start_date
                                                ? dateFormatter.format(
                                                      new Date(svc.start_date),
                                                  )
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    title={__('View Details')}
                                                    className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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
                                                        onClick={() =>
                                                            openEdit(svc)
                                                        }
                                                        title={__('Edit')}
                                                        className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeletingService(
                                                                svc,
                                                            )
                                                        }
                                                        title={__('Delete')}
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
                                        {__(
                                            'No community service projects found.',
                                        )}
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
                        <DialogTitle>{__('Add New Project')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Enter the details of the new community service project.',
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
                                    <p className="text-sm text-destructive">
                                        {createForm.errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">
                                    {__('Location')}
                                </Label>
                                <Input
                                    id="location"
                                    value={createForm.data.location}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'location',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
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
                                <Label htmlFor="status">{__('Status')}</Label>
                                <Select
                                    value={createForm.data.status}
                                    onValueChange={(val) =>
                                        createForm.setData(
                                            'status',
                                            val as CommunityServiceStatus,
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
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {__('Save')}
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
                        <DialogTitle>{__('Edit Project')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Update the community service project details.',
                            )}
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
                                <Label htmlFor="edit-location">
                                    {__('Location')}
                                </Label>
                                <Input
                                    id="edit-location"
                                    value={editForm.data.location}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'location',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
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
                                            val as CommunityServiceStatus,
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
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingService(null)}
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {__('Update')}
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
                        <DialogTitle>{__('Delete Project')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Are you sure you want to delete ":title"? This action cannot be undone.',
                                { title: deletingService?.title ?? '' },
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingService(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {__('Delete')}
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
            title: __('Community Service'),
            href: serviceIndex(),
        },
    ],
};
