import { useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import PeriodController from '@/actions/App/Http/Controllers/PeriodController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import type { Period, PeriodOptions, SelectOption } from '@/types/remuneration';

export type PeriodFormData = {
    year: string;
    no: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    input_start_date: string;
    input_end_date: string;
    verification_start_date: string;
    verification_end_date: string;
    validation_start_date: string;
    validation_end_date: string;
    attendance: number;
    skp: number;
    skp_format: string;
    calc_method: string;
    performance: number;
    pir: string;
    show_rupiah: number;
    user_confirmation: number;
    bkd_year: string;
    bkd_semester: string;
    p1_bkd_ref: string;
    p1_bkd_year: string;
    p1_bkd_semester: string;
    p2_bkd_ref: string;
    p2_bkd_year: string;
    p2_bkd_semester: string;
    status: number;
};

type DateField = keyof Pick<
    PeriodFormData,
    | 'start_date'
    | 'end_date'
    | 'input_start_date'
    | 'input_end_date'
    | 'verification_start_date'
    | 'verification_end_date'
    | 'validation_start_date'
    | 'validation_end_date'
>;

type ToggleField = keyof Pick<
    PeriodFormData,
    'attendance' | 'skp' | 'performance' | 'show_rupiah' | 'user_confirmation'
>;

const scheduleRows: { label: string; start: DateField; end: DateField }[] = [
    { label: __('Period'), start: 'start_date', end: 'end_date' },
    {
        label: __('Data Input'),
        start: 'input_start_date',
        end: 'input_end_date',
    },
    {
        label: __('Verification'),
        start: 'verification_start_date',
        end: 'verification_end_date',
    },
    {
        label: __('Validation'),
        start: 'validation_start_date',
        end: 'validation_end_date',
    },
];

const toggles: { field: ToggleField; label: string; description: string }[] = [
    {
        field: 'attendance',
        label: __('Attendance'),
        description: __('Include attendance in the calculation.'),
    },
    {
        field: 'skp',
        label: 'SKP',
        description: __('Include employee performance targets (SKP).'),
    },
    {
        field: 'performance',
        label: __('Performance'),
        description: __('Include performance scores.'),
    },
    {
        field: 'show_rupiah',
        label: __('Show Rupiah'),
        description: __('Show amounts in Rupiah to employees.'),
    },
    {
        field: 'user_confirmation',
        label: __('User Confirmation'),
        description: __('Employees must confirm their data.'),
    },
];

function dateValue(value?: string | null): string {
    return value ? value.split('T')[0] : '';
}

export function toPeriodFormData(
    period: Period | null | undefined,
    options: PeriodOptions,
): PeriodFormData {
    const defaultSemester = String(options.bkdSemesters[0]?.value ?? '');

    return {
        year: String(period?.year ?? new Date().getFullYear()),
        no: period?.no !== undefined ? String(period.no) : '',
        name: period?.name ?? '',
        description: period?.description ?? '',
        start_date: dateValue(period?.start_date),
        end_date: dateValue(period?.end_date),
        input_start_date: dateValue(period?.input_start_date),
        input_end_date: dateValue(period?.input_end_date),
        verification_start_date: dateValue(period?.verification_start_date),
        verification_end_date: dateValue(period?.verification_end_date),
        validation_start_date: dateValue(period?.validation_start_date),
        validation_end_date: dateValue(period?.validation_end_date),
        attendance: period?.attendance ?? 0,
        skp: period?.skp ?? 0,
        skp_format: String(
            period?.skp_format ?? options.skpFormats[0]?.value ?? '',
        ),
        calc_method: String(
            period?.calc_method ?? options.calcMethods[0]?.value ?? '',
        ),
        performance: period?.performance ?? 0,
        pir: String(period?.pir ?? 3000),
        show_rupiah: period?.show_rupiah ?? 0,
        user_confirmation: period?.user_confirmation ?? 1,
        bkd_year: String(period?.bkd_year ?? 0),
        bkd_semester: period?.bkd_semester ?? defaultSemester,
        p1_bkd_ref: String(period?.p1_bkd_ref ?? 0),
        p1_bkd_year: String(period?.p1_bkd_year ?? 0),
        p1_bkd_semester: period?.p1_bkd_semester ?? defaultSemester,
        p2_bkd_ref: String(period?.p2_bkd_ref ?? 0),
        p2_bkd_year: String(period?.p2_bkd_year ?? 0),
        p2_bkd_semester: period?.p2_bkd_semester ?? defaultSemester,
        status: period?.status ?? 1,
    };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="space-y-4 rounded-lg border bg-card/50 p-5 shadow-xs">
            <h3 className="border-b pb-2 text-base font-semibold text-foreground">
                {title}
            </h3>
            {children}
        </div>
    );
}

interface PeriodFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    period?: Period | null;
    options: PeriodOptions;
    onSuccess?: () => void;
}

export function PeriodFormModal({
    open,
    onOpenChange,
    period,
    options,
    onSuccess,
}: PeriodFormModalProps) {
    const isEdit = !!period?.id;

    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<PeriodFormData>(toPeriodFormData(period, options));

    useEffect(() => {
        if (open) {
            setData(toPeriodFormData(period, options));
            clearErrors();
        }
    }, [open, period]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (isEdit && period) {
            patch(PeriodController.update.url(period.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success(__('Period updated successfully'));
                    onSuccess?.();
                },
            });
        } else {
            post(PeriodController.store.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success(__('Period created successfully'));
                    onSuccess?.();
                },
            });
        }
    }

    function numberField(
        field: keyof PeriodFormData,
        label: string,
        props: { step?: string; required?: boolean } = {},
    ) {
        const id = `period-${field}`;

        return (
            <div className="space-y-1.5">
                <Label htmlFor={id}>
                    {label}{' '}
                    {props.required && (
                        <span className="text-destructive">*</span>
                    )}
                </Label>
                <Input
                    id={id}
                    type="number"
                    min={0}
                    step={props.step ?? '1'}
                    value={data[field] as string}
                    onChange={(e) => setData(field, e.target.value)}
                />
                <InputError message={errors[field]} />
            </div>
        );
    }

    function selectField(
        field: keyof PeriodFormData,
        label: string,
        choices: SelectOption[],
        props: { required?: boolean } = {},
    ) {
        const id = `period-${field}`;

        return (
            <div className="space-y-1.5">
                <Label htmlFor={id}>
                    {label}{' '}
                    {props.required && (
                        <span className="text-destructive">*</span>
                    )}
                </Label>
                <Select
                    value={String(data[field])}
                    onValueChange={(value) => setData(field, value)}
                >
                    <SelectTrigger id={id}>
                        <SelectValue
                            placeholder={__('Select :field', {
                                field: label.toLowerCase(),
                            })}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {choices.map((choice) => (
                            <SelectItem
                                key={choice.value}
                                value={String(choice.value)}
                            >
                                {choice.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors[field]} />
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b p-6 pb-4">
                        <DialogTitle className="text-xl font-bold">
                            {isEdit
                                ? __('Edit Period: :name', {
                                      name: period?.name,
                                  })
                                : __('Add Period')}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? __(
                                      'Update the schedule and calculation settings of this period.',
                                  )
                                : __(
                                      'Define a new remuneration period with its schedule and calculation settings.',
                                  )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 p-6">
                        {/* 1. General */}
                        <Section title={__('General Information')}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                {numberField('year', __('Year'), {
                                    required: true,
                                })}
                                {numberField('no', __('Period No.'), {
                                    required: true,
                                })}
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label htmlFor="period-name">
                                        {__('Name')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="period-name"
                                        placeholder={__(
                                            'e.g. Period 1 2026 (January – March)',
                                        )}
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="period-description">
                                    {__('Description')}
                                </Label>
                                <Textarea
                                    id="period-description"
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <div>
                                    <Label htmlFor="period-status">
                                        {__('Active')}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        {__(
                                            'Inactive periods are kept but hidden from day-to-day use.',
                                        )}
                                    </p>
                                </div>
                                <Switch
                                    id="period-status"
                                    checked={data.status === 1}
                                    onCheckedChange={(checked) =>
                                        setData('status', checked ? 1 : 0)
                                    }
                                />
                            </div>
                        </Section>

                        {/* 2. Schedule */}
                        <Section title={__('Schedule')}>
                            <div className="space-y-3">
                                {scheduleRows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="grid grid-cols-1 items-start gap-3 md:grid-cols-[140px_1fr_1fr]"
                                    >
                                        <span className="pt-2 text-sm font-medium">
                                            {row.label}{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </span>
                                        <div className="space-y-1">
                                            <Input
                                                type="date"
                                                aria-label={__(
                                                    ':label start date',
                                                    { label: row.label },
                                                )}
                                                value={data[row.start]}
                                                onChange={(e) =>
                                                    setData(
                                                        row.start,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors[row.start]}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                type="date"
                                                aria-label={__(
                                                    ':label end date',
                                                    { label: row.label },
                                                )}
                                                value={data[row.end]}
                                                onChange={(e) =>
                                                    setData(
                                                        row.end,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors[row.end]}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 3. Calculation */}
                        <Section title={__('Calculation Settings')}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {numberField('pir', __('Point Index (PIR)'), {
                                    step: '0.01',
                                    required: true,
                                })}
                                {selectField(
                                    'calc_method',
                                    __('Calculation Method'),
                                    options.calcMethods,
                                    { required: true },
                                )}
                                {selectField(
                                    'skp_format',
                                    __('SKP Format'),
                                    options.skpFormats,
                                    { required: true },
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {toggles.map((toggle) => (
                                    <div
                                        key={toggle.field}
                                        className="flex items-center justify-between gap-3 rounded-md border p-3"
                                    >
                                        <div>
                                            <Label
                                                htmlFor={`period-${toggle.field}`}
                                            >
                                                {toggle.label}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                {toggle.description}
                                            </p>
                                        </div>
                                        <Switch
                                            id={`period-${toggle.field}`}
                                            checked={data[toggle.field] === 1}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    toggle.field,
                                                    checked ? 1 : 0,
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 4. BKD */}
                        <Section title={__('BKD References')}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="hidden md:block" />
                                {numberField('bkd_year', __('BKD Year'))}
                                {selectField(
                                    'bkd_semester',
                                    __('BKD Semester'),
                                    options.bkdSemesters,
                                    { required: true },
                                )}
                                {numberField('p1_bkd_ref', __('P1 Reference'))}
                                {numberField('p1_bkd_year', __('P1 Year'))}
                                {selectField(
                                    'p1_bkd_semester',
                                    __('P1 Semester'),
                                    options.bkdSemesters,
                                    { required: true },
                                )}
                                {numberField('p2_bkd_ref', __('P2 Reference'))}
                                {numberField('p2_bkd_year', __('P2 Year'))}
                                {selectField(
                                    'p2_bkd_semester',
                                    __('P2 Semester'),
                                    options.bkdSemesters,
                                    { required: true },
                                )}
                            </div>
                        </Section>
                    </div>

                    <DialogFooter className="border-t bg-muted/20 p-6 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            {__('Cancel')}
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
                                  : __('Create Period')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
