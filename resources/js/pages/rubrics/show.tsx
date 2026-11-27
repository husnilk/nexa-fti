import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Check,
    ClipboardList,
    FileText,
    Pencil,
    Power,
    PowerOff,
    Trash2,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import RubricController from '@/actions/App/Http/Controllers/RubricController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { __, intlLocale } from '@/lib/i18n';
import { employmentTypeLabel } from '@/pages/rubrics/components/rubric-form';
import { edit as rubricEdit, index as rubricsIndex } from '@/routes/rubrics';
import type { Auth } from '@/types';
import type { Rubric, RubricOptions } from '@/types/remuneration';

type PageProps = {
    auth: Auth;
    rubric: Rubric;
    options: RubricOptions;
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

function limitLabel(value: number): string {
    return value < 0 ? __('No limit') : String(value);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <Label className="text-xs text-muted-foreground uppercase">
                {label}
            </Label>
            <div className="text-sm font-medium">{children}</div>
        </div>
    );
}

export default function RubricShow({ rubric, options }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayManage = can(auth, 'rubric.manage');
    const isActive = rubric.is_active === 1;

    const formTypeLabel =
        options.formTypes.find((o) => Number(o.value) === rubric.form_type)
            ?.label ?? String(rubric.form_type);

    const flags = [
        { label: __('Personal'), on: rubric.personal === 1 },
        { label: __('Fixed Points'), on: rubric.is_poin_fixed === 1 },
        { label: __('Extra Points'), on: rubric.is_extra_poin === 1 },
        { label: __('Rationalized'), on: rubric.is_rasionalized === 1 },
        { label: __('General'), on: rubric.is_general === 1 },
        { label: __('Flat Rate'), on: rubric.is_flat_rate === 1 },
    ];

    const handleToggleStatus = () => {
        router.patch(
            RubricController.toggleStatus.url(rubric.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        isActive
                            ? __('Rubric deactivated')
                            : __('Rubric activated'),
                    ),
            },
        );
    };

    const handleDelete = () => {
        if (
            confirm(
                __(
                    'Are you sure you want to delete rubric :code? Its positions and availability settings will also be deleted.',
                    { code: rubric.code },
                ),
            )
        ) {
            router.delete(RubricController.destroy.url(rubric.id), {
                onSuccess: () =>
                    toast.success(__('Rubric deleted successfully')),
            });
        }
    };

    return (
        <>
            <Head title={__('Rubric: :code', { code: rubric.code })} />
            <div className="mx-auto flex h-full max-w-7xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-2">
                        <Link
                            href={rubricsIndex()}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />{' '}
                            {__('Back to Rubrics')}
                        </Link>
                        <Heading
                            title={rubric.activity}
                            description={`${rubric.code} • ${rubric.category?.name ?? '-'}`}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={isActive ? 'default' : 'secondary'}
                            className="h-8 px-3 uppercase"
                        >
                            {isActive ? __('Active') : __('Inactive')}
                        </Badge>
                        {mayManage && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer gap-2"
                                    onClick={handleToggleStatus}
                                >
                                    {isActive ? (
                                        <PowerOff className="size-4" />
                                    ) : (
                                        <Power className="size-4" />
                                    )}
                                    {isActive
                                        ? __('Deactivate')
                                        : __('Activate')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer gap-2"
                                    asChild
                                >
                                    <Link href={rubricEdit(rubric.id)}>
                                        <Pencil className="size-4" />{' '}
                                        {__('Edit')}
                                    </Link>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer gap-2 text-rose-600 hover:text-rose-700"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="size-4" /> {__('Delete')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Left Column: Summary */}
                    <div className="space-y-6 lg:col-span-4">
                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h4 className="border-b pb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                {__('Rubric Information')}
                            </h4>
                            <Field label={__('Code')}>
                                <span className="font-mono">{rubric.code}</span>
                            </Field>
                            <Field label={__('Category')}>
                                {rubric.category
                                    ? `${rubric.category.code} — ${rubric.category.name}`
                                    : '-'}
                            </Field>
                            <Field label={__('Regulation')}>
                                {rubric.regulation ? (
                                    <span className="flex flex-col">
                                        <span>{rubric.regulation.name}</span>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            {__('No.')}{' '}
                                            {
                                                rubric.regulation
                                                    .regulation_number
                                            }{' '}
                                            /{' '}
                                            {rubric.regulation.regulation_year}
                                        </span>
                                        {rubric.regulation.is_active !== 1 && (
                                            <Badge
                                                variant="outline"
                                                className="mt-1 w-fit border-amber-300 text-amber-700 dark:text-amber-400"
                                            >
                                                {__('Inactive regulation')}
                                            </Badge>
                                        )}
                                        {rubric.regulation.file_path && (
                                            <a
                                                href={`/storage/${rubric.regulation.file_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                <FileText className="size-3" />
                                                {__('View document')}
                                            </a>
                                        )}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label={__('Quantity')}>
                                    {rubric.quantity} {rubric.unit}
                                </Field>
                                <Field label={__('Form Type')}>
                                    {formTypeLabel}
                                </Field>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h4 className="border-b pb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                {__('Point Rules')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {flags.map((flag) => (
                                    <Badge
                                        key={flag.label}
                                        variant={
                                            flag.on ? 'default' : 'outline'
                                        }
                                        className={
                                            flag.on
                                                ? ''
                                                : 'text-muted-foreground'
                                        }
                                    >
                                        {flag.on && (
                                            <Check className="mr-1 size-3" />
                                        )}
                                        {flag.label}
                                    </Badge>
                                ))}
                            </div>
                            {rubric.is_flat_rate === 1 && (
                                <Field label={__('Flat Rate Amount')}>
                                    {rubric.flat_rate.toLocaleString(
                                        intlLocale(),
                                    )}
                                </Field>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <Field label={__('Min Points')}>
                                    {limitLabel(rubric.rule_min_poin)}
                                </Field>
                                <Field label={__('Max Points')}>
                                    {limitLabel(rubric.rule_max_poin)}
                                </Field>
                                <Field label={__('Min Employees')}>
                                    {limitLabel(rubric.rule_min_employee)}
                                </Field>
                                <Field label={__('Max Employees')}>
                                    {limitLabel(rubric.rule_max_employee)}
                                </Field>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Points per Position */}
                        <div className="rounded-lg border border-t-4 border-t-violet-500 bg-card p-6 shadow-sm">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <ClipboardList className="size-5 text-violet-500" />
                                {__('Points per Position')}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            <th className="py-2 pr-4">
                                                {__('Position')}
                                            </th>
                                            <th className="py-2 pr-4 text-right">
                                                {__('Points')}
                                            </th>
                                            <th className="py-2 pr-4 text-center">
                                                {__('Fixed Points')}
                                            </th>
                                            <th className="py-2 text-center">
                                                {__('Status')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {rubric.details?.map((detail) => (
                                            <tr key={detail.id}>
                                                <td className="py-2.5 pr-4 font-medium">
                                                    {detail.position}
                                                </td>
                                                <td className="py-2.5 pr-4 text-right font-mono">
                                                    {detail.poin}
                                                </td>
                                                <td className="py-2.5 pr-4 text-center">
                                                    {detail.is_fixed_poin ===
                                                    1 ? (
                                                        <Check className="mx-auto size-4 text-emerald-600" />
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                                <td className="py-2.5 text-center">
                                                    <Badge
                                                        variant={
                                                            detail.is_active ===
                                                            1
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {detail.is_active === 1
                                                            ? __('Active')
                                                            : __('Inactive')}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-t-4 border-t-amber-500 bg-card p-6 shadow-sm">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                    <Building2 className="size-5 text-amber-500" />
                                    {__('Organizations')}
                                </h3>
                                {rubric.organizations?.length ? (
                                    <ul className="space-y-2 text-sm">
                                        {rubric.organizations.map(
                                            (assignment) => (
                                                <li
                                                    key={assignment.id}
                                                    className="flex items-center justify-between gap-2"
                                                >
                                                    <span>
                                                        {
                                                            assignment
                                                                .organization
                                                                ?.name
                                                        }
                                                    </span>
                                                    <code className="text-xs text-muted-foreground">
                                                        {
                                                            assignment
                                                                .organization
                                                                ?.code
                                                        }
                                                    </code>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {__('Available to all organizations.')}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg border border-t-4 border-t-indigo-500 bg-card p-6 shadow-sm">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                    <Users className="size-5 text-indigo-500" />
                                    {__('Employment Types')}
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    {rubric.employment_types?.map(
                                        (assignment) => (
                                            <li key={assignment.id}>
                                                {employmentTypeLabel(
                                                    assignment.employment_type,
                                                )}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Description & Evidence */}
                        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <FileText className="size-5 text-muted-foreground" />
                                {__('Description & Evidence')}
                            </h3>
                            <Field label={__('Description')}>
                                <p className="font-normal whitespace-pre-line text-muted-foreground">
                                    {rubric.description || '-'}
                                </p>
                            </Field>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label={__('Assignment Document')}>
                                    {rubric.assignment_file || '-'}
                                </Field>
                                <Field label={__('Performance Document')}>
                                    {rubric.performance_file || '-'}
                                </Field>
                            </div>
                            <Field label={__('Evidence Description')}>
                                <p className="font-normal whitespace-pre-line text-muted-foreground">
                                    {rubric.description_prove || '-'}
                                </p>
                            </Field>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

RubricShow.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Rubrics'), href: rubricsIndex() },
        { title: __('Detail'), href: '' },
    ],
};
