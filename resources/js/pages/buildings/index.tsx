import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, X, Save, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import BuildingController from '@/actions/App/Http/Controllers/BuildingController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { __ } from '@/lib/i18n';
import { index as buildingsIndex } from '@/routes/buildings';
import { index as roomsIndex } from '@/routes/rooms';
import type { Auth } from '@/types';

type Building = {
    id: string;
    name: string;
    code: string;
    description: string;
    created_at: string;
};

type PageProps = {
    auth: Auth;
    buildings: Building[];
    filters: {
        search?: string;
    };
    [key: string]: any;
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function BuildingsIndex({ buildings = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingBuilding, setDeletingBuilding] = useState<Building | null>(
        null,
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    const {
        data: createData,
        setData: setCreateData,
        post: postCreate,
        processing: creating,
        errors: createErrors,
        reset: resetCreate,
    } = useForm({
        name: '',
        code: '',
        description: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: updating,
        errors: editErrors,
        reset: resetEdit,
        clearErrors: clearEditErrors,
    } = useForm({
        name: '',
        code: '',
        description: '',
    });

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                buildingsIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (editingBuilding) {
            setEditData({
                name: editingBuilding.name,
                code: editingBuilding.code,
                description: editingBuilding.description || '',
            });
            clearEditErrors();
        }
    }, [editingBuilding]);

    const mayCreate = can(auth, 'building.manage');
    const mayUpdate = can(auth, 'building.manage');
    const mayDelete = can(auth, 'building.manage');

    function submitCreate(e: FormEvent) {
        e.preventDefault();
        postCreate(BuildingController.store.url(), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            },
        });
    }

    function submitEdit(e: FormEvent) {
        e.preventDefault();

        if (!editingBuilding) {
            return;
        }

        putEdit(BuildingController.update.url(editingBuilding.id), {
            onSuccess: () => {
                setEditingBuilding(null);
                resetEdit();
            },
        });
    }

    function destroyBuilding(): void {
        if (!deletingBuilding) {
            return;
        }

        router.delete(BuildingController.destroy.url(deletingBuilding.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingBuilding(null),
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Buildings')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Buildings')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage all university buildings, campuses, structural locations, and departments.',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={roomsIndex()}>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" /> {__('Rooms')}
                        </Button>
                    </Link>
                    {mayCreate && (
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                        >
                            <Plus className="h-4 w-4" /> {__('Add Building')}
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search buildings...')}
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
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="w-[120px] px-6 py-4">
                                    {__('Code')}
                                </th>
                                <th className="w-[280px] px-6 py-4">
                                    {__('Building Name')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Description')}
                                </th>
                                <th className="px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {buildings.length > 0 ? (
                                buildings.map((building) => (
                                    <tr
                                        key={building.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {building.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {building.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="line-clamp-1 text-zinc-500 dark:text-zinc-400">
                                                {building.description || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {mayUpdate && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Edit')}
                                                        onClick={() =>
                                                            setEditingBuilding(
                                                                building,
                                                            )
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
                                                            setDeletingBuilding(
                                                                building,
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
                                        colSpan={4}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No buildings found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Building Modal */}
            <Dialog
                open={isCreateModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreateModalOpen(false);
                        resetCreate();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Add Building')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">{__('Name')}</Label>
                            <Input
                                id="create-name"
                                value={createData.name}
                                onChange={(e) =>
                                    setCreateData('name', e.target.value)
                                }
                                placeholder={__('e.g. Science Center')}
                                autoFocus
                            />
                            {createErrors.name && (
                                <p className="text-sm text-destructive">
                                    {createErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-code">{__('Code')}</Label>
                            <Input
                                id="create-code"
                                value={createData.code}
                                onChange={(e) =>
                                    setCreateData('code', e.target.value)
                                }
                                placeholder={__('e.g. SC-01')}
                            />
                            {createErrors.code && (
                                <p className="text-sm text-destructive">
                                    {createErrors.code}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-description">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="create-description"
                                value={createData.description}
                                onChange={(e) =>
                                    setCreateData('description', e.target.value)
                                }
                                placeholder={__('Optional description...')}
                                rows={3}
                            />
                            {createErrors.description && (
                                <p className="text-sm text-destructive">
                                    {createErrors.description}
                                </p>
                            )}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="cursor-pointer"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={creating}
                                className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                            >
                                <Save className="h-4 w-4" />{' '}
                                {__('Save Building')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Building Modal */}
            <Dialog
                open={editingBuilding !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingBuilding(null);
                        resetEdit();
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Edit Building')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">{__('Name')}</Label>
                            <Input
                                id="edit-name"
                                value={editData.name}
                                onChange={(e) =>
                                    setEditData('name', e.target.value)
                                }
                                placeholder={__('e.g. Science Center')}
                                autoFocus
                            />
                            {editErrors.name && (
                                <p className="text-sm text-destructive">
                                    {editErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-code">{__('Code')}</Label>
                            <Input
                                id="edit-code"
                                value={editData.code}
                                onChange={(e) =>
                                    setEditData('code', e.target.value)
                                }
                                placeholder={__('e.g. SC-01')}
                            />
                            {editErrors.code && (
                                <p className="text-sm text-destructive">
                                    {editErrors.code}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={editData.description}
                                onChange={(e) =>
                                    setEditData('description', e.target.value)
                                }
                                placeholder={__('Optional description...')}
                                rows={3}
                            />
                            {editErrors.description && (
                                <p className="text-sm text-destructive">
                                    {editErrors.description}
                                </p>
                            )}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingBuilding(null)}
                                className="cursor-pointer"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={updating}
                                className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                            >
                                <Save className="h-4 w-4" />{' '}
                                {__('Update Building')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Building Modal */}
            <Dialog
                open={deletingBuilding !== null}
                onOpenChange={(open) => !open && setDeletingBuilding(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Building')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__(
                            'Are you sure you want to delete :name? This action cannot be undone.',
                            { name: deletingBuilding?.name ?? '' },
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingBuilding(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyBuilding}
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

BuildingsIndex.layout = {
    breadcrumbs: [
        { title: __('Assets'), href: '#' },
        { title: __('Buildings'), href: buildingsIndex() },
    ],
};
