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
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

export default function BuildingsIndex({ buildings = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingBuilding, setDeletingBuilding] = useState<Building | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    const { 
        data: createData, 
        setData: setCreateData, 
        post: postCreate, 
        processing: creating, 
        errors: createErrors,
        reset: resetCreate 
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
        clearErrors: clearEditErrors
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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Buildings" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Buildings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all university buildings, campuses, structural locations, and departments.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={roomsIndex()}>
                        <Button variant="outline" className="cursor-pointer gap-2 font-medium">
                            <ArrowLeft className="h-4 w-4" /> Rooms
                        </Button>
                    </Link>
                    {mayCreate && (
                        <Button onClick={() => setIsCreateModalOpen(true)} className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                            <Plus className="h-4 w-4" /> Add Building
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search buildings..."
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
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6 w-[120px]">Code</th>
                                <th className="py-4 px-6 w-[280px]">Building Name</th>
                                <th className="py-4 px-6">Description</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {buildings.length > 0 ? (
                                buildings.map((building) => (
                                    <tr key={building.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                                {building.code}
                                            </code>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {building.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                                {building.description || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {mayUpdate && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        title="Edit"
                                                        onClick={() => setEditingBuilding(building)}
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
                                                        onClick={() => setDeletingBuilding(building)}
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
                                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                        No buildings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Building Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateModalOpen(false);
                    resetCreate();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Building</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
                                value={createData.name}
                                onChange={(e) => setCreateData('name', e.target.value)}
                                placeholder="e.g. Science Center"
                                autoFocus
                            />
                            {createErrors.name && <p className="text-sm text-destructive">{createErrors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-code">Code</Label>
                            <Input
                                id="create-code"
                                value={createData.code}
                                onChange={(e) => setCreateData('code', e.target.value)}
                                placeholder="e.g. SC-01"
                            />
                            {createErrors.code && <p className="text-sm text-destructive">{createErrors.code}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-description">Description</Label>
                            <Textarea
                                id="create-description"
                                value={createData.description}
                                onChange={(e) => setCreateData('description', e.target.value)}
                                placeholder="Optional description..."
                                rows={3}
                            />
                            {createErrors.description && <p className="text-sm text-destructive">{createErrors.description}</p>}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creating} className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                                <Save className="h-4 w-4" /> Save Building
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Building Modal */}
            <Dialog open={editingBuilding !== null} onOpenChange={(open) => {
                if (!open) {
                    setEditingBuilding(null);
                    resetEdit();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Building</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                placeholder="e.g. Science Center"
                                autoFocus
                            />
                            {editErrors.name && <p className="text-sm text-destructive">{editErrors.name}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-code">Code</Label>
                            <Input
                                id="edit-code"
                                value={editData.code}
                                onChange={(e) => setEditData('code', e.target.value)}
                                placeholder="e.g. SC-01"
                            />
                            {editErrors.code && <p className="text-sm text-destructive">{editErrors.code}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={editData.description}
                                onChange={(e) => setEditData('description', e.target.value)}
                                placeholder="Optional description..."
                                rows={3}
                            />
                            {editErrors.description && <p className="text-sm text-destructive">{editErrors.description}</p>}
                        </div>
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingBuilding(null)} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updating} className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                                <Save className="h-4 w-4" /> Update Building
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Building Modal */}
            <Dialog open={deletingBuilding !== null} onOpenChange={(open) => !open && setDeletingBuilding(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Building</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete {deletingBuilding?.name}? This action cannot be undone.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setDeletingBuilding(null)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroyBuilding} className="cursor-pointer">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

BuildingsIndex.layout = {
    breadcrumbs: [
        { title: 'Assets', href: '#' },
        { title: 'Buildings', href: buildingsIndex() },
    ],
};
