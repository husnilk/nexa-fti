import { Link, useForm } from '@inertiajs/react';
import { Plus, Search, Trash2 } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import RubricController from '@/actions/App/Http/Controllers/RubricController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type {
    EmploymentTypeOption,
    Rubric,
    RubricCategory,
    RubricOptions,
    RubricRegulation,
} from '@/types/remuneration';

export type RubricDetailFormData = {
    id: string | null;
    position: string;
    poin: string;
    is_fixed_poin: number;
    is_active: number;
};

export type RubricFormData = {
    rubric_category_id: string;
    rubric_regulation_id: string;
    activity: string;
    code: string;
    description: string;
    description_prove: string;
    quantity: string;
    unit: string;
    form_type: string;
    personal: number;
    assignment_file: string;
    performance_file: string;
    flat_rate: string;
    is_poin_fixed: number;
    is_extra_poin: number;
    is_rasionalized: number;
    is_general: number;
    is_active: number;
    is_flat_rate: number;
    rule_max_poin: string;
    rule_min_poin: string;
    rule_max_employee: string;
    rule_min_employee: string;
    details: RubricDetailFormData[];
    organization_ids: string[];
    employment_type_ids: string[];
};

type FlagField = keyof Pick<
    RubricFormData,
    | 'personal'
    | 'is_poin_fixed'
    | 'is_extra_poin'
    | 'is_rasionalized'
    | 'is_general'
    | 'is_flat_rate'
>;

type LimitField = keyof Pick<
    RubricFormData,
    | 'rule_min_poin'
    | 'rule_max_poin'
    | 'rule_min_employee'
    | 'rule_max_employee'
>;

const flags: { field: FlagField; label: string; description: string }[] = [
    {
        field: 'personal',
        label: __('Personal'),
        description: __('Claimed individually rather than as a team.'),
    },
    {
        field: 'is_poin_fixed',
        label: __('Fixed Points'),
        description: __('Points cannot be adjusted when claimed.'),
    },
    {
        field: 'is_extra_poin',
        label: __('Extra Points'),
        description: __('Counts as extra points on top of the target.'),
    },
    {
        field: 'is_rasionalized',
        label: __('Rationalized'),
        description: __('Points are subject to rationalization.'),
    },
    {
        field: 'is_general',
        label: __('General'),
        description: __('A general rubric, not tied to a specific unit task.'),
    },
    {
        field: 'is_flat_rate',
        label: __('Flat Rate'),
        description: __('Paid at a flat rate instead of by points.'),
    },
];

const limits: { field: LimitField; label: string }[] = [
    { field: 'rule_min_poin', label: __('Min Points') },
    { field: 'rule_max_poin', label: __('Max Points') },
    { field: 'rule_min_employee', label: __('Min Employees') },
    { field: 'rule_max_employee', label: __('Max Employees') },
];

export function employmentTypeLabel(
    type?: EmploymentTypeOption | null,
): string {
    if (!type) {
        return '-';
    }

    return (
        [type.employee_type?.name, type.employment_contract?.name]
            .filter(Boolean)
            .join(' / ') || '-'
    );
}

function emptyDetail(): RubricDetailFormData {
    return {
        id: null,
        position: '',
        poin: '0',
        is_fixed_poin: 0,
        is_active: 1,
    };
}

export function toRubricFormData(
    rubric: Rubric | null | undefined,
    options: RubricOptions,
): RubricFormData {
    return {
        rubric_category_id: rubric?.rubric_category_id ?? '',
        rubric_regulation_id: rubric?.rubric_regulation_id ?? '',
        activity: rubric?.activity ?? '',
        code: rubric?.code ?? '',
        description: rubric?.description ?? '',
        description_prove: rubric?.description_prove ?? '',
        quantity: String(rubric?.quantity ?? 1),
        unit: rubric?.unit ?? '',
        form_type: String(
            rubric?.form_type ?? options.formTypes[0]?.value ?? '0',
        ),
        personal: rubric?.personal ?? 0,
        assignment_file: rubric?.assignment_file ?? '',
        performance_file: rubric?.performance_file ?? '',
        flat_rate: String(rubric?.flat_rate ?? 0),
        is_poin_fixed: rubric?.is_poin_fixed ?? 0,
        is_extra_poin: rubric?.is_extra_poin ?? 0,
        is_rasionalized: rubric?.is_rasionalized ?? 0,
        is_general: rubric?.is_general ?? 0,
        is_active: rubric?.is_active ?? 1,
        is_flat_rate: rubric?.is_flat_rate ?? 0,
        rule_max_poin: String(rubric?.rule_max_poin ?? -1),
        rule_min_poin: String(rubric?.rule_min_poin ?? -1),
        rule_max_employee: String(rubric?.rule_max_employee ?? -1),
        rule_min_employee: String(rubric?.rule_min_employee ?? -1),
        details: rubric?.details?.length
            ? rubric.details.map((detail) => ({
                  id: detail.id,
                  position: detail.position,
                  poin: String(detail.poin),
                  is_fixed_poin: detail.is_fixed_poin,
                  is_active: detail.is_active,
              }))
            : [emptyDetail()],
        organization_ids:
            rubric?.organizations?.map((o) => o.organization_id) ?? [],
        employment_type_ids:
            rubric?.employment_types?.map((t) => t.employment_type_id) ?? [],
    };
}

function Section({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-xs">
            <div className="flex items-start justify-between gap-4 border-b pb-2">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

function Required() {
    return <span className="text-destructive">*</span>;
}

type RubricFormProps = {
    rubric?: Rubric | null;
    categories: RubricCategory[];
    regulations: RubricRegulation[];
    organizations: { id: string; name: string; code: string }[];
    employmentTypes: EmploymentTypeOption[];
    options: RubricOptions;
    cancelHref: string;
};

export function RubricForm({
    rubric,
    categories,
    regulations,
    organizations,
    employmentTypes,
    options,
    cancelHref,
}: RubricFormProps) {
    const isEdit = !!rubric?.id;

    const { data, setData, post, put, processing, errors } =
        useForm<RubricFormData>(toRubricFormData(rubric, options));
    const fieldErrors = errors as Record<string, string | undefined>;

    const [restrictOrganizations, setRestrictOrganizations] = useState(
        data.organization_ids.length > 0,
    );
    const [organizationSearch, setOrganizationSearch] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const payload = {
            preserveScroll: true,
            onSuccess: () =>
                toast.success(
                    isEdit
                        ? __('Rubric updated successfully')
                        : __('Rubric created successfully'),
                ),
            onError: () => toast.error(__('Please check the form for errors.')),
        };

        if (isEdit && rubric) {
            put(RubricController.update.url(rubric.id), payload);
        } else {
            post(RubricController.store.url(), payload);
        }
    }

    function updateDetail(
        index: number,
        changes: Partial<RubricDetailFormData>,
    ) {
        setData(
            'details',
            data.details.map((detail, i) =>
                i === index ? { ...detail, ...changes } : detail,
            ),
        );
    }

    function toggleId(
        field: 'organization_ids' | 'employment_type_ids',
        id: string,
        checked: boolean,
    ) {
        setData(
            field,
            checked
                ? [...data[field], id]
                : data[field].filter((value) => value !== id),
        );
    }

    const filteredOrganizations = organizations.filter((organization) =>
        `${organization.name} ${organization.code}`
            .toLowerCase()
            .includes(organizationSearch.toLowerCase()),
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. General */}
            <Section title={__('General Information')}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">
                            {__('Code')} <Required />
                        </Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                        <InputError message={errors.code} />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                        <Label htmlFor="activity">
                            {__('Activity')} <Required />
                        </Label>
                        <Input
                            id="activity"
                            value={data.activity}
                            onChange={(e) =>
                                setData('activity', e.target.value)
                            }
                        />
                        <InputError message={errors.activity} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="category">
                            {__('Category')} <Required />
                        </Label>
                        <Select
                            value={data.rubric_category_id}
                            onValueChange={(v) =>
                                setData('rubric_category_id', v)
                            }
                        >
                            <SelectTrigger id="category">
                                <SelectValue
                                    placeholder={__('Select category')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.code} — {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.rubric_category_id} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="regulation">
                            {__('Regulation')} <Required />
                        </Label>
                        <Select
                            value={data.rubric_regulation_id}
                            onValueChange={(v) =>
                                setData('rubric_regulation_id', v)
                            }
                        >
                            <SelectTrigger id="regulation">
                                <SelectValue
                                    placeholder={__('Select regulation')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {regulations.map((regulation) => (
                                    <SelectItem
                                        key={regulation.id}
                                        value={regulation.id}
                                    >
                                        {regulation.name} (No.{' '}
                                        {regulation.regulation_number}/
                                        {regulation.regulation_year})
                                        {regulation.is_active !== 1 &&
                                            __(' — inactive')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.rubric_regulation_id} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            {__('Quantity')} <Required />
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min={0}
                            step="any"
                            value={data.quantity}
                            onChange={(e) =>
                                setData('quantity', e.target.value)
                            }
                        />
                        <InputError message={errors.quantity} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unit">{__('Unit')}</Label>
                        <Input
                            id="unit"
                            placeholder={__('e.g. kegiatan, artikel, SKS')}
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                        />
                        <InputError message={errors.unit} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="form_type">
                            {__('Form Type')} <Required />
                        </Label>
                        <Select
                            value={data.form_type}
                            onValueChange={(v) => setData('form_type', v)}
                        >
                            <SelectTrigger id="form_type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.formTypes.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={String(option.value)}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.form_type} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{__('Description')}</Label>
                    <Textarea
                        id="description"
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>
            </Section>

            {/* 2. Evidence */}
            <Section
                title={__('Evidence Requirements')}
                description={__(
                    'Documents employees must provide when claiming this rubric.',
                )}
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="assignment_file">
                            {__('Assignment Document')}
                        </Label>
                        <Input
                            id="assignment_file"
                            placeholder={__('e.g. SK Penugasan')}
                            value={data.assignment_file}
                            onChange={(e) =>
                                setData('assignment_file', e.target.value)
                            }
                        />
                        <InputError message={errors.assignment_file} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="performance_file">
                            {__('Performance Document')}
                        </Label>
                        <Input
                            id="performance_file"
                            placeholder={__('e.g. Laporan Kegiatan')}
                            value={data.performance_file}
                            onChange={(e) =>
                                setData('performance_file', e.target.value)
                            }
                        />
                        <InputError message={errors.performance_file} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description_prove">
                        {__('Evidence Description')}
                    </Label>
                    <Textarea
                        id="description_prove"
                        rows={3}
                        value={data.description_prove}
                        onChange={(e) =>
                            setData('description_prove', e.target.value)
                        }
                    />
                    <InputError message={errors.description_prove} />
                </div>
            </Section>

            {/* 3. Details */}
            <Section
                title={__('Points per Position')}
                description={__('At least one position is required.')}
                action={
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() =>
                            setData('details', [...data.details, emptyDetail()])
                        }
                    >
                        <Plus className="mr-1 size-4" /> {__('Add Position')}
                    </Button>
                }
            >
                <div className="space-y-3">
                    <div className="hidden grid-cols-12 gap-3 px-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:grid">
                        <span className="col-span-5">{__('Position')}</span>
                        <span className="col-span-2">{__('Points')}</span>
                        <span className="col-span-2 text-center">
                            {__('Fixed Points')}
                        </span>
                        <span className="col-span-2 text-center">
                            {__('Active')}
                        </span>
                        <span className="col-span-1" />
                    </div>
                    {data.details.map((detail, index) => (
                        <div
                            key={detail.id ?? `new-${index}`}
                            className="grid grid-cols-2 items-start gap-3 rounded-md border p-3 md:grid-cols-12 md:border-0 md:p-0"
                        >
                            <div className="col-span-2 space-y-1 md:col-span-5">
                                <Input
                                    aria-label={__('Position')}
                                    placeholder={__('e.g. Ketua, Anggota')}
                                    value={detail.position}
                                    onChange={(e) =>
                                        updateDetail(index, {
                                            position: e.target.value,
                                        })
                                    }
                                />
                                <InputError
                                    message={
                                        fieldErrors[`details.${index}.position`]
                                    }
                                />
                            </div>
                            <div className="col-span-2 space-y-1 md:col-span-2">
                                <Input
                                    aria-label={__('Points')}
                                    type="number"
                                    min={0}
                                    step="any"
                                    value={detail.poin}
                                    onChange={(e) =>
                                        updateDetail(index, {
                                            poin: e.target.value,
                                        })
                                    }
                                />
                                <InputError
                                    message={
                                        fieldErrors[`details.${index}.poin`]
                                    }
                                />
                            </div>
                            <label className="flex h-9 items-center gap-2 text-sm md:col-span-2 md:justify-center">
                                <Checkbox
                                    checked={detail.is_fixed_poin === 1}
                                    onCheckedChange={(checked) =>
                                        updateDetail(index, {
                                            is_fixed_poin: checked ? 1 : 0,
                                        })
                                    }
                                />
                                <span className="md:hidden">
                                    {__('Fixed Points')}
                                </span>
                            </label>
                            <label className="flex h-9 items-center gap-2 text-sm md:col-span-2 md:justify-center">
                                <Checkbox
                                    checked={detail.is_active === 1}
                                    onCheckedChange={(checked) =>
                                        updateDetail(index, {
                                            is_active: checked ? 1 : 0,
                                        })
                                    }
                                />
                                <span className="md:hidden">
                                    {__('Active')}
                                </span>
                            </label>
                            <div className="col-span-2 flex justify-end md:col-span-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400"
                                    title={__('Remove position')}
                                    disabled={data.details.length === 1}
                                    onClick={() =>
                                        setData(
                                            'details',
                                            data.details.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <InputError message={errors.details} />
                </div>
            </Section>

            {/* 4. Rules */}
            <Section
                title={__('Point Rules')}
                description={__('Use -1 for no limit.')}
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {flags.map((flag) => (
                        <label
                            key={flag.field}
                            className="flex cursor-pointer items-center justify-between gap-4 rounded-md border p-3"
                        >
                            <div>
                                <p className="text-sm font-medium">
                                    {flag.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {flag.description}
                                </p>
                            </div>
                            <Switch
                                checked={data[flag.field] === 1}
                                onCheckedChange={(checked) =>
                                    setData(flag.field, checked ? 1 : 0)
                                }
                            />
                        </label>
                    ))}
                </div>

                {data.is_flat_rate === 1 && (
                    <div className="space-y-2 md:max-w-xs">
                        <Label htmlFor="flat_rate">
                            {__('Flat Rate Amount')}
                        </Label>
                        <Input
                            id="flat_rate"
                            type="number"
                            min={0}
                            value={data.flat_rate}
                            onChange={(e) =>
                                setData('flat_rate', e.target.value)
                            }
                        />
                        <InputError message={errors.flat_rate} />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {limits.map((limit) => (
                        <div key={limit.field} className="space-y-2">
                            <Label htmlFor={limit.field}>{limit.label}</Label>
                            <Input
                                id={limit.field}
                                type="number"
                                min={-1}
                                value={data[limit.field]}
                                onChange={(e) =>
                                    setData(limit.field, e.target.value)
                                }
                            />
                            <InputError message={errors[limit.field]} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* 5. Availability */}
            <Section
                title={__('Availability')}
                description={__(
                    'Which organizations and employment types may use this rubric.',
                )}
            >
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <Label>{__('Organizations')}</Label>
                        <div className="flex rounded-md bg-muted p-1">
                            {[
                                {
                                    value: false,
                                    label: __('All Organizations'),
                                },
                                { value: true, label: __('Specific') },
                            ].map((choice) => (
                                <button
                                    key={choice.label}
                                    type="button"
                                    onClick={() => {
                                        setRestrictOrganizations(choice.value);

                                        if (!choice.value) {
                                            setData('organization_ids', []);
                                        }
                                    }}
                                    className={cn(
                                        'cursor-pointer rounded-sm px-4 py-1.5 text-sm font-medium transition-all',
                                        restrictOrganizations === choice.value
                                            ? 'bg-background font-semibold text-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {choice.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {restrictOrganizations ? (
                        <div className="space-y-3 rounded-md border p-3">
                            <div className="relative">
                                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder={__('Search organizations...')}
                                    className="pl-9"
                                    value={organizationSearch}
                                    onChange={(e) =>
                                        setOrganizationSearch(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2">
                                {filteredOrganizations.map((organization) => (
                                    <label
                                        key={organization.id}
                                        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                                    >
                                        <Checkbox
                                            checked={data.organization_ids.includes(
                                                organization.id,
                                            )}
                                            onCheckedChange={(checked) =>
                                                toggleId(
                                                    'organization_ids',
                                                    organization.id,
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <span>
                                            {organization.name}{' '}
                                            <span className="text-xs text-muted-foreground">
                                                ({organization.code})
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {__(
                                    ':count selected. With none selected, the rubric stays available to all organizations.',
                                    { count: data.organization_ids.length },
                                )}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {__('Every organization may use this rubric.')}
                        </p>
                    )}
                    <InputError message={errors.organization_ids} />
                </div>

                <div className="space-y-3 border-t pt-6">
                    <Label>
                        {__('Employment Types')} <Required />
                    </Label>
                    <div className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-2">
                        {employmentTypes.map((type) => (
                            <label
                                key={type.id}
                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-muted/50"
                            >
                                <Checkbox
                                    checked={data.employment_type_ids.includes(
                                        type.id,
                                    )}
                                    onCheckedChange={(checked) =>
                                        toggleId(
                                            'employment_type_ids',
                                            type.id,
                                            checked === true,
                                        )
                                    }
                                />
                                <span>{employmentTypeLabel(type)}</span>
                            </label>
                        ))}
                    </div>
                    <InputError message={errors.employment_type_ids} />
                </div>
            </Section>

            {/* 6. Status */}
            <Section title={__('Status')}>
                <label className="flex cursor-pointer items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium">{__('Active')}</p>
                        <p className="text-xs text-muted-foreground">
                            {__('Inactive rubrics cannot be claimed.')}
                        </p>
                    </div>
                    <Switch
                        checked={data.is_active === 1}
                        onCheckedChange={(checked) =>
                            setData('is_active', checked ? 1 : 0)
                        }
                    />
                </label>
            </Section>

            <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" asChild>
                    <Link href={cancelHref}>{__('Cancel')}</Link>
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-xs hover:from-violet-700 hover:to-indigo-700"
                >
                    {processing
                        ? isEdit
                            ? __('Saving Changes...')
                            : __('Creating...')
                        : isEdit
                          ? __('Save Changes')
                          : __('Create Rubric')}
                </Button>
            </div>
        </form>
    );
}
