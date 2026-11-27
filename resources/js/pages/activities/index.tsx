import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ActivityController from '@/actions/App/Http/Controllers/ActivityController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { __ } from '@/lib/i18n';
import {
    create as activityCreate,
    edit as activityEdit,
    index as activityIndex,
    show as activityShow,
} from '@/routes/activities';
import type { Auth } from '@/types';
import type { Activity, EptPeriodOption } from '@/types/remuneration';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    auth: Auth;
    activities: {
        data: Activity[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    periods: EptPeriodOption[];
    filters: {
        search?: string | null;
        period_id?: string | null;
    };
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

function paginationLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

export default function ActivityIndex({
    activities,
    periods = [],
    filters,
}: PageProps) {
    const { auth, errors } = usePage<
        PageProps & { errors: Record<string, string> }
    >().props;
    const mayManage = can(auth, 'activity.manage');
    const [deletingActivity, setDeletingActivity] = useState<Activity | null>(
        null,
    );

    const [search, setSearch] = useState(filters.search || '');
    const [periodId, setPeriodId] = useState(filters.period_id || '');
    const debouncedSearch = useDebounce(search, 500);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        router.get(
            activityIndex(),
            { search: debouncedSearch, period_id: periodId },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, periodId]);

    function destroyActivity(): void {
        if (!deletingActivity) {
            return;
        }

        router.delete(ActivityController.destroy.url(deletingActivity.id), {
            preserveScroll: true,
            onFinish: () => setDeletingActivity(null),
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Activities')} />

            {errors.activity && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-400">
                    {errors.activity}
                </p>
            )}

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Activities')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Employee activities scored by rubric, with the employees involved and their evidence.',
                        )}
                    </p>
                </div>
                {mayManage && (
                    <Link href={activityCreate()}>
                        <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700">
                            <Plus className="h-4 w-4" /> {__('Add Activity')}
                        </Button>
                    </Link>
                )}
            </div>

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

                <select
                    aria-label={__('Filter by period')}
                    value={periodId}
                    onChange={(e) => setPeriodId(e.target.value)}
                    className="h-10 w-full rounded-md border bg-white px-3 text-sm text-zinc-700 md:w-auto dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                    <option value="">{__('All periods')}</option>
                    {periods.map((period) => (
                        <option key={period.id} value={period.id}>
                            {period.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Activity')}</th>
                                <th className="px-6 py-4">{__('Rubric')}</th>
                                <th className="px-6 py-4">{__('Period')}</th>
                                <th className="px-6 py-4">
                                    {__('Organization')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Employees')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Evidence')}
                                </th>
                                <th className="px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {activities.data.length > 0 ? (
                                activities.data.map((activity) => (
                                    <tr
                                        key={activity.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
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
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {activity.period?.name}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {activity.organization?.name ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 font-mono text-zinc-700 dark:text-zinc-300">
                                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                {activity.performances_count ??
                                                    0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {activity.shared_performance_evidence ? (
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400">
                                                    {__('Shared')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                                                    {__('Per employee')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={activityShow.url(
                                                        activity.id,
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
                                                    <>
                                                        <Link
                                                            href={activityEdit.url(
                                                                activity.id,
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            onClick={() =>
                                                                setDeletingActivity(
                                                                    activity,
                                                                )
                                                            }
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No activities found.')}
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

            <Dialog
                open={deletingActivity !== null}
                onOpenChange={(open) => !open && setDeletingActivity(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Activity')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground italic">
                        {__(
                            'Delete ":name"? Its :count employee record(s) will no longer be shown.',
                            {
                                name: deletingActivity?.name,
                                count:
                                    deletingActivity?.performances_count ?? 0,
                            },
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingActivity(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyActivity}
                            className="cursor-pointer"
                        >
                            {__('Delete Activity')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

ActivityIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Activities'), href: activityIndex() },
    ],
};
