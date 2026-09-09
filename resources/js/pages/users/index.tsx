import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Eye,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserMinus,
    Users as UsersIcon,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/Acl/UserController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDebounce } from '@/hooks/use-debounce';
import { index as permissionsIndex } from '@/routes/permissions';
import { index as rolesIndex } from '@/routes/roles';
import { index as usersIndex, show as userShow } from '@/routes/users';
import type { Auth, User } from '@/types';

type Role = {
    id: number;
    name: string;
};

type UserWithRoles = User & {
    roles: Role[];
};

type UserForm = {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    is_active: boolean;
    roles: string[];
};

type PageProps = {
    auth: Auth;
    users: UserWithRoles[];
    roles: Role[];
    filters: {
        search?: string;
    };
};

function toUserFormData(user?: UserWithRoles | null): UserForm {
    return {
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        is_active: user?.is_active ?? true,
        roles: user?.roles.map((role) => role.name) || [],
    };
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function UsersIndex({ users, roles, filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserWithRoles | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const currentSearchFilter = filters.search || '';

    useEffect(() => {
        if (debouncedSearch !== currentSearchFilter) {
            router.get(
                usersIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [currentSearchFilter, debouncedSearch]);

    const createForm = useForm<UserForm>(toUserFormData());
    const editForm = useForm<UserForm>(toUserFormData());

    const mayCreate = can(auth, 'account.manage');
    const mayUpdate = can(auth, 'account.manage');
    const mayDelete = can(auth, 'account.manage');

    const activeUsersCount = useMemo(
        () => users.filter((user) => user.is_active).length,
        [users],
    );
    const inactiveUsersCount = users.length - activeUsersCount;
    const usersWithRolesCount = useMemo(
        () => users.filter((user) => user.roles.length > 0).length,
        [users],
    );

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.post(UserController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
                createForm.setData(toUserFormData());
            },
        });
    }

    function openEditDialog(user: UserWithRoles): void {
        setEditingUser(user);
        editForm.setData(toUserFormData(user));
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingUser) {
            return;
        }

        editForm.patch(UserController.update.url(editingUser.id), {
            preserveScroll: true,
            onSuccess: () => setEditingUser(null),
        });
    }

    function destroyUser(): void {
        if (!deletingUser) {
            return;
        }

        router.delete(UserController.destroy.url(deletingUser.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingUser(null),
        });
    }

    function toggleStatus(user: UserWithRoles): void {
        router.patch(
            UserController.toggleStatus.url(user.id),
            {},
            {
                preserveScroll: true,
            },
        );
    }

    function toggleRoleSelection(
        form: typeof createForm | typeof editForm,
        roleName: string,
        checked: boolean | 'indeterminate',
    ): void {
        if (checked) {
            form.setData('roles', [...form.data.roles, roleName]);

            return;
        }

        form.setData(
            'roles',
            form.data.roles.filter((name) => name !== roleName),
        );
    }

    return (
        <>
            <Head title="Users" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Users
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage application users, their assigned roles, and
                            account status.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {mayCreate && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="cursor-pointer gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        Access Control
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href={rolesIndex()} className="w-full cursor-pointer">
                                            Roles
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={permissionsIndex()} className="w-full cursor-pointer">
                                            Permissions
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {mayCreate && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="cursor-pointer gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add User
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <UsersIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total users
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {users.length}
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
                                    Active users
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {activeUsersCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Users with roles
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {usersWithRolesCount}
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
                            placeholder="Search users..."
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

                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className="h-10 rounded-full px-4 text-xs uppercase"
                        >
                            {users.length} records
                        </Badge>
                        <Badge
                            variant="outline"
                            className="h-10 rounded-full px-4 text-xs uppercase"
                        >
                            {inactiveUsersCount} inactive
                        </Badge>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Roles</th>
                                    <th className="px-6 py-4 text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.length > 0 ? (
                                                        user.roles.map((role) => (
                                                            <Badge
                                                                key={role.id}
                                                                variant="secondary"
                                                            >
                                                                {role.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No roles
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${
                                                        user.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    {user.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {dateFormatter.format(
                                                    new Date(user.created_at),
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={userShow.url(
                                                            user.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {mayUpdate && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                toggleStatus(user)
                                                            }
                                                            aria-label={
                                                                user.is_active
                                                                    ? `Deactivate ${user.name}`
                                                                    : `Activate ${user.name}`
                                                            }
                                                            title={
                                                                user.is_active
                                                                    ? 'Deactivate'
                                                                    : 'Activate'
                                                            }
                                                            className={`h-8 w-8 cursor-pointer ${
                                                                user.is_active
                                                                    ? 'text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300'
                                                                    : 'text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300'
                                                            }`}
                                                        >
                                                            {user.is_active ? (
                                                                <UserMinus className="h-4 w-4" />
                                                            ) : (
                                                                <UserCheck className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                    {mayUpdate && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    user,
                                                                )
                                                            }
                                                            aria-label={`Edit ${user.name}`}
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
                                                                setDeletingUser(
                                                                    user,
                                                                )
                                                            }
                                                            aria-label={`Delete ${user.name}`}
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
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-3xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Create User
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Add a new account and assign the access roles it
                                should receive.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="grid gap-5 p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="create_name">Name</Label>
                                <Input
                                    id="create_name"
                                    value={createForm.data.name}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_email">Email</Label>
                                <Input
                                    id="create_email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.email} />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="create_password">Password</Label>
                                <Input
                                    id="create_password"
                                    type="password"
                                    value={createForm.data.password}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={createForm.errors.password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_password_confirmation">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="create_password_confirmation"
                                    type="password"
                                    value={
                                        createForm.data.password_confirmation
                                    }
                                    onChange={(event) =>
                                        createForm.setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="create_active"
                                checked={createForm.data.is_active}
                                onCheckedChange={(checked) =>
                                    createForm.setData('is_active', checked)
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="create_active">
                                    Active status
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Disable this if the user should not be able to
                                    sign in yet.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Roles</Label>
                            <div className="grid max-h-64 grid-cols-1 gap-3 overflow-y-auto rounded-xl border bg-zinc-50 p-4 md:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-950/30">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`create_role_${role.id}`}
                                            checked={createForm.data.roles.includes(
                                                role.name,
                                            )}
                                            onCheckedChange={(checked) =>
                                                toggleRoleSelection(
                                                    createForm,
                                                    role.name,
                                                    checked,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`create_role_${role.id}`}
                                        >
                                            {role.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
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
                                Save User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingUser !== null}
                onOpenChange={(open) => !open && setEditingUser(null)}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-3xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Edit User
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update account details, password, role access,
                                and status.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="grid gap-5 p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_name">Name</Label>
                                <Input
                                    id="edit_name"
                                    value={editForm.data.name}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_email">Email</Label>
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.email} />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_password">
                                    New Password
                                </Label>
                                <Input
                                    id="edit_password"
                                    type="password"
                                    value={editForm.data.password}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.password} />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep the current password.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_password_confirmation">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="edit_password_confirmation"
                                    type="password"
                                    value={editForm.data.password_confirmation}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="edit_active"
                                checked={editForm.data.is_active}
                                onCheckedChange={(checked) =>
                                    editForm.setData('is_active', checked)
                                }
                            />
                            <div className="space-y-1">
                                <Label htmlFor="edit_active">
                                    Active status
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Turn this off to prevent the account from
                                    accessing the application.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Roles</Label>
                            <div className="grid max-h-64 grid-cols-1 gap-3 overflow-y-auto rounded-xl border bg-zinc-50 p-4 md:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-950/30">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`edit_role_${role.id}`}
                                            checked={editForm.data.roles.includes(
                                                role.name,
                                            )}
                                            onCheckedChange={(checked) =>
                                                toggleRoleSelection(
                                                    editForm,
                                                    role.name,
                                                    checked,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`edit_role_${role.id}`}
                                        >
                                            {role.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="border-t pt-4 dark:border-zinc-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingUser !== null}
                onOpenChange={(open) => !open && setDeletingUser(null)}
            >
                <DialogContent className="rounded-2xl border bg-white sm:max-w-md dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deletingUser?.name}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingUser(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyUser}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: usersIndex(),
        },
    ],
};
