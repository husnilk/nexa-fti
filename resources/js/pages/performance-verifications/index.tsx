import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarRange,
    ChevronRight,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';
import { __ } from '@/lib/i18n';
import {
    index as verificationIndex,
    show as verificationShow,
} from '@/routes/performance-verifications';
import type { Activity, EptPeriodOption } from '@/types/remuneration';

type VerificationActivity = Activity & {
    verifiable_count: number;
    pending_count: number;
    approved_count: number;
    rejected_count: number;
    returned_count: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    activities: {
        data: VerificationActivity[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    activePeriod: EptPeriodOption | null;
    filters: {
        search?: string | null;
        pending?: boolean;
    };
};

function paginationLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

function Count({ value, className }: { value: number; className: string }) {
    return (
        <span
            className={`font-mono ${value > 0 ? className : 'text-muted-foreground'}`}
        >
            {value}
        </span>
    );
}

export default function VerificationIndex({
    activities,
    activePeriod,
    filters,
}: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [pendingOnly, setPendingOnly] = useState(Boolean(filters.pending));
    const debouncedSearch = useDebounce(search, 500);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        router.get(
            verificationIndex(),
            {
                search: debouncedSearch,
                pending: pendingOnly ? 1 : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, pendingOnly]);

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Performance Verification')} />

            <div className="border-b pb-5 dark:border-zinc-800">
                <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                    {__('Performance Verification')}
                </h1>
                <p className="mt-1 text-muted-foreground">
                    {__(
                        "Activities you verify. Open one to approve, reject or return the employees' performances.",
                    )}
                </p>
            </div>

            {activePeriod ? (
                <div className="flex items-center gap-2 rounded-xl border bg-indigo-50 px-4 py-3 text-sm text-indigo-800 dark:border-zinc-800 dark:bg-indigo-950/35 dark:text-indigo-300">
                    <CalendarRange className="h-4 w-4" />
                    {__('Verifying activities in the active period:')}{' '}
                    <span className="font-semibold">{activePeriod.name}</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 rounded-xl border bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-zinc-800 dark:bg-amber-950/35 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    {__(
                        'There is no active period, so there is nothing to verify.',
                    )}
                </div>
            )}

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search activity or document no...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full flex-wrap items-center gap-4 md:w-auto">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="pending"
                            checked={pendingOnly}
                            onCheckedChange={(checked) =>
                                setPendingOnly(checked === true)
                            }
                        />
                        <Label htmlFor="pending">{__('Pending only')}</Label>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Activity')}</th>
                                <th className="px-6 py-4">{__('Rubric')}</th>
                                <th className="px-6 py-4 text-center">
                                    {__('To Verify')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Pending')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Approved')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Rejected')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Returned')}
                                </th>
                                <th className="px-6 py-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {activities.data.length > 0 ? (
                                activities.data.map((activity) => (
                                    <tr
                                        key={activity.id}
                                        onClick={() =>
                                            router.visit(
                                                verificationShow.url(
                                                    activity.id,
                                                ),
                                            )
                                        }
                                        className="cursor-pointer transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="block font-semibold text-zinc-900 dark:text-zinc-50">
                                                {activity.name}
                                            </span>
                                            {activity.document_number && (
                                                <span className="text-xs text-muted-foreground">
                                                    {activity.document_number}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {activity.rubric?.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-zinc-700 dark:text-zinc-300">
                                            {activity.verifiable_count}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Count
                                                value={activity.pending_count}
                                                className="font-semibold text-indigo-700 dark:text-indigo-400"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Count
                                                value={activity.approved_count}
                                                className="text-emerald-700 dark:text-emerald-400"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Count
                                                value={activity.rejected_count}
                                                className="text-rose-700 dark:text-rose-400"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Count
                                                value={activity.returned_count}
                                                className="text-amber-700 dark:text-amber-400"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={verificationShow.url(
                                                    activity.id,
                                                )}
                                                aria-label={__('Open :name', {
                                                    name: activity.name,
                                                })}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No activities to verify.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {activities.total > 0 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-4 text-sm text-muted-foreground sm:flex-row dark:border-zinc-800">
                        <span>
                            {__('Showing :from–:to of :total', {
                                from: activities.from,
                                to: activities.to,
                                total: activities.total,
                            })}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {activities.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                    >
                                        <Button
                                            variant={
                                                link.active
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className="cursor-pointer"
                                        >
                                            {paginationLabel(link.label)}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        key={i}
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        {paginationLabel(link.label)}
                                    </Button>
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

VerificationIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Verification'), href: verificationIndex() },
    ],
};
