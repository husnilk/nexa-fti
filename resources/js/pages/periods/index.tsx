import { Head, Link, router } from '@inertiajs/react';
import {
    BadgeCheck,
    CalendarClock,
    CalendarRange,
    Eye,
    Pencil,
    Plus,
    Power,
    PowerOff,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import PeriodController from '@/actions/App/Http/Controllers/PeriodController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import { PeriodFormModal } from '@/pages/periods/components/period-form-modal';
import { index as periodsIndex, show as periodShow } from '@/routes/periods';
import type { Period, PeriodOptions } from '@/types/remuneration';

type PageProps = {
    periods: Period[];
    options: PeriodOptions;
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
});

function formatDate(value: string): string {
    return dateFormatter.format(new Date(value));
}

export default function PeriodsIndex({ periods, options }: PageProps) {
    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

    const years = useMemo(
        () => [...new Set(periods.map((p) => p.year))].sort((a, b) => b - a),
        [periods],
    );

    const filteredPeriods = periods.filter((period) => {
        const matchesSearch =
            period.name.toLowerCase().includes(search.toLowerCase()) ||
            (period.description ?? '')
                .toLowerCase()
                .includes(search.toLowerCase());
        const matchesYear =
            yearFilter === 'all' || String(period.year) === yearFilter;
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && period.status === 1) ||
            (statusFilter === 'inactive' && period.status !== 1);

        return matchesSearch && matchesYear && matchesStatus;
    });

    const handleDelete = (period: Period) => {
        if (
            confirm(
                __(
                    'Are you sure you want to delete :name? Its monthly work days and unit allocations will also be deleted.',
                    { name: period.name },
                ),
            )
        ) {
            router.delete(PeriodController.destroy.url(period.id), {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(__('Period deleted successfully')),
            });
        }
    };

    const handleToggleStatus = (period: Period) => {
        router.patch(
            PeriodController.toggleStatus.url(period.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        period.status === 1
                            ? __('Period deactivated')
                            : __('Period activated'),
                    ),
            },
        );
    };

    const totalActive = periods.filter((p) => p.status === 1).length;
    const currentYear = new Date().getFullYear();
    const totalThisYear = periods.filter((p) => p.year === currentYear).length;

    return (
        <>
            <Head title={__('Periods')} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                            {__('Periods')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__(
                                'Manage remuneration periods, their schedules and calculation settings.',
                            )}
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => setIsCreateOpen(true)}
                        className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        {__('Add Period')}
                    </Button>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <CalendarRange className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {__('Total Periods')}
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {periods.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <CalendarClock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {__('This Year (:year)', {
                                        year: currentYear,
                                    })}
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalThisYear}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400">
                                <BadgeCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {__('Active')}
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalActive}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={__('Search periods...')}
                            className="bg-white pl-9 dark:bg-zinc-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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

                    <div className="flex w-full flex-wrap gap-3 md:w-auto">
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <option value="all">{__('All Years')}</option>
                            {years.map((year) => (
                                <option key={year} value={String(year)}>
                                    {year}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <option value="all">{__('All Statuses')}</option>
                            <option value="active">{__('Active')}</option>
                            <option value="inactive">{__('Inactive')}</option>
                        </select>

                        <span className="inline-flex h-10 items-center rounded-full border border-input bg-white px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                            {__(':count records', {
                                count: filteredPeriods.length,
                            })}
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">
                                        {__('Period')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {__('Coverage')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {__('Data Input')}
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
                                {filteredPeriods.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            {__(
                                                'No periods found matching the filters.',
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPeriods.map((period) => (
                                        <tr
                                            key={period.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            {/* Period Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {period.name}
                                                    </span>
                                                    {period.description && (
                                                        <span className="line-clamp-1 text-xs text-muted-foreground">
                                                            {period.description}
                                                        </span>
                                                    )}
                                                    <code className="mt-0.5 font-mono text-[10px] text-violet-600 dark:text-violet-400">
                                                        {period.year} / #
                                                        {period.no}
                                                    </code>
                                                </div>
                                            </td>

                                            {/* Coverage */}
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {formatDate(period.start_date)}{' '}
                                                – {formatDate(period.end_date)}
                                            </td>

                                            {/* Data Input */}
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {formatDate(
                                                    period.input_start_date,
                                                )}{' '}
                                                –{' '}
                                                {formatDate(
                                                    period.input_end_date,
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide capitalize ${
                                                        period.status === 1
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    <BadgeCheck className="h-3 w-3" />
                                                    {period.status === 1
                                                        ? __('Active')
                                                        : __('Inactive')}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={periodShow.url(
                                                            period.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                            title={__('View')}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`h-8 w-8 cursor-pointer ${
                                                            period.status === 1
                                                                ? 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300'
                                                                : 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300'
                                                        }`}
                                                        title={
                                                            period.status === 1
                                                                ? __(
                                                                      'Deactivate',
                                                                  )
                                                                : __('Activate')
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                period,
                                                            )
                                                        }
                                                    >
                                                        {period.status === 1 ? (
                                                            <PowerOff className="h-4 w-4" />
                                                        ) : (
                                                            <Power className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        title={__('Edit')}
                                                        onClick={() =>
                                                            setEditingPeriod(
                                                                period,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                        title={__('Delete')}
                                                        onClick={() =>
                                                            handleDelete(period)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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

            {/* Add Period Modal */}
            <PeriodFormModal
                options={options}
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                period={null}
                onSuccess={() => {
                    setSearch('');
                    setYearFilter('all');
                    setStatusFilter('all');
                }}
            />

            {/* Edit Period Modal */}
            <PeriodFormModal
                options={options}
                open={!!editingPeriod}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingPeriod(null);
                    }
                }}
                period={editingPeriod}
                onSuccess={() => setEditingPeriod(null)}
            />
        </>
    );
}

PeriodsIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Periods'), href: periodsIndex() },
    ],
};
