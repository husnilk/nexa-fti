import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import PositionNomenclatureController from '@/actions/App/Http/Controllers/Acl/PositionNomenclatureController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { useDebounce } from '@/hooks/use-debounce';
import {
    index as nomenclaturesIndex,
    show as nomenclatureShow,
} from '@/routes/position-nomenclatures';
import type { Auth } from '@/types';

type PositionNomenclature = {
    id: string;
    name: string;
    grade: number;
    qualification: string | null;
    created_at: string;
};

type NomenclatureForm = {
    name: string;
    grade: number;
    qualification: string | null;
};

type PageProps = {
    auth: Auth;
    nomenclatures: PositionNomenclature[];
    filters: {
        search?: string;
    };
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function PositionNomenclatureIndex({
    nomenclatures,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingNomenclature, setEditingNomenclature] =
        useState<PositionNomenclature | null>(null);
    const [deletingNomenclature, setDeletingNomenclature] =
        useState<PositionNomenclature | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                nomenclaturesIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [debouncedSearch]);

    const createForm = useForm<NomenclatureForm>({
        name: '',
        grade: 0,
        qualification: '',
    });

    const editForm = useForm<NomenclatureForm>({
        name: '',
        grade: 0,
        qualification: '',
    });

    const mayCreate = can(auth, 'organizations.manage');
    const mayUpdate = can(auth, 'organizations.manage');
    const mayDelete = can(auth, 'organizations.manage');

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.post(PositionNomenclatureController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(nomenclature: PositionNomenclature): void {
        setEditingNomenclature(nomenclature);
        editForm.setData({
            name: nomenclature.name,
            grade: nomenclature.grade,
            qualification: nomenclature.qualification || '',
        });
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingNomenclature) {
            return;
        }

        editForm.patch(
            PositionNomenclatureController.update.url(editingNomenclature.id),
            {
                preserveScroll: true,
                onSuccess: () => setEditingNomenclature(null),
            },
        );
    }

    function destroyNomenclature(): void {
        if (!deletingNomenclature) {
            return;
        }

        router.delete(
            PositionNomenclatureController.destroy.url(deletingNomenclature.id),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingNomenclature(null),
            },
        );
    }

    return (
        <>
            <Head title="Position Nomenclatures" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Position Nomenclatures"
                        description="Manage standardized job nomenclatures and requirements"
                    />

                    <div className="flex items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search nomenclatures..."
                                className="pr-10 pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        {mayCreate && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus />
                                Add Nomenclature
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[700px] grid-cols-[minmax(250px,1fr)_100px_minmax(200px,1fr)_140px_120px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>Name</span>
                        <span>Grade</span>
                        <span>Qualification</span>
                        <span>Created</span>
                        <span className="text-right">Actions</span>
                    </div>

                    {nomenclatures.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No position nomenclatures found.
                        </div>
                    ) : (
                        <div className="min-w-[700px] divide-y">
                            {nomenclatures.map((nom) => (
                                <div
                                    key={nom.id}
                                    className="grid grid-cols-[minmax(250px,1fr)_100px_minmax(200px,1fr)_140px_120px] items-center gap-4 px-4 py-3"
                                >
                                    <span className="font-medium">
                                        {nom.name}
                                    </span>
                                    <Badge variant="outline">{nom.grade}</Badge>
                                    <span className="line-clamp-1 text-sm text-muted-foreground">
                                        {nom.qualification || '-'}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {dateFormatter.format(
                                            new Date(nom.created_at),
                                        )}
                                    </span>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            title="View Detail"
                                        >
                                            <Link
                                                href={nomenclatureShow.url(
                                                    nom.id,
                                                )}
                                            >
                                                <Eye />
                                            </Link>
                                        </Button>
                                        {mayUpdate && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditDialog(nom)
                                                }
                                                aria-label={`Edit ${nom.name}`}
                                            >
                                                <Pencil />
                                            </Button>
                                        )}
                                        {mayDelete && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeletingNomenclature(nom)
                                                }
                                                aria-label={`Delete ${nom.name}`}
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Nomenclature</DialogTitle>
                        <DialogDescription>
                            Add a new position nomenclature to the system.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create_name">Name</Label>
                            <Input
                                id="create_name"
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData('name', e.target.value)
                                }
                                placeholder="e.g. Senior Software Engineer"
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create_grade">Grade</Label>
                            <Input
                                id="create_grade"
                                type="number"
                                value={createForm.data.grade}
                                onChange={(e) =>
                                    createForm.setData(
                                        'grade',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                            />
                            <InputError message={createForm.errors.grade} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create_qualification">
                                Qualification
                            </Label>
                            <textarea
                                id="create_qualification"
                                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={createForm.data.qualification || ''}
                                onChange={(e) =>
                                    createForm.setData(
                                        'qualification',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={createForm.errors.qualification}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingNomenclature !== null}
                onOpenChange={(open) => !open && setEditingNomenclature(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Nomenclature</DialogTitle>
                        <DialogDescription>
                            Update the nomenclature details.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_name">Name</Label>
                            <Input
                                id="edit_name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_grade">Grade</Label>
                            <Input
                                id="edit_grade"
                                type="number"
                                value={editForm.data.grade}
                                onChange={(e) =>
                                    editForm.setData(
                                        'grade',
                                        parseInt(e.target.value) || 0,
                                    )
                                }
                            />
                            <InputError message={editForm.errors.grade} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_qualification">
                                Qualification
                            </Label>
                            <textarea
                                id="edit_qualification"
                                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                value={editForm.data.qualification || ''}
                                onChange={(e) =>
                                    editForm.setData(
                                        'qualification',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={editForm.errors.qualification}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingNomenclature(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingNomenclature !== null}
                onOpenChange={(open) => !open && setDeletingNomenclature(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Nomenclature</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            {deletingNomenclature?.name}? This action cannot be
                            undone and will also delete all related
                            responsibilities and classifications.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingNomenclature(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyNomenclature}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PositionNomenclatureIndex.layout = {
    breadcrumbs: [
        {
            title: 'Position Nomenclatures',
            href: nomenclaturesIndex(),
        },
    ],
};
