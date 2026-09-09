import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import OrganizationTypeController from '@/actions/App/Http/Controllers/Acl/OrganizationTypeController';
import InputError from '@/components/input-error';
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
import { index as organizationTypesIndex } from '@/routes/organization-types';
import { index as organizationsIndex } from '@/routes/organizations';
import type { Auth } from '@/types';

type OrganizationType = {
    id: string;
    name: string;
    level: number;
    created_at: string;
};

type OrganizationTypeForm = {
    name: string;
    level: string;
};

type PageProps = {
    auth: Auth;
    organizationTypes: OrganizationType[];
    filters: {
        search?: string;
    };
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function OrganizationTypesIndex({
    organizationTypes,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState(false);
    const [editingType, setEditingType] = useState<OrganizationType | null>(
        null,
    );
    const [deletingType, setDeletingType] = useState<OrganizationType | null>(
        null,
    );
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const currentSearchFilter = filters.search || '';
    const canManage =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('organization.manage') ||
        auth.permissions.includes('organizations.manage');

    useEffect(() => {
        if (debouncedSearch !== currentSearchFilter) {
            router.get(
                organizationTypesIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [currentSearchFilter, debouncedSearch]);

    const createForm = useForm<OrganizationTypeForm>({
        name: '',
        level: '1',
    });

    const editForm = useForm<OrganizationTypeForm>({
        name: '',
        level: '1',
    });

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.transform((data) => ({
            ...data,
            level: Number(data.level),
        })).post(OrganizationTypeController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
                createForm.setData('level', '1');
            },
        });
    }

    function openEditDialog(organizationType: OrganizationType): void {
        setEditingType(organizationType);
        editForm.setData({
            name: organizationType.name,
            level: organizationType.level.toString(),
        });
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingType) {
            return;
        }

        editForm.transform((data) => ({
            ...data,
            level: Number(data.level),
        })).patch(OrganizationTypeController.update.url(editingType.id), {
            preserveScroll: true,
            onSuccess: () => setEditingType(null),
        });
    }

    function destroyType(): void {
        if (!deletingType) {
            return;
        }

        router.delete(OrganizationTypeController.destroy.url(deletingType.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingType(null),
        });
    }

    return (
        <>
            <Head title="Organization Types" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Organization Types
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage organization type names and hierarchy levels.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline">
                            <Link href={organizationsIndex()}>
                                Back to Organizations
                            </Link>
                        </Button>
                        {canManage && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="cursor-pointer gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Type
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search organization types..."
                            className="bg-white pl-9 dark:bg-zinc-900"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <span className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {organizationTypes.length} records
                    </span>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {organizationTypes.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No organization types found.
                                        </td>
                                    </tr>
                                ) : (
                                    organizationTypes.map((organizationType) => (
                                        <tr
                                            key={organizationType.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                                {organizationType.name}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                Level {organizationType.level}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {dateFormatter.format(
                                                    new Date(
                                                        organizationType.created_at,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {canManage && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    organizationType,
                                                                )
                                                            }
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {canManage && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeletingType(
                                                                    organizationType,
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
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Organization Type</DialogTitle>
                        <DialogDescription>
                            Add a new organization type and assign its hierarchy
                            level.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitCreate} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Name</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(event) =>
                                    createForm.setData('name', event.target.value)
                                }
                            />
                            <InputError message={createForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-level">Level</Label>
                            <Input
                                id="create-level"
                                type="number"
                                min={1}
                                value={createForm.data.level}
                                onChange={(event) =>
                                    createForm.setData(
                                        'level',
                                        event.target.value,
                                    )
                                }
                            />
                            <InputError message={createForm.errors.level} />
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
                open={editingType !== null}
                onOpenChange={(open) => !open && setEditingType(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Organization Type</DialogTitle>
                        <DialogDescription>
                            Update the organization type name and hierarchy
                            level.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(event) =>
                                    editForm.setData('name', event.target.value)
                                }
                            />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-level">Level</Label>
                            <Input
                                id="edit-level"
                                type="number"
                                min={1}
                                value={editForm.data.level}
                                onChange={(event) =>
                                    editForm.setData('level', event.target.value)
                                }
                            />
                            <InputError message={editForm.errors.level} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingType(null)}
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
                open={deletingType !== null}
                onOpenChange={(open) => !open && setDeletingType(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Organization Type</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            {deletingType?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingType(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyType}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

OrganizationTypesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Organizations',
            href: organizationsIndex(),
        },
        {
            title: 'Organization Types',
            href: organizationTypesIndex(),
        },
    ],
};
