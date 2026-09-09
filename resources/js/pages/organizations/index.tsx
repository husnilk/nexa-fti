import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    Eye,
    GitBranch,
    Network,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import OrganizationController from '@/actions/App/Http/Controllers/Acl/OrganizationController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { index as organizationTypesIndex } from '@/routes/organization-types';
import {
    index as organizationsIndex,
    show as organizationShow,
    structure as organizationsStructure,
} from '@/routes/organizations';
import type { Auth } from '@/types';

type Organization = {
    id: string;
    parent_id: string | null;
    organization_type_id: string;
    name: string;
    code: string;
    is_active: boolean;
    description: string | null;
    parent?: Organization | null;
    organization_type?: {
        id: string;
        name: string;
        level: number;
    } | null;
    created_at: string;
};

type OrganizationForm = {
    parent_id: string | null;
    organization_type_id: string;
    name: string;
    code: string;
    is_active: boolean;
    description: string | null;
};

type OrganizationType = {
    id: string;
    name: string;
    level: number;
};

type PageProps = {
    auth: Auth;
    organizations: Organization[];
    parentOrganizations: Organization[];
    organizationTypes: OrganizationType[];
    filters: {
        search?: string;
    };
};

function toOrganizationFormData(
    organization?: Organization | null,
): OrganizationForm {
    return {
        parent_id: organization?.parent_id || null,
        organization_type_id: organization?.organization_type_id || '',
        name: organization?.name || '',
        code: organization?.code || '',
        is_active: organization?.is_active ?? true,
        description: organization?.description || '',
    };
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    const legacyAbility = ability.startsWith('organization.')
        ? ability.replace('organization.', 'organizations.')
        : ability;

    return (
        auth.roles.includes('super-admin') ||
        auth.permissions.includes(ability) ||
        auth.permissions.includes(legacyAbility)
    );
}

export default function OrganizationsIndex({
    organizations,
    parentOrganizations,
    organizationTypes,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const editQueryOrganizationId =
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('edit')
            : null;
    const initialEditingOrganization = editQueryOrganizationId
        ? organizations.find(
              (organization) => organization.id === editQueryOrganizationId,
          ) || null
        : null;
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editingOrganization, setEditingOrganization] =
        useState<Organization | null>(initialEditingOrganization);
    const [deletingOrganization, setDeletingOrganization] =
        useState<Organization | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const currentSearchFilter = filters.search || '';

    useEffect(() => {
        if (debouncedSearch !== currentSearchFilter) {
            router.get(
                organizationsIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [currentSearchFilter, debouncedSearch]);

    useEffect(() => {
        if (!editQueryOrganizationId) {
            return;
        }

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('edit');

        const nextQuery = searchParams.toString();
        const nextUrl = nextQuery
            ? `${window.location.pathname}?${nextQuery}`
            : window.location.pathname;

        window.history.replaceState({}, '', nextUrl);
    }, [editQueryOrganizationId]);

    const createForm = useForm<OrganizationForm>({
        parent_id: null,
        organization_type_id: '',
        name: '',
        code: '',
        is_active: true,
        description: '',
    });

    const editForm = useForm<OrganizationForm>(
        toOrganizationFormData(initialEditingOrganization),
    );

    const mayManage = can(auth, 'organization.manage');

    function submitCreate(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        createForm.post(OrganizationController.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    }

    function openEditDialog(organization: Organization): void {
        setEditingOrganization(organization);
        editForm.setData(toOrganizationFormData(organization));
        editForm.clearErrors();
    }

    function submitEdit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!editingOrganization) {
            return;
        }

        editForm.patch(
            OrganizationController.update.url(editingOrganization.id),
            {
                preserveScroll: true,
                onSuccess: () => setEditingOrganization(null),
            },
        );
    }

    function destroyOrganization(): void {
        if (!deletingOrganization) {
            return;
        }

        router.delete(
            OrganizationController.destroy.url(deletingOrganization.id),
            {
                preserveScroll: true,
                onSuccess: () => setDeletingOrganization(null),
            },
        );
    }

    return (
        <>
            <Head title="Organizations" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Organizations
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage institutional units, their hierarchy, and
                            active status.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline">
                            <Link
                                href={organizationsStructure()}
                                className="gap-2"
                            >
                                <Network className="h-4 w-4" />
                                View Structure
                            </Link>
                        </Button>

                        {mayManage && (
                            <Button asChild variant="outline">
                                <Link
                                    href={organizationTypesIndex()}
                                    className="gap-2"
                                >
                                    <Network className="h-4 w-4" />
                                    Manage Types
                                </Link>
                            </Button>
                        )}

                        {mayManage && (
                            <Button
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="cursor-pointer gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Organization
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total organizations
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {organizations.length}
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
                                    Active organizations
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {
                                        organizations.filter(
                                            (organization) =>
                                                organization.is_active,
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <GitBranch className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Root organizations
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {
                                        organizations.filter(
                                            (organization) =>
                                                organization.parent_id === null,
                                        ).length
                                    }
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
                            placeholder="Search organizations..."
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
                        {organizations.length} records
                    </Badge>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[880px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Organization</th>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Parent</th>
                                    <th className="px-6 py-4 text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {organizations.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No organizations found matching your
                                            search.
                                        </td>
                                    </tr>
                                ) : (
                                    organizations.map((organization) => (
                                        <tr
                                            key={organization.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {organization.name}
                                                    </span>
                                                    <span className="line-clamp-1 text-xs text-muted-foreground">
                                                        {organization.description ||
                                                            'No description provided.'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium dark:bg-zinc-800">
                                                    {organization.code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {organization.organization_type
                                                    ?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {organization.parent?.name ||
                                                    '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${
                                                        organization.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    {organization.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {dateFormatter.format(
                                                    new Date(
                                                        organization.created_at,
                                                    ),
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={organizationShow.url(
                                                            organization.id,
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
                                                    {mayManage && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    organization,
                                                                )
                                                            }
                                                            aria-label={`Edit ${organization.name}`}
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {mayManage && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeletingOrganization(
                                                                    organization,
                                                                )
                                                            }
                                                            aria-label={`Delete ${organization.name}`}
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
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Create Organization
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Add a new organization and place it within the
                                institutional hierarchy.
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
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_code">Code</Label>
                                <Input
                                    id="create_code"
                                    value={createForm.data.code}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'code',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.code} />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="create_type">Type</Label>
                                <Select
                                    value={createForm.data.organization_type_id}
                                    onValueChange={(value) =>
                                        createForm.setData(
                                            'organization_type_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger id="create_type">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizationTypes.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name} (Level {type.level})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={
                                        createForm.errors.organization_type_id
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create_parent">
                                    Parent Organization
                                </Label>
                                <Select
                                    value={createForm.data.parent_id || 'none'}
                                    onValueChange={(value) =>
                                        createForm.setData(
                                            'parent_id',
                                            value === 'none' ? null : value,
                                        )
                                    }
                                >
                                    <SelectTrigger id="create_parent">
                                        <SelectValue placeholder="Select a parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        {parentOrganizations.map((org) => (
                                            <SelectItem
                                                key={org.id}
                                                value={org.id}
                                            >
                                                {org.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={createForm.errors.parent_id}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="create_is_active"
                                checked={createForm.data.is_active}
                                onCheckedChange={(checked) =>
                                    createForm.setData('is_active', checked)
                                }
                            />
                            <Label htmlFor="create_is_active">Active</Label>
                            <InputError message={createForm.errors.is_active} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create_description">
                                Description
                            </Label>
                            <Textarea
                                id="create_description"
                                rows={4}
                                value={createForm.data.description || ''}
                                onChange={(e) =>
                                    createForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={createForm.errors.description}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingOrganization !== null}
                onOpenChange={(open) => !open && setEditingOrganization(null)}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-2xl dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Edit Organization
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Update the organization details and hierarchy.
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
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_code">Code</Label>
                                <Input
                                    id="edit_code"
                                    value={editForm.data.code}
                                    onChange={(e) =>
                                        editForm.setData('code', e.target.value)
                                    }
                                />
                                <InputError message={editForm.errors.code} />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_type">Type</Label>
                                <Select
                                    value={editForm.data.organization_type_id}
                                    onValueChange={(value) =>
                                        editForm.setData(
                                            'organization_type_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit_type">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizationTypes.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name} (Level {type.level})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={editForm.errors.organization_type_id}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_parent">
                                    Parent Organization
                                </Label>
                                <Select
                                    value={editForm.data.parent_id || 'none'}
                                    onValueChange={(value) =>
                                        editForm.setData(
                                            'parent_id',
                                            value === 'none' ? null : value,
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit_parent">
                                        <SelectValue placeholder="Select a parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        {parentOrganizations
                                            .filter(
                                                (org) =>
                                                    org.id !==
                                                    editingOrganization?.id,
                                            )
                                            .map((org) => (
                                                <SelectItem
                                                    key={org.id}
                                                    value={org.id}
                                                >
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={editForm.errors.parent_id}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
                            <Switch
                                id="edit_is_active"
                                checked={editForm.data.is_active}
                                onCheckedChange={(checked) =>
                                    editForm.setData('is_active', checked)
                                }
                            />
                            <Label htmlFor="edit_is_active">Active</Label>
                            <InputError message={editForm.errors.is_active} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">
                                Description
                            </Label>
                            <Textarea
                                id="edit_description"
                                rows={4}
                                value={editForm.data.description || ''}
                                onChange={(e) =>
                                    editForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={editForm.errors.description} />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingOrganization(null)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deletingOrganization !== null}
                onOpenChange={(open) => !open && setDeletingOrganization(null)}
            >
                <DialogContent className="rounded-2xl border bg-white p-0 shadow-lg sm:max-w-lg dark:border-zinc-800 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="rounded-t-2xl border-b px-6 py-5 dark:border-zinc-800">
                            <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Delete Organization
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Are you sure you want to delete{' '}
                                {deletingOrganization?.name}? This action cannot
                                be undone and will also delete all child
                                organizations.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="px-6 py-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingOrganization(null)}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyOrganization}
                            className="cursor-pointer"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

OrganizationsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Organizations',
            href: organizationsIndex(),
        },
    ],
};
