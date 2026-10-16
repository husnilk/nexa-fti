import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import EptController from '@/actions/App/Http/Controllers/EptController';
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
import { index as eptIndex, show as eptShow } from '@/routes/epts';
import type { Auth } from '@/types';
import type { Ept, EptEmployee, EptPeriodOption } from '@/types/remuneration';
import EptFormModal from './components/ept-form-modal';
import {
    monthRange,
    predicateBadgeClass,
    predicateLabels,
    statusBadgeClass,
    statusLabels,
} from './components/ept-options';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    auth: Auth;
    epts: {
        data: Ept[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    employees: EptEmployee[];
    periods: EptPeriodOption[];
    filters: {
        search?: string | null;
        period_id?: string | null;
        status?: string | null;
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

export default function EptIndex({
    epts,
    employees = [],
    periods = [],
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayManage = can(auth, 'ept.manage');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingEpt, setEditingEpt] = useState<Ept | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [deletingEpt, setDeletingEpt] = useState<Ept | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [periodId, setPeriodId] = useState(filters.period_id || '');
    const [status, setStatus] = useState(filters.status ?? '');
    const debouncedSearch = useDebounce(search, 500);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        router.get(
            eptIndex(),
            { search: debouncedSearch, period_id: periodId, status },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, periodId, status]);

    function openForm(ept: Ept | null): void {
        setEditingEpt(ept);
        setFormKey((key) => key + 1);
        setModalOpen(true);
    }

    function destroyEpt(): void {
        if (!deletingEpt) {
            return;
        }

        router.delete(EptController.destroy.url(deletingEpt.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingEpt(null),
        });
    }

    const selectClass =
        'h-10 rounded-md border bg-white dark:bg-zinc-900 dark:border-zinc-800 px-3 text-sm text-zinc-700 dark:text-zinc-300';

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Performance Targets')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Performance Targets')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Employee performance targets (SKP) per period: appraisers, behaviour scores, ratings, and predicates.',
                        )}
                    </p>
                </div>
                {mayManage && (
                    <Button
                        onClick={() => openForm(null)}
                        className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                    >
                        <Plus className="h-4 w-4" /> {__('Add Target')}
                    </Button>
                )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search employees...')}
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

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <select
                        aria-label={__('Filter by period')}
                        value={periodId}
                        onChange={(e) => setPeriodId(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">{__('All periods')}</option>
                        {periods.map((period) => (
                            <option key={period.id} value={period.id}>
                                {period.name}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label={__('Filter by status')}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">{__('All statuses')}</option>
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Emp #')}</th>
                                <th className="px-6 py-4">
                                    {__('Employee Name')}
                                </th>
                                <th className="px-6 py-4">{__('Period')}</th>
                                <th className="px-6 py-4">{__('Months')}</th>
                                <th className="px-6 py-4">{__('Appraiser')}</th>
                                <th className="px-6 py-4 text-center">
                                    {__('Achievement')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Predicate')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {epts.data.length > 0 ? (
                                epts.data.map((ept) => (
                                    <tr
                                        key={ept.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {ept.employee?.emp_number}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {ept.employee?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {ept.period?.name}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {monthRange(ept)} {ept.year}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {ept.appraiser?.name ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-zinc-700 dark:text-zinc-300">
                                            {ept.skp_achievement !== null
                                                ? `${ept.skp_achievement}%`
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {ept.performance_predicate ? (
                                                <span
                                                    className={predicateBadgeClass(
                                                        ept.performance_predicate,
                                                    )}
                                                >
                                                    {
                                                        predicateLabels[
                                                            ept
                                                                .performance_predicate
                                                        ]
                                                    }
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={statusBadgeClass(
                                                    ept.status,
                                                )}
                                            >
                                                {statusLabels[ept.status ?? 0]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={eptShow.url(ept.id)}
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
                                                        <Button
                                                            onClick={() =>
                                                                openForm(ept)
                                                            }
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                setDeletingEpt(
                                                                    ept,
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
                                        colSpan={9}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No performance targets found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {epts.total > 0 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-4 text-sm text-muted-foreground sm:flex-row dark:border-zinc-800">
                        <span>
                            {__('Showing :from–:to of :total', {
                                from: epts.from,
                                to: epts.to,
                                total: epts.total,
                            })}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {epts.links.map((link, i) =>
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

            {mayManage && (
                <EptFormModal
                    key={formKey}
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    ept={editingEpt}
                    employees={employees}
                    periods={periods}
                />
            )}

            <Dialog
                open={deletingEpt !== null}
                onOpenChange={(open) => !open && setDeletingEpt(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Delete Performance Target')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground italic">
                        {__(
                            'Are you sure you want to delete the performance target for :employee in :period?',
                            {
                                employee: deletingEpt?.employee?.name,
                                period: deletingEpt?.period?.name,
                            },
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingEpt(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyEpt}
                            className="cursor-pointer"
                        >
                            {__('Delete Target')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

EptIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Performance Targets'), href: eptIndex() },
    ],
};
