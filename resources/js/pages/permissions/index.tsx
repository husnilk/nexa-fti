import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Key, Pencil, Plus, Search, Shield, ShieldCheck, Trash2, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import PermissionController from '@/actions/App/Http/Controllers/Acl/PermissionController';
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
import { index as permissionsIndex } from '@/routes/permissions';
import { index as rolesIndex } from '@/routes/roles';
import { index as usersIndex } from '@/routes/users';
import type { Auth, Permission } from '@/types';

type PermissionForm = {
    name: string;
    guard_name: string;
    category: string;
    description: string;
};

type PageProps = {
    auth: Auth;
    permissions: Permission[];
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

export default function PermissionsIndex({ permissions }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingPermission, setEditingPermission] =
        useState<any | null>(null);
    const [deletingPermission, setDeletingPermission] =
        useState<Permission | null>(null);
    const [search, setSearch] = useState<string>('');

    const filteredPermissions = useMemo(() => {
        if (!search.trim()) {
            return permissions;
        }

        const query = search.toLowerCase();

        return permissions.filter((permission) => {
            return (
                permission.name.toLowerCase().includes(query) ||
                permission.guard_name.toLowerCase().includes(query) ||
                permission.category?.toLowerCase().includes(query) ||
                permission.description?.toLowerCase().includes(query)
            );
        });
    }, [permissions, search]);

    const createForm = useForm<PermissionForm>({
        name: '',
        guard_name: 'web',
        category: '',
        description: '',
    });

    const editForm = useForm<PermissionForm>({
        name: '',
        guard_name: 'web',
        category: '',
        description: '',
    });

    const mayCreate = can(auth, 'account.manage');
    const mayUpdate = can(auth, 'account.manage');
    const mayDelete = can(auth, 'account.manage');
    const canViewRoles = can(auth, 'account.view');

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.post(PermissionController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(permission: any): void {
        setEditingPermission(permission);
        editForm.setData({
            name: permission.name,
            guard_name: permission.guard_name,
            category: permission.category || '',
            description: permission.description || '',
        });
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingPermission) {
            return;
        }

        editForm.patch(
            PermissionController.update.url(editingPermission.uuid),
            {
                preserveScroll: true,
                onSuccess: () => setEditingPermission(null),
            },
        );
    }

    function destroyPermission(): void {
        if (!deletingPermission) {
            return;
        }

        router.delete(
            PermissionController.destroy.url(deletingPermission.uuid),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingPermission(null),
            },
        );
    }

    return (
        <>
            <Head title="Permissions" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <Link href={usersIndex()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Permissions
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage application abilities and resource access controls.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {canViewRoles && (
                            <Button variant="outline" asChild>
                                <Link href={rolesIndex()} className="gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    Roles
                                </Link>
                            </Button>
                        )}
                        {mayCreate && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="cursor-pointer gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Permission
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <Key className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total permissions
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {permissions.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Web guard permissions
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {permissions.filter((p) => p.guard_name === 'web').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Distinct guards
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {new Set(permissions.map((p) => p.guard_name)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search permissions..."
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

                    <Badge
                        variant="outline"
                        className="h-10 rounded-full px-4 text-xs tracking-wide uppercase"
                    >
                        {filteredPermissions.length} records
                    </Badge>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4 text-nowrap">Permission</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-center">Guard</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right text-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {filteredPermissions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No permissions found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPermissions.map((permission) => (
                                        <tr
                                            key={permission.uuid}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {permission.name}
                                                </div>
                                                {permission.description && (
                                                    <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1 max-w-xs">
                                                        {permission.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {permission.category ? (
                                                    <Badge variant="outline" className="font-normal capitalize">
                                                        {permission.category}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        Uncategorized
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-nowrap">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-zinc-100 hover:bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    {permission.guard_name}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {dateFormatter.format(
                                                    new Date(permission.created_at),
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {mayUpdate && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditDialog(permission)
                                                            }
                                                            aria-label={`Edit ${permission.name}`}
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
                                                            onClick={() =>
                                                                setDeletingPermission(
                                                                    permission,
                                                                )
                                                            }
                                                            aria-label={`Delete ${permission.name}`}
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

            <Dialog
                open={isCreating}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsCreating(false);
                    }
                }}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Create Permission
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Add a new permission ability for the application.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="grid gap-5 p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Permission name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={createForm.data.name}
                                onChange={(event) =>
                                    createForm.setData(
                                        'name',
                                        event.target.value,
                                    )
                                }
                                placeholder="posts.create"
                                autoComplete="off"
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                value={createForm.data.category}
                                onChange={(event) =>
                                    createForm.setData(
                                        'category',
                                        event.target.value,
                                    )
                                }
                                placeholder="Posts"
                                autoComplete="off"
                            />
                            <InputError message={createForm.errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={createForm.data.description}
                                onChange={(event) =>
                                    createForm.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                placeholder="Allow user to create posts"
                                autoComplete="off"
                            />
                            <InputError message={createForm.errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="guard_name">Guard</Label>
                            <Input
                                id="guard_name"
                                name="guard_name"
                                value={createForm.data.guard_name}
                                onChange={(event) =>
                                    createForm.setData(
                                        'guard_name',
                                        event.target.value,
                                    )
                                }
                                autoComplete="off"
                            />
                            <InputError
                                message={createForm.errors.guard_name}
                            />
                        </div>

                        <DialogFooter className="border-t pt-4 dark:border-zinc-800">
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
                open={editingPermission !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingPermission(null);
                    }
                }}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Edit Permission
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update the permission name or guard.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="grid gap-5 p-6">
                        <div className="grid gap-2">
                            <Label htmlFor="edit_name">Permission name</Label>
                            <Input
                                id="edit_name"
                                value={editForm.data.name}
                                onChange={(event) =>
                                    editForm.setData('name', event.target.value)
                                }
                                autoComplete="off"
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_category">Category</Label>
                            <Input
                                id="edit_category"
                                value={editForm.data.category}
                                onChange={(event) =>
                                    editForm.setData('category', event.target.value)
                                }
                                autoComplete="off"
                            />
                            <InputError message={editForm.errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">Description</Label>
                            <Input
                                id="edit_description"
                                value={editForm.data.description}
                                onChange={(event) =>
                                    editForm.setData('description', event.target.value)
                                }
                                autoComplete="off"
                            />
                            <InputError message={editForm.errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_guard_name">Guard</Label>
                            <Input
                                id="edit_guard_name"
                                value={editForm.data.guard_name}
                                onChange={(event) =>
                                    editForm.setData(
                                        'guard_name',
                                        event.target.value,
                                    )
                                }
                                autoComplete="off"
                            />
                            <InputError message={editForm.errors.guard_name} />
                        </div>

                        <DialogFooter className="border-t pt-4 dark:border-zinc-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingPermission(null)}
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
                open={deletingPermission !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingPermission(null);
                    }
                }}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Delete Permission
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                This removes {deletingPermission?.name} from every
                                assigned role and user.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="px-6 py-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingPermission(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyPermission}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PermissionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Permissions',
            href: permissionsIndex(),
        },
    ],
};
