import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Shield, CheckCircle2, Circle } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo } from 'react';
import RoleController from '@/actions/App/Http/Controllers/Acl/RoleController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { index as rolesIndex } from '@/routes/roles';
import type { Permission } from '@/types';

type Role = {
    uuid: string;
    name: string;
    permissions: Permission[];
};

type RoleForm = {
    name: string;
    permissions: string[];
};

type PageProps = {
    role: Role;
    permissions: Permission[];
};

export default function EditRole({ role, permissions }: PageProps) {
    const form = useForm<RoleForm>({
        name: role.name,
        permissions: role.permissions.map((p) => p.uuid),
    });

    const groupedPermissions = useMemo(() => {
        return permissions.reduce(
            (groups, permission) => {
                const category = permission.category || __('Uncategorized');

                if (!groups[category]) {
                    groups[category] = [];
                }

                groups[category].push(permission);

                return groups;
            },
            {} as Record<string, typeof permissions>,
        );
    }, [permissions]);

    const toggleCategory = (categoryPermissions: Permission[]) => {
        const uuids = categoryPermissions.map((p) => p.uuid);
        const allSelected = uuids.every((uuid) =>
            form.data.permissions.includes(uuid),
        );

        if (allSelected) {
            form.setData(
                'permissions',
                form.data.permissions.filter((p) => !uuids.includes(p)),
            );
        } else {
            form.setData('permissions', [
                ...new Set([...form.data.permissions, ...uuids]),
            ]);
        }
    };

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        form.patch(RoleController.update.url(role.uuid));
    }

    return (
        <>
            <Head title={__('Edit Role: :name', { name: role.name })} />

            <div className="container mx-auto px-4 py-8">
                <form onSubmit={submit} className="mx-auto max-w-5xl space-y-6">
                    <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <Link
                                href={rolesIndex()}
                                className="transition-transform hover:-translate-x-1"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {__('Edit Role: :name', {
                                        name: role.name,
                                    })}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {__('Update role name and permissions.')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" asChild size="sm">
                                <Link href={rolesIndex()}>{__('Cancel')}</Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="gap-2"
                                size="sm"
                            >
                                <Save className="h-4 w-4" />
                                {__('Update Role')}
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                <div className="rounded-xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                        <Shield className="h-5 w-5" />
                                        <h2 className="font-semibold">
                                            {__('Role Identity')}
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                {__('Role Name')}
                                            </Label>
                                            <Input
                                                id="name"
                                                value={form.data.name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={__(
                                                    'e.g. Content Manager',
                                                )}
                                            />
                                            <InputError
                                                message={form.errors.name}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/20 dark:bg-indigo-950/10">
                                    <p className="text-xs leading-relaxed text-indigo-800 dark:text-indigo-400">
                                        {__(
                                            'Modifying this role will affect all :name users immediately. Ensure you have the right permissions selected.',
                                            { name: role.name },
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 lg:col-span-2">
                            {Object.entries(groupedPermissions).map(
                                ([category, categoryPermissions]) => {
                                    const allSelected =
                                        categoryPermissions.every((p) =>
                                            form.data.permissions.includes(
                                                p.uuid,
                                            ),
                                        );

                                    return (
                                        <div
                                            key={category}
                                            className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                                        >
                                            <div className="flex items-center justify-between border-b bg-zinc-50/50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                                                <h3 className="text-sm font-bold tracking-wider text-foreground uppercase">
                                                    {category}
                                                </h3>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleCategory(
                                                            categoryPermissions,
                                                        )
                                                    }
                                                    className="h-8 gap-1.5 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                >
                                                    {allSelected ? (
                                                        <>
                                                            <Circle className="h-3.5 w-3.5" />{' '}
                                                            {__('Deselect All')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                            {__('Select All')}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                            <div className="p-5">
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    {categoryPermissions.map(
                                                        (permission) => (
                                                            <div
                                                                key={
                                                                    permission.uuid
                                                                }
                                                                className={cn(
                                                                    'flex items-start gap-3 rounded-lg border p-3 transition-all',
                                                                    form.data.permissions.includes(
                                                                        permission.uuid,
                                                                    )
                                                                        ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/30 dark:bg-indigo-950/10'
                                                                        : 'border-zinc-100 bg-white hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700',
                                                                )}
                                                            >
                                                                <Checkbox
                                                                    id={`permission_${permission.uuid}`}
                                                                    checked={form.data.permissions.includes(
                                                                        permission.uuid,
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked,
                                                                    ) => {
                                                                        if (
                                                                            checked
                                                                        ) {
                                                                            form.setData(
                                                                                'permissions',
                                                                                [
                                                                                    ...form
                                                                                        .data
                                                                                        .permissions,
                                                                                    permission.uuid,
                                                                                ],
                                                                            );
                                                                        } else {
                                                                            form.setData(
                                                                                'permissions',
                                                                                form.data.permissions.filter(
                                                                                    (
                                                                                        p,
                                                                                    ) =>
                                                                                        p !==
                                                                                        permission.uuid,
                                                                                ),
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="mt-1"
                                                                />
                                                                <div className="grid gap-1">
                                                                    <Label
                                                                        htmlFor={`permission_${permission.uuid}`}
                                                                        className="cursor-pointer text-sm leading-tight font-medium"
                                                                    >
                                                                        {
                                                                            permission.name
                                                                        }
                                                                    </Label>
                                                                    {permission.description && (
                                                                        <p className="line-clamp-2 text-xs leading-normal text-muted-foreground">
                                                                            {
                                                                                permission.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

EditRole.layout = {
    breadcrumbs: [
        {
            title: __('Roles'),
            href: rolesIndex(),
        },
        {
            title: __('Edit'),
            href: '#',
        },
    ],
};
