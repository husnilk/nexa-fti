import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Network,
    ShieldCheck,
    TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    index as positionsIndex,
    organizationPositions as positionsOrganizationPositions,
} from '@/routes/positions';

type OrganizationPosition = {
    id: number;
    grade: number;
    job_value: number;
    cg: number;
    is_active: boolean;
    organization?: {
        id: string;
        name: string;
        code: string;
        is_active: boolean;
    } | null;
};

type Position = {
    id: string;
    name: string;
    grade: number;
    job_value: number;
    cg: number;
    skp_point: number;
    is_active: number;
    description: string | null;
    organization_positions_count: number;
    organization_positions: OrganizationPosition[];
};

type PageProps = {
    positions: Position[];
};

export default function PositionOrganizationPositions({ positions }: PageProps) {
    const assignedPositionsCount = positions.filter(
        (position) => position.organization_positions_count > 0,
    ).length;
    const totalAssignments = positions.reduce(
        (total, position) => total + position.organization_positions_count,
        0,
    );

    return (
        <>
            <Head title="Organization Positions" />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                    <Link href={positionsIndex()}>
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
                            Organization Positions
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review each position and the organizations currently
                            using it.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total positions
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {positions.length}
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
                                    Assigned positions
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {assignedPositionsCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total assignments
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalAssignments}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Job Value</th>
                                    <th className="px-6 py-4">CG</th>
                                    <th className="px-6 py-4">SKP Point</th>
                                    <th className="px-6 py-4 text-center">
                                        Assignments
                                    </th>
                                    <th className="px-6 py-4">Organizations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {positions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            No positions available yet.
                                        </td>
                                    </tr>
                                ) : (
                                    positions.map((position) => (
                                        <tr
                                            key={position.id}
                                            className="align-top transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {position.name}
                                                    </span>
                                                    <span className="line-clamp-2 text-xs text-muted-foreground">
                                                        {position.description ||
                                                            'No description provided.'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.grade}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.job_value}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.cg}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {position.skp_point}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-full px-3 py-1 text-xs uppercase"
                                                >
                                                    {position.organization_positions_count}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {position.organization_positions
                                                    .length > 0 ? (
                                                    <div className="space-y-3">
                                                        {position.organization_positions.map(
                                                            (
                                                                organizationPosition,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        organizationPosition.id
                                                                    }
                                                                    className="rounded-xl border bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/30"
                                                                >
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                                                            {organizationPosition
                                                                                .organization
                                                                                ?.name ||
                                                                                '-'}
                                                                        </span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="rounded-full px-2.5 py-0.5 text-[10px] uppercase"
                                                                        >
                                                                            {organizationPosition
                                                                                .organization
                                                                                ?.code ||
                                                                                '-'}
                                                                        </Badge>
                                                                        <Badge
                                                                            variant={
                                                                                organizationPosition.is_active
                                                                                    ? 'default'
                                                                                    : 'secondary'
                                                                            }
                                                                            className="rounded-full px-2.5 py-0.5 text-[10px] uppercase"
                                                                        >
                                                                            {organizationPosition.is_active
                                                                                ? 'Active'
                                                                                : 'Inactive'}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <Building2 className="h-3.5 w-3.5" />
                                                                            Grade:{' '}
                                                                            {
                                                                                organizationPosition.grade
                                                                            }
                                                                        </span>
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <TrendingUp className="h-3.5 w-3.5" />
                                                                            Job
                                                                            Value:{' '}
                                                                            {
                                                                                organizationPosition.job_value
                                                                            }
                                                                        </span>
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <Network className="h-3.5 w-3.5" />
                                                                            CG:{' '}
                                                                            {
                                                                                organizationPosition.cg
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Not assigned to any
                                                        organization.
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

PositionOrganizationPositions.layout = {
    breadcrumbs: [
        {
            title: 'Positions',
            href: positionsIndex(),
        },
        {
            title: 'Organization Positions',
            href: positionsOrganizationPositions(),
        },
    ],
};
