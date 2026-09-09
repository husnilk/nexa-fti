import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Key, Pencil, Plus, Search, Shield, ShieldCheck, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import RoleController from '@/actions/App/Http/Controllers/Acl/RoleController';
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
import { index as permissionsIndex } from '@/routes/permissions';
import { index as rolesIndex } from '@/routes/roles';
import { index as usersIndex } from '@/routes/users';
import type { Auth, Permission } from '@/types';

type Role = {
    uuid: string;
    name: string;
    permissions: Permission[];
    created_at: string;
};

type PageProps = {
    auth: Auth;
    roles: Role[];
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

export default function RolesIndex({ roles, permissions }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingRole, setDeletingRole] = useState<Role | null>(null);
    const [search, setSearch] = useState<string>('');

    const filteredRoles = useMemo(() => {
        if (!search.trim()) {
            return roles;
        }

        const query = search.toLowerCase();

        return roles.filter((role) => {
            return (
                role.name.toLowerCase().includes(query) ||
                role.permissions.some((p) => p.name.toLowerCase().includes(query))
            );
        });
    }, [roles, search]);

    const mayCreate = can(auth, 'account.manage');
    const mayUpdate = can(auth, 'account.manage');
    const mayDelete = can(auth, 'account.manage');
    const canViewPermissions = can(auth, 'account.view');

    function destroyRole(): void {
        if (!deletingRole) {
            return;
        }

        router.delete(RoleController.destroy.url(deletingRole.uuid), {
            preserveScroll: true,
            onSuccess: () => setDeletingRole(null),
        });
    }

    return (
        <>
            <Head title="Roles" />

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
                                Roles
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage user roles and their assigned permissions.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {canViewPermissions && (
                            <Button variant="outline" asChild>
                                <Link href={permissionsIndex()} className="gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    Permissions
                                </Link>
                            </Button>
                        )}
                        {mayCreate && (
                            <Button
                                asChild
                                className="cursor-pointer gap-2"
                            >
                                <Link href={RoleController.create.url()}>
                                    <Plus className="h-4 w-4" />
                                    Add Role
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total roles
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {roles.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400">
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
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Roles with permissions
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {roles.filter((r) => r.permissions.length > 0).length}
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
                            placeholder="Search roles..."
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
                        {filteredRoles.length} records
                    </Badge>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Permissions</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {filteredRoles.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No roles found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRoles.map((role) => (
                                        <tr
                                            key={role.uuid}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50 text-nowrap">
                                                {role.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-md">
                                                    {role.permissions.slice(0, 3).map((permission) => (
                                                        <Badge
                                                            key={permission.uuid}
                                                            variant="secondary"
                                                            className="bg-zinc-100 hover:bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-200"
                                                        >
                                                            {permission.name}
                                                        </Badge>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-muted-foreground"
                                                        >
                                                            +{role.permissions.length - 3} more
                                                        </Badge>
                                                    )}
                                                    {role.permissions.length === 0 && (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            No permissions
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300 text-nowrap">
                                                {dateFormatter.format(
                                                    new Date(role.created_at),
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {mayUpdate && (
                                                        <Button
                                                            asChild
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Link
                                                                href={RoleController.edit.url(role.uuid)}
                                                                aria-label={`Edit ${role.name}`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {mayDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeletingRole(role)
                                                            }
                                                            aria-label={`Delete ${role.name}`}
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
                open={deletingRole !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingRole(null);
                    }
                }}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Delete Role
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                This removes {deletingRole?.name} from every assigned user.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="px-6 py-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingRole(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyRole}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: rolesIndex(),
        },
    ],
};
