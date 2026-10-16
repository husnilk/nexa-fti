import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    ChevronRight,
    Calculator,
    CalendarDays,
    CalendarRange,
    CheckCircle2,
    FileText,
    Pencil,
    Plus,
    Power,
    PowerOff,
    Trash2,
    XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import PeriodController from '@/actions/App/Http/Controllers/PeriodController';
import PeriodMonthController from '@/actions/App/Http/Controllers/PeriodMonthController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { __, intlLocale } from '@/lib/i18n';
import { PeriodFormModal } from '@/pages/periods/components/period-form-modal';
import {
    monthName,
    PeriodMonthFormModal,
} from '@/pages/periods/components/period-month-form-modal';
import { index as periodOrganizationsIndex } from '@/routes/period-organizations';
import { index as periodsIndex } from '@/routes/periods';
import type {
    Period,
    PeriodMonth,
    PeriodOptions,
    SelectOption,
} from '@/types/remuneration';

type PageProps = {
    period: Period;
    options: PeriodOptions;
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
});

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat(intlLocale(), {
    maximumFractionDigits: 2,
});

function formatDate(value: string): string {
    return dateFormatter.format(new Date(value));
}

function optionLabel(choices: SelectOption[], value: string | number): string {
    return (
        choices.find((choice) => String(choice.value) === String(value))
            ?.label ?? String(value)
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <Label className="text-xs text-muted-foreground uppercase">
                {label}
            </Label>
            <p className="text-sm font-medium">{children}</p>
        </div>
    );
}

function Flag({ label, enabled }: { label: string; enabled: boolean }) {
    return (
        <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            <span>{label}</span>
            {enabled ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" /> {__('Yes')}
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <XCircle className="size-4" /> {__('No')}
                </span>
            )}
        </div>
    );
}

export default function PeriodShow({ period, options }: PageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingMonth, setIsAddingMonth] = useState(false);
    const [editingMonth, setEditingMonth] = useState<PeriodMonth | null>(null);
    const months = period.months ?? [];
    const totalWorkdays = months.reduce((sum, m) => sum + m.workdays, 0);

    const handleDeleteMonth = (periodMonth: PeriodMonth) => {
        if (
            confirm(
                __('Remove :month from this period?', {
                    month: monthName(periodMonth.month),
                }),
            )
        ) {
            router.delete(
                PeriodMonthController.destroy.url({
                    period: period.id,
                    month: periodMonth.id,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () =>
                        toast.success(__('Month removed successfully')),
                },
            );
        }
    };
    const isActive = period.status === 1;

    const schedule = [
        {
            label: __('Period Coverage'),
            start: period.start_date,
            end: period.end_date,
            color: 'bg-violet-500',
        },
        {
            label: __('Data Input'),
            start: period.input_start_date,
            end: period.input_end_date,
            color: 'bg-indigo-500',
        },
        {
            label: __('Verification'),
            start: period.verification_start_date,
            end: period.verification_end_date,
            color: 'bg-amber-500',
        },
        {
            label: __('Validation'),
            start: period.validation_start_date,
            end: period.validation_end_date,
            color: 'bg-emerald-500',
        },
    ];

    const handleToggleStatus = () => {
        router.patch(
            PeriodController.toggleStatus.url(period.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        isActive
                            ? __('Period deactivated')
                            : __('Period activated'),
                    ),
            },
        );
    };

    const handleDelete = () => {
        if (
            confirm(
                __(
                    'Are you sure you want to delete :name? Its monthly work days and unit allocations will also be deleted.',
                    { name: period.name },
                ),
            )
        ) {
            router.delete(PeriodController.destroy.url(period.id), {
                onSuccess: () =>
                    toast.success(__('Period deleted successfully')),
            });
        }
    };

    return (
        <>
            <Head title={__('Period: :name', { name: period.name })} />
            <div className="mx-auto flex h-full max-w-7xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={periodsIndex()}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />{' '}
                            {__('Back to Periods')}
                        </Link>
                        <Heading
                            title={period.name}
                            description={__('Year :year • Period #:no', {
                                year: period.year,
                                no: period.no,
                            })}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={isActive ? 'default' : 'secondary'}
                            className="h-8 px-3 uppercase"
                        >
                            {isActive ? __('Active') : __('Inactive')}
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleToggleStatus}
                        >
                            {isActive ? (
                                <>
                                    <PowerOff className="mr-1 size-4" />{' '}
                                    {__('Deactivate')}
                                </>
                            ) : (
                                <>
                                    <Power className="mr-1 size-4" />{' '}
                                    {__('Activate')}
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="mr-1 size-4" /> {__('Edit')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-1 size-4" /> {__('Delete')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Left Column: Summary */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="flex flex-col items-center rounded-lg border bg-card p-6 text-center shadow-sm">
                            <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-muted">
                                <CalendarRange className="size-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">{period.name}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {formatDate(period.start_date)} –{' '}
                                {formatDate(period.end_date)}
                            </p>
                            <div className="grid w-full grid-cols-2 gap-4 border-t pt-4 text-left">
                                <Field label={__('Year')}>{period.year}</Field>
                                <Field label={__('Period No.')}>
                                    {period.no}
                                </Field>
                                <Field label={__('Months Set Up')}>
                                    {period.months_count ?? 0}
                                </Field>
                                <Field label={__('Units Allocated')}>
                                    {period.organizations_count ?? 0}
                                </Field>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h4 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                <Building2 className="size-4" />{' '}
                                {__('Organizations')}
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label={__('Budget Holders')}>
                                    {period.organizations_count ?? 0}
                                </Field>
                                <Field label={__('Total Pagu')}>
                                    {currencyFormatter.format(
                                        Number(
                                            period.organizations_sum_pagu ?? 0,
                                        ),
                                    )}
                                </Field>
                            </div>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full justify-between"
                            >
                                <Link
                                    href={periodOrganizationsIndex.url(
                                        period.id,
                                    )}
                                >
                                    {__('Manage Organizations')}
                                    <ChevronRight className="size-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h4 className="flex items-center gap-2 border-b pb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                <FileText className="size-4" />{' '}
                                {__('Description')}
                            </h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {period.description ||
                                    __('No description provided.')}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Schedule */}
                        <div className="rounded-lg border border-t-4 border-t-violet-500 bg-card p-6 shadow-sm">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                                <CalendarRange className="size-5 text-violet-500" />
                                {__('Schedule')}
                            </h3>
                            <ol className="relative space-y-6 border-l pl-6">
                                {schedule.map((step) => (
                                    <li key={step.label} className="relative">
                                        <span
                                            className={`absolute top-1.5 -left-[29px] size-2.5 rounded-full ring-4 ring-background ${step.color}`}
                                        />
                                        <p className="text-sm font-semibold">
                                            {step.label}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(step.start)} –{' '}
                                            {formatDate(step.end)}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Months */}
                        <div className="rounded-lg border border-t-4 border-t-sky-500 bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-semibold">
                                    <CalendarDays className="size-5 text-sky-500" />
                                    {__('Months')}
                                </h3>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-900 dark:hover:bg-sky-950/40"
                                    onClick={() => setIsAddingMonth(true)}
                                    disabled={months.length >= 12}
                                >
                                    <Plus className="mr-1 size-4" />{' '}
                                    {__('Add Month')}
                                </Button>
                            </div>
                            {months.length === 0 ? (
                                <p className="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
                                    {__(
                                        'No months have been added to this period yet.',
                                    )}
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b text-xs tracking-wider text-muted-foreground uppercase">
                                                <th className="py-2 pr-4">
                                                    {__('Month')}
                                                </th>
                                                <th className="py-2 pr-4 text-right">
                                                    {__('Work Days')}
                                                </th>
                                                <th className="py-2 text-right">
                                                    {__('Actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {months.map((periodMonth) => (
                                                <tr key={periodMonth.id}>
                                                    <td className="py-2 pr-4 font-medium">
                                                        {monthName(
                                                            periodMonth.month,
                                                        )}
                                                    </td>
                                                    <td className="py-2 pr-4 text-right tabular-nums">
                                                        {periodMonth.workdays}
                                                    </td>
                                                    <td className="py-2">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                title={__(
                                                                    'Edit',
                                                                )}
                                                                onClick={() =>
                                                                    setEditingMonth(
                                                                        periodMonth,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                                title={__(
                                                                    'Delete',
                                                                )}
                                                                onClick={() =>
                                                                    handleDeleteMonth(
                                                                        periodMonth,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t font-semibold">
                                                <td className="py-2 pr-4">
                                                    {__('Total')}
                                                </td>
                                                <td className="py-2 pr-4 text-right tabular-nums">
                                                    {totalWorkdays}
                                                </td>
                                                <td />
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Calculation Settings */}
                        <div className="rounded-lg border border-t-4 border-t-indigo-500 bg-card p-6 shadow-sm">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                                <Calculator className="size-5 text-indigo-500" />
                                {__('Calculation Settings')}
                            </h3>
                            <div className="mb-4 grid gap-4 sm:grid-cols-3">
                                <Field label={__('Point Index (PIR)')}>
                                    {numberFormatter.format(period.pir)}
                                </Field>
                                <Field label={__('Calculation Method')}>
                                    {optionLabel(
                                        options.calcMethods,
                                        period.calc_method,
                                    )}
                                </Field>
                                <Field label={__('SKP Format')}>
                                    {optionLabel(
                                        options.skpFormats,
                                        period.skp_format,
                                    )}
                                </Field>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Flag
                                    label={__('Attendance')}
                                    enabled={period.attendance === 1}
                                />
                                <Flag label="SKP" enabled={period.skp === 1} />
                                <Flag
                                    label={__('Performance')}
                                    enabled={period.performance === 1}
                                />
                                <Flag
                                    label={__('Show Rupiah')}
                                    enabled={period.show_rupiah === 1}
                                />
                                <Flag
                                    label={__('User Confirmation')}
                                    enabled={period.user_confirmation === 1}
                                />
                            </div>
                        </div>

                        {/* BKD References */}
                        <div className="rounded-lg border border-t-4 border-t-amber-500 bg-card p-6 shadow-sm">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                                <FileText className="size-5 text-amber-500" />
                                {__('BKD References')}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-xs tracking-wider text-muted-foreground uppercase">
                                            <th className="py-2 pr-4">
                                                {__('Reference')}
                                            </th>
                                            <th className="py-2 pr-4">
                                                {__('Ref')}
                                            </th>
                                            <th className="py-2 pr-4">
                                                {__('Year')}
                                            </th>
                                            <th className="py-2">
                                                {__('Semester')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">
                                                BKD
                                            </td>
                                            <td className="py-2 pr-4">-</td>
                                            <td className="py-2 pr-4">
                                                {period.bkd_year}
                                            </td>
                                            <td className="py-2">
                                                {optionLabel(
                                                    options.bkdSemesters,
                                                    period.bkd_semester,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">
                                                P1
                                            </td>
                                            <td className="py-2 pr-4">
                                                {period.p1_bkd_ref}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {period.p1_bkd_year}
                                            </td>
                                            <td className="py-2">
                                                {optionLabel(
                                                    options.bkdSemesters,
                                                    period.p1_bkd_semester,
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">
                                                P2
                                            </td>
                                            <td className="py-2 pr-4">
                                                {period.p2_bkd_ref}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {period.p2_bkd_year}
                                            </td>
                                            <td className="py-2">
                                                {optionLabel(
                                                    options.bkdSemesters,
                                                    period.p2_bkd_semester,
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PeriodFormModal
                open={isEditing}
                onOpenChange={setIsEditing}
                period={period}
                options={options}
            />

            <PeriodMonthFormModal
                open={isAddingMonth}
                onOpenChange={setIsAddingMonth}
                period={period}
            />

            <PeriodMonthFormModal
                open={!!editingMonth}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingMonth(null);
                    }
                }}
                period={period}
                periodMonth={editingMonth}
            />
        </>
    );
}

PeriodShow.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Periods'), href: periodsIndex() },
        { title: __('Detail'), href: '' },
    ],
};
