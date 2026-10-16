import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarRange,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ValidatorController from '@/actions/App/Http/Controllers/ValidatorController';
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
import { index as periodsIndex } from '@/routes/periods';
import { index as validatorIndex } from '@/routes/validators';
import type { Validator } from '@/types/remuneration';
import ValidatorFormModal, {
    positionLabels,
} from './components/validator-form-modal';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    activePeriod: { id: string; name: string; year: number } | null;
    validators: {
        data: Validator[];
        links: PaginationLink[];
        from: number | null;
        to: number | null;
        total: number;
    };
    employees: { id: string; name: string; emp_number: string }[];
    organizations: { id: string; name: string }[];
    filters: {
        search?: string | null;
        organization_id?: string | null;
    };
};

function paginationLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

export default function ValidatorIndex({
    activePeriod,
    validators,
    employees = [],
    organizations = [],
    filters,
}: PageProps) {
    const { errors } = usePage().props as { errors: Record<string, string> };

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Validator | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [deleting, setDeleting] = useState<Validator | null>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [organizationId, setOrganizationId] = useState(
        filters.organization_id || '',
    );
    const debouncedSearch = useDebounce(search, 500);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        router.get(
            validatorIndex(),
            { search: debouncedSearch, organization_id: organizationId },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, organizationId]);

    function openForm(validator: Validator | null): void {
        setEditing(validator);
        setFormKey((key) => key + 1);
        setModalOpen(true);
    }

    function destroyValidator(): void {
        if (!deleting) {
            return;
        }

        router.delete(ValidatorController.destroy.url(deleting.id), {
            preserveScroll: true,
            onSuccess: () => setDeleting(null),
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Validators')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Validators')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Employees who validate performance claims for each organization in the active period.',
                        )}
                    </p>
                </div>
                <Button
                    onClick={() => openForm(null)}
                    disabled={!activePeriod}
                    className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                >
                    <Plus className="h-4 w-4" /> {__('Add Validator')}
                </Button>
            </div>

            {activePeriod ? (
                <div className="flex items-center gap-2 rounded-xl border bg-indigo-50 px-4 py-3 text-sm text-indigo-800 dark:border-zinc-800 dark:bg-indigo-950/35 dark:text-indigo-300">
                    <CalendarRange className="h-4 w-4" />
                    {__('Active period:')}{' '}
                    <span className="font-semibold">{activePeriod.name}</span>
                </div>
            ) : (
                <div className="flex items-center gap-2 rounded-xl border bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-zinc-800 dark:bg-amber-950/35 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    {__('There is no active period.')}{' '}
                    <Link
                        href={periodsIndex()}
                        className="font-semibold underline"
                    >
                        {__('Activate a period')}
                    </Link>{' '}
                    {__('to manage validators.')}
                </div>
            )}

            {errors.period && (
                <p className="text-sm text-destructive">{errors.period}</p>
            )}

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search name, NIP or organization...')}
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
                    aria-label={__('Filter by organization')}
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    className="h-10 w-full rounded-md border bg-white px-3 text-sm text-zinc-700 md:w-auto dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                    <option value="">{__('All organizations')}</option>
                    {organizations.map((organization) => (
                        <option key={organization.id} value={organization.id}>
                            {organization.name}
                        </option>
                    ))}
                </select>
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
                                <th className="px-6 py-4">
                                    {__('Organization')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Position')}
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
                            {validators.data.length > 0 ? (
                                validators.data.map((validator) => (
                                    <tr
                                        key={validator.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {validator.employee?.emp_number}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {validator.employee?.name}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {validator.organization?.name ??
                                                __('All organizations')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${
                                                    validator.position === 1
                                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400'
                                                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                }`}
                                            >
                                                {positionLabels[
                                                    validator.position
                                                ] ?? validator.position}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${
                                                    validator.is_active
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400'
                                                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400'
                                                }`}
                                            >
                                                {validator.is_active
                                                    ? __('Active')
                                                    : __('Inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    onClick={() =>
                                                        openForm(validator)
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        setDeleting(validator)
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No validators found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {validators.total > 0 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-4 text-sm text-muted-foreground sm:flex-row dark:border-zinc-800">
                        <span>
                            {__('Showing :from–:to of :total', {
                                from: validators.from,
                                to: validators.to,
                                total: validators.total,
                            })}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {validators.links.map((link, i) =>
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

            {activePeriod && (
                <ValidatorFormModal
                    key={formKey}
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    validator={editing}
                    periodName={activePeriod.name}
                    employees={employees}
                    organizations={organizations}
                />
            )}

            <Dialog
                open={deleting !== null}
                onOpenChange={(open) => !open && setDeleting(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Remove Validator')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground italic">
                        {deleting?.organization
                            ? __(
                                  'Remove :name as a validator for :organization?',
                                  {
                                      name: deleting?.employee?.name,
                                      organization: deleting.organization.name,
                                  },
                              )
                            : __('Remove :name as a validator?', {
                                  name: deleting?.employee?.name,
                              })}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleting(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyValidator}
                            className="cursor-pointer"
                        >
                            {__('Remove')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

ValidatorIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Validators'), href: validatorIndex() },
    ],
};
