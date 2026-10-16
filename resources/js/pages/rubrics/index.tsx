import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    Building2,
    ChevronDown,
    ClipboardList,
    Eye,
    FolderTree,
    Pencil,
    Plus,
    Power,
    PowerOff,
    Search,
    Settings,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import RubricController from '@/actions/App/Http/Controllers/RubricController';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { __ } from '@/lib/i18n';
import { index as rubricCategoriesIndex } from '@/routes/rubric-categories';
import { index as rubricRegulationsIndex } from '@/routes/rubric-regulations';
import {
    create as rubricCreate,
    edit as rubricEdit,
    index as rubricsIndex,
    show as rubricShow,
} from '@/routes/rubrics';
import type { Auth } from '@/types';
import type {
    Rubric,
    RubricCategory,
    RubricRegulation,
} from '@/types/remuneration';

type PageProps = {
    auth: Auth;
    rubrics: Rubric[];
    categories: RubricCategory[];
    regulations: RubricRegulation[];
    filters: {
        regulation_status: 'active' | 'all';
    };
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function RubricsIndex({
    rubrics,
    categories,
    regulations,
    filters,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [regulationFilter, setRegulationFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const mayManage = can(auth, 'rubric.manage');

    const handleRegulationStatusChange = (value: string) => {
        setRegulationFilter('all');
        router.get(
            rubricsIndex.url({
                query: value === 'all' ? { regulation_status: 'all' } : {},
            }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const filteredRubrics = rubrics.filter((rubric) => {
        const term = search.toLowerCase();
        const matchesSearch =
            rubric.code.toLowerCase().includes(term) ||
            rubric.activity.toLowerCase().includes(term);
        const matchesCategory =
            categoryFilter === 'all' ||
            rubric.rubric_category_id === categoryFilter;
        const matchesRegulation =
            regulationFilter === 'all' ||
            rubric.rubric_regulation_id === regulationFilter;
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && rubric.is_active === 1) ||
            (statusFilter === 'inactive' && rubric.is_active !== 1);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesRegulation &&
            matchesStatus
        );
    });

    const handleDelete = (rubric: Rubric) => {
        if (
            confirm(
                __(
                    'Are you sure you want to delete rubric :code? Its positions and availability settings will also be deleted.',
                    { code: rubric.code },
                ),
            )
        ) {
            router.delete(RubricController.destroy.url(rubric.id), {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(__('Rubric deleted successfully')),
            });
        }
    };

    const handleToggleStatus = (rubric: Rubric) => {
        router.patch(
            RubricController.toggleStatus.url(rubric.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        rubric.is_active === 1
                            ? __('Rubric deactivated')
                            : __('Rubric activated'),
                    ),
            },
        );
    };

    const totalActive = rubrics.filter((r) => r.is_active === 1).length;
    const totalRestricted = rubrics.filter(
        (r) => (r.organizations_count ?? 0) > 0,
    ).length;

    const selectClassName =
        'h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900';

    return (
        <>
            <Head title={__('Rubrics')} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                            {__('Rubrics')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__(
                                'Manage performance activities, their points and who may claim them.',
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer gap-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    {__('Settings')}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                                    {__('Rubric Configuration')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={rubricCategoriesIndex()}
                                        className="w-full cursor-pointer"
                                    >
                                        {__('Categories')}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={rubricRegulationsIndex()}
                                        className="w-full cursor-pointer"
                                    >
                                        {__('Regulations')}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {mayManage && (
                            <Button
                                asChild
                                className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                            >
                                <Link href={rubricCreate()}>
                                    <Plus className="h-4 w-4" />
                                    {__('Add Rubric')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: __('Total Rubrics'),
                            value: rubrics.length,
                            icon: ClipboardList,
                            tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950/35 dark:text-violet-400',
                        },
                        {
                            label: __('Categories'),
                            value: categories.length,
                            icon: FolderTree,
                            tone: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/35 dark:text-indigo-400',
                        },
                        {
                            label: __('Organization-Restricted'),
                            value: totalRestricted,
                            icon: Building2,
                            tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950/35 dark:text-amber-400',
                        },
                        {
                            label: __('Active'),
                            value: totalActive,
                            icon: BadgeCheck,
                            tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-400',
                        },
                    ].map((metric) => (
                        <div
                            key={metric.label}
                            className="rounded-2xl border bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-xl p-2.5 ${metric.tone}`}
                                >
                                    <metric.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {metric.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                                        {metric.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={__('Search by code or activity...')}
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
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className={selectClassName}
                        >
                            <option value="all">{__('All Categories')}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.regulation_status}
                            onChange={(e) =>
                                handleRegulationStatusChange(e.target.value)
                            }
                            className={selectClassName}
                            title={__('Regulation status')}
                        >
                            <option value="active">
                                {__('Active Regulations')}
                            </option>
                            <option value="all">
                                {__('All Regulations (incl. inactive)')}
                            </option>
                        </select>

                        <select
                            value={regulationFilter}
                            onChange={(e) =>
                                setRegulationFilter(e.target.value)
                            }
                            className={selectClassName}
                        >
                            <option value="all">{__('All Regulations')}</option>
                            {regulations.map((regulation) => (
                                <option
                                    key={regulation.id}
                                    value={regulation.id}
                                >
                                    {regulation.regulation_number}/
                                    {regulation.regulation_year} —{' '}
                                    {regulation.name}
                                    {regulation.is_active !== 1 &&
                                        __(' (inactive)')}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={selectClassName}
                        >
                            <option value="all">{__('All Statuses')}</option>
                            <option value="active">{__('Active')}</option>
                            <option value="inactive">{__('Inactive')}</option>
                        </select>

                        <span className="inline-flex h-10 items-center rounded-full border border-input bg-white px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                            {__(':count records', {
                                count: filteredRubrics.length,
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
                                        {__('Rubric')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {__('Category')}
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        {__('Positions')}
                                    </th>
                                    <th className="px-6 py-4">
                                        {__('Availability')}
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
                                {filteredRubrics.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            {__(
                                                'No rubrics found matching the filters.',
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRubrics.map((rubric) => (
                                        <tr
                                            key={rubric.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            {/* Rubric Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {rubric.activity}
                                                    </span>
                                                    {rubric.regulation && (
                                                        <span className="line-clamp-1 text-xs text-muted-foreground">
                                                            {
                                                                rubric
                                                                    .regulation
                                                                    .name
                                                            }
                                                            {rubric.regulation
                                                                .is_active !==
                                                                1 && (
                                                                <span className="ml-1.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 uppercase dark:bg-amber-950/35 dark:text-amber-400">
                                                                    {__(
                                                                        'Inactive regulation',
                                                                    )}
                                                                </span>
                                                            )}
                                                        </span>
                                                    )}
                                                    <code className="mt-0.5 font-mono text-[10px] text-violet-600 dark:text-violet-400">
                                                        {rubric.code}
                                                    </code>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                                {rubric.category?.name ?? '-'}
                                            </td>

                                            {/* Positions */}
                                            <td className="px-6 py-4 text-center text-zinc-700 dark:text-zinc-300">
                                                {rubric.details_count ?? 0}
                                            </td>

                                            {/* Availability */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                                    <span>
                                                        {rubric.organizations_count
                                                            ? __(
                                                                  ':count organization(s)',
                                                                  {
                                                                      count: rubric.organizations_count,
                                                                  },
                                                              )
                                                            : __(
                                                                  'All organizations',
                                                              )}
                                                    </span>
                                                    <span>
                                                        {__(
                                                            ':count employment type(s)',
                                                            {
                                                                count:
                                                                    rubric.employment_types_count ??
                                                                    0,
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide capitalize ${
                                                        rubric.is_active === 1
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                >
                                                    <BadgeCheck className="h-3 w-3" />
                                                    {rubric.is_active === 1
                                                        ? __('Active')
                                                        : __('Inactive')}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={rubricShow.url(
                                                            rubric.id,
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
                                                    {mayManage && (
                                                        <>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`h-8 w-8 cursor-pointer ${
                                                                    rubric.is_active ===
                                                                    1
                                                                        ? 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300'
                                                                        : 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300'
                                                                }`}
                                                                title={
                                                                    rubric.is_active ===
                                                                    1
                                                                        ? __(
                                                                              'Deactivate',
                                                                          )
                                                                        : __(
                                                                              'Activate',
                                                                          )
                                                                }
                                                                onClick={() =>
                                                                    handleToggleStatus(
                                                                        rubric,
                                                                    )
                                                                }
                                                            >
                                                                {rubric.is_active ===
                                                                1 ? (
                                                                    <PowerOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Power className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Link
                                                                href={rubricEdit.url(
                                                                    rubric.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                    title={__(
                                                                        'Edit',
                                                                    )}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                                title={__(
                                                                    'Delete',
                                                                )}
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        rubric,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
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
        </>
    );
}

RubricsIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Rubrics'), href: rubricsIndex() },
    ],
};
