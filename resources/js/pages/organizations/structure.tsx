import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    ChevronRight,
    Edit,
    GitBranch,
    Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    index as organizationsIndex,
    show as organizationShow,
    structure as organizationsStructure,
} from '@/routes/organizations';
import type { Auth } from '@/types';

type Organization = {
    id: string;
    parent_id: string | null;
    name: string;
    code: string;
    is_active: boolean;
    description: string | null;
    organization_type?: {
        id: string;
        name: string;
        level: number;
    } | null;
    created_at: string;
};

type OrganizationNode = Organization & {
    children: OrganizationNode[];
};

type PageProps = {
    auth: Auth;
    organizations: Organization[];
};

function buildOrganizationTree(
    organizations: Organization[],
): OrganizationNode[] {
    const organizationsById = new Map<string, OrganizationNode>();

    organizations.forEach((organization) => {
        organizationsById.set(organization.id, {
            ...organization,
            children: [],
        });
    });

    const roots: OrganizationNode[] = [];

    organizationsById.forEach((organization) => {
        if (organization.parent_id) {
            const parent = organizationsById.get(organization.parent_id);

            if (parent) {
                parent.children.push(organization);

                return;
            }
        }

        roots.push(organization);
    });

    return roots;
}

function OrganizationTreeBranch({
    node,
    depth = 0,
    mayManage,
}: {
    node: OrganizationNode;
    depth?: number;
    mayManage: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="rounded-2xl border bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                {node.name}
                            </h3>
                            <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                                    node.is_active
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                }`}
                            >
                                {node.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {node.organization_type?.name || '-'}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {node.code}
                            {node.description ? ` • ${node.description}` : ''}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={organizationShow(node.id)}>
                                View
                            </Link>
                        </Button>
                        {mayManage && (
                            <Button asChild size="sm">
                                <Link
                                    href={organizationsIndex.url({
                                        query: { edit: node.id },
                                    })}
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {node.children.length > 0 && (
                <div
                    className="space-y-3 border-l border-dashed border-zinc-300 pl-4 dark:border-zinc-700"
                    style={{ marginLeft: depth === 0 ? 0 : 8 }}
                >
                    {node.children.map((child) => (
                        <div
                            key={child.id}
                            className="relative before:absolute before:top-6 before:right-full before:h-px before:w-4 before:bg-zinc-300 before:content-[''] dark:before:bg-zinc-700"
                        >
                            <OrganizationTreeBranch
                                node={child}
                                depth={depth + 1}
                                mayManage={mayManage}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function OrganizationStructure({
    organizations,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayManage =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('organization.manage') ||
        auth.permissions.includes('organizations.manage');
    const organizationTree = buildOrganizationTree(organizations);
    const rootOrganizations = organizationTree.length;
    const activeOrganizations = organizations.filter(
        (organization) => organization.is_active,
    ).length;

    return (
        <>
            <Head title="Organization Structure" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <Link href={organizationsIndex()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Organization Structure
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Browse the institutional hierarchy in a tree
                                view.
                            </p>
                        </div>
                    </div>

                    <Button asChild variant="outline">
                        <Link href={organizationsIndex()}>
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            Back to List
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
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
                            <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                <Network className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Root organizations
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {rootOrganizations}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                <GitBranch className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Active organizations
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {activeOrganizations}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {organizationTree.map((organization) => (
                        <OrganizationTreeBranch
                            key={organization.id}
                            node={organization}
                            mayManage={mayManage}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

OrganizationStructure.layout = {
    breadcrumbs: [
        {
            title: 'Organizations',
            href: organizationsIndex(),
        },
        {
            title: 'Structure',
            href: organizationsStructure(),
        },
    ],
};
