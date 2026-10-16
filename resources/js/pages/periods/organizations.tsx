import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    Pencil,
    RefreshCw,
    Search,
    Wallet,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import PeriodOrganizationController from '@/actions/App/Http/Controllers/PeriodOrganizationController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import { PeriodOrganizationFormModal } from '@/pages/periods/components/period-organization-form-modal';
import { index as periodsIndex, show as periodShow } from '@/routes/periods';
import type {
    Period,
    PeriodOrganization,
    PeriodOrganizationOptions,
    SelectOption,
} from '@/types/remuneration';

type PageProps = {
    period: Pick<Period, 'id' | 'name' | 'year' | 'no' | 'status' | 'pir'>;
    periodOrganizations: PeriodOrganization[];
    unsyncedCount: number;
    options: PeriodOrganizationOptions;
};

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat(intlLocale(), {
    maximumFractionDigits: 2,
});

function optionLabel(choices: SelectOption[], value: number): string {
    return (
        choices.find((choice) => String(choice.value) === String(value))
            ?.label ?? String(value)
    );
}

export default function PeriodOrganizationsIndex({
    period,
    periodOrganizations,
    unsyncedCount,
    options,
}: PageProps) {
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('all');
    const [finalizationFilter, setFinalizationFilter] = useState('all');
    const [syncing, setSyncing] = useState(false);
    const [editing, setEditing] = useState<PeriodOrganization | null>(null);

    const filtered = periodOrganizations.filter((row) => {
        const term = search.toLowerCase();
        const matchesSearch =
            row.organization.name.toLowerCase().includes(term) ||
            row.organization.code.toLowerCase().includes(term);
        const matchesStage =
            stageFilter === 'all' || String(row.stage) === stageFilter;
        const matchesFinalization =
            finalizationFilter === 'all' ||
            String(row.finalization_state) === finalizationFilter;

        return matchesSearch && matchesStage && matchesFinalization;
    });

    const totalPagu = periodOrganizations.reduce(
        (sum, row) => sum + Number(row.pagu),
        0,
    );
    const totalFinalized = periodOrganizations.filter(
        (row) => row.finalization_state !== 0,
    ).length;

    const handleSync = () => {
        router.post(
            PeriodOrganizationController.sync.url(period.id),
            {},
            {
                preserveScroll: true,
                onStart: () => setSyncing(true),
                onFinish: () => setSyncing(false),
                onSuccess: () =>
                    toast.success(
                        __('Organizations added to the period: :count', {
                            count: unsyncedCount,
                        }),
                    ),
            },
        );
    };

    return (
        <>
            <Head title={__('Organizations: :name', { name: period.name })} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={periodShow.url(period.id)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />{' '}
                            {__('Back to :name', { name: period.name })}
                        </Link>
                        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                            {__('Period Organizations')}
                        </h1>
                        <p className="text-muted-foreground">
                            {__(
                                'Budget (pagu) and status of each budget-holding organization in :period.',
                                { period: period.name },
                            )}
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={handleSync}
                        disabled={unsyncedCount === 0 || syncing}
                        className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                        title={
                            unsyncedCount === 0
                                ? __(
                                      'All budget-holding organizations are already in this period',
                                  )
                                : undefined
                        }
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
                        />
                        {__('Sync Organizations')}
                        {unsyncedCount > 0 && (
                            <span className="rounded-full bg-white/20 px-2 text-xs">
                                +{unsyncedCount}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {__('Organizations')}
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {periodOrganizations.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {__('Total Pagu')}
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {currencyFormatter.format(totalPagu)}
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
                                    {__('Finalized')}
                                </p>
                                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                    {totalFinalized} /{' '}
                                    {periodOrganizations.length}
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
                            placeholder={__('Search organizations...')}
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
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                            className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <option value="all">{__('All Stages')}</option>
                            {options.stages.map((choice) => (
                                <option
                                    key={choice.value}
                                    value={String(choice.value)}
                                >
                                    {choice.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={finalizationFilter}
                            onChange={(e) =>
                                setFinalizationFilter(e.target.value)
                            }
                            className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <option value="all">
                                {__('All Finalization States')}
                            </option>
                            {options.finalizationStates.map((choice) => (
                                <option
                                    key={choice.value}
                                    value={String(choice.value)}
                                >
                                    {choice.label}
                                </option>
                            ))}
                        </select>

                        <span className="inline-flex h-10 items-center rounded-full border border-input bg-white px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                            {__(':count records', { count: filtered.length })}
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">
                                        {__('Organization')}
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        {__('Pagu')}
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        {__('Unit PIR')}
                                    </th>
                                    <th className="px-6 py-4 text-right">%</th>
                                    <th className="px-6 py-4">
                                        {__('Sharing Method')}
                                    </th>
                                    <th className="px-6 py-4">{__('Stage')}</th>
                                    <th className="px-6 py-4 text-center">
                                        {__('Finalization')}
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        {__('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            {periodOrganizations.length === 0
                                                ? unsyncedCount > 0
                                                    ? __(
                                                          'No organizations yet. Use “Sync Organizations” to add the budget-holding organizations.',
                                                      )
                                                    : __(
                                                          'No organizations are marked as having a pagu. Enable “Has Pagu” on an organization first.',
                                                      )
                                                : __(
                                                      'No organizations found matching the filters.',
                                                  )}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {row.organization.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {row.organization
                                                            .organization_type
                                                            ?.name ?? '-'}
                                                    </span>
                                                    <code className="mt-0.5 font-mono text-[10px] text-violet-600 dark:text-violet-400">
                                                        {row.organization.code}
                                                    </code>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-700 tabular-nums dark:text-zinc-300">
                                                {currencyFormatter.format(
                                                    Number(row.pagu),
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-700 tabular-nums dark:text-zinc-300">
                                                {numberFormatter.format(
                                                    Number(row.pir_unit),
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-700 tabular-nums dark:text-zinc-300">
                                                {numberFormatter.format(
                                                    Number(row.percentage),
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {optionLabel(
                                                    options.sharingMethods,
                                                    row.sharing_method,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {optionLabel(
                                                    options.stages,
                                                    row.stage,
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${
                                                        row.finalization_state !==
                                                        0
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    <BadgeCheck className="h-3 w-3" />
                                                    {optionLabel(
                                                        options.finalizationStates,
                                                        row.finalization_state,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        title={__('Edit')}
                                                        onClick={() =>
                                                            setEditing(row)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
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

            <PeriodOrganizationFormModal
                open={!!editing}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditing(null);
                    }
                }}
                periodId={period.id}
                periodOrganization={editing}
                options={options}
            />
        </>
    );
}

PeriodOrganizationsIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Periods'), href: periodsIndex() },
        { title: __('Organizations'), href: '' },
    ],
};
