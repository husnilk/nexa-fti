import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import EptController from '@/actions/App/Http/Controllers/EptController';
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
import { __ } from '@/lib/i18n';
import type { Ept, EptEmployee, EptPeriodOption } from '@/types/remuneration';
import {
    behaviorAspects,
    monthNames,
    predicateLabels,
    ratingLabels,
    statusLabels,
} from './ept-options';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ept: Ept | null;
    employees: EptEmployee[];
    periods: EptPeriodOption[];
};

type FormData = {
    employee_id: string;
    period_id: string;
    year: string;
    start: string;
    end: string;
    start_date: string;
    end_date: string;
    appraiser_officer_id: string;
    superior_appraiser_officer_id: string;
    orientation: string;
    integrity: string;
    commitment: string;
    discipline: string;
    teamwork: string;
    leadership: string;
    skp_achievement: string;
    work_result_rating: string;
    behavior_rating: string;
    performance_predicate: string;
    points: string;
    status: string;
};

const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 bg-white dark:bg-zinc-900';

function text(value: string | number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
}

function initialData(ept: Ept | null): FormData {
    return {
        employee_id: text(ept?.employee_id),
        period_id: text(ept?.period_id),
        year: text(ept?.year ?? new Date().getFullYear()),
        start: text(ept?.start ?? 1),
        end: text(ept?.end ?? 12),
        start_date: text(ept?.start_date),
        end_date: text(ept?.end_date),
        appraiser_officer_id: text(ept?.appraiser_officer_id),
        superior_appraiser_officer_id: text(ept?.superior_appraiser_officer_id),
        orientation: text(ept?.orientation),
        integrity: text(ept?.integrity),
        commitment: text(ept?.commitment),
        discipline: text(ept?.discipline),
        teamwork: text(ept?.teamwork),
        leadership: text(ept?.leadership),
        skp_achievement: text(ept?.skp_achievement),
        work_result_rating: text(ept?.work_result_rating),
        behavior_rating: text(ept?.behavior_rating),
        performance_predicate: text(ept?.performance_predicate),
        points: text(ept?.points),
        status: text(ept?.status ?? 0),
    };
}

function Field({
    id,
    label,
    error,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0 dark:border-zinc-800">
            <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                {title}
            </h3>
            {children}
        </div>
    );
}

/**
 * Create/update form. Mount with a `key` per record so the form
 * re-initialises whenever a different EPT is opened.
 */
export default function EptFormModal({
    open,
    onOpenChange,
    ept,
    employees,
    periods,
}: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormData>(initialData(ept));

    function close(): void {
        onOpenChange(false);
        clearErrors();
    }

    function changePeriod(periodId: string): void {
        const period = periods.find((p) => p.id === periodId);

        setData((current) => ({
            ...current,
            period_id: periodId,
            year: period ? String(period.year) : current.year,
        }));
    }

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                close();

                if (!ept) {
                    reset();
                }
            },
        };

        if (ept) {
            put(EptController.update.url(ept.id), options);
        } else {
            post(EptController.store.url(), options);
        }
    }

    const employeeOptions = employees.map((emp) => (
        <option key={emp.id} value={emp.id}>
            {emp.name}
            {emp.emp_number ? ` (${emp.emp_number})` : ''}
        </option>
    ));

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => (value ? onOpenChange(true) : close())}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {ept
                            ? __('Edit Performance Target')
                            : __('Add Performance Target')}
                    </DialogTitle>
                    <DialogDescription>
                        {__(
                            'Employee performance target (SKP) for a remuneration period.',
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Section title={__('Employee & Period')}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                                id="employee_id"
                                label={__('Employee *')}
                                error={errors.employee_id}
                            >
                                <select
                                    id="employee_id"
                                    value={data.employee_id}
                                    onChange={(e) =>
                                        setData('employee_id', e.target.value)
                                    }
                                    required
                                    className={selectClass}
                                >
                                    <option value="">
                                        {__('Select Employee')}
                                    </option>
                                    {employeeOptions}
                                </select>
                            </Field>
                            <Field
                                id="period_id"
                                label={__('Period *')}
                                error={errors.period_id}
                            >
                                <select
                                    id="period_id"
                                    value={data.period_id}
                                    onChange={(e) =>
                                        changePeriod(e.target.value)
                                    }
                                    required
                                    className={selectClass}
                                >
                                    <option value="">
                                        {__('Select Period')}
                                    </option>
                                    {periods.map((period) => (
                                        <option
                                            key={period.id}
                                            value={period.id}
                                        >
                                            {period.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Field
                                id="year"
                                label={__('Year *')}
                                error={errors.year}
                            >
                                <Input
                                    id="year"
                                    type="number"
                                    min={2000}
                                    max={2100}
                                    value={data.year}
                                    onChange={(e) =>
                                        setData('year', e.target.value)
                                    }
                                    required
                                />
                            </Field>
                            <Field
                                id="start"
                                label={__('Start Month')}
                                error={errors.start}
                            >
                                <select
                                    id="start"
                                    value={data.start}
                                    onChange={(e) =>
                                        setData('start', e.target.value)
                                    }
                                    className={selectClass}
                                >
                                    {monthNames.map((name, i) => (
                                        <option key={name} value={i + 1}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field
                                id="end"
                                label={__('End Month')}
                                error={errors.end}
                            >
                                <select
                                    id="end"
                                    value={data.end}
                                    onChange={(e) =>
                                        setData('end', e.target.value)
                                    }
                                    className={selectClass}
                                >
                                    {monthNames.map((name, i) => (
                                        <option key={name} value={i + 1}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                                id="start_date"
                                label={__('Start Date')}
                                error={errors.start_date}
                            >
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                id="end_date"
                                label={__('End Date')}
                                error={errors.end_date}
                            >
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section title={__('Appraisers')}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                                id="appraiser_officer_id"
                                label={__('Appraiser Officer')}
                                error={errors.appraiser_officer_id}
                            >
                                <select
                                    id="appraiser_officer_id"
                                    value={data.appraiser_officer_id}
                                    onChange={(e) =>
                                        setData(
                                            'appraiser_officer_id',
                                            e.target.value,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">
                                        {__('Not assigned')}
                                    </option>
                                    {employeeOptions}
                                </select>
                            </Field>
                            <Field
                                id="superior_appraiser_officer_id"
                                label={__('Superior Appraiser Officer')}
                                error={errors.superior_appraiser_officer_id}
                            >
                                <select
                                    id="superior_appraiser_officer_id"
                                    value={data.superior_appraiser_officer_id}
                                    onChange={(e) =>
                                        setData(
                                            'superior_appraiser_officer_id',
                                            e.target.value,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">
                                        {__('Not assigned')}
                                    </option>
                                    {employeeOptions}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    <Section title={__('Behaviour Scores (0–100)')}>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {behaviorAspects.map((aspect) => (
                                <Field
                                    key={aspect.name}
                                    id={aspect.name}
                                    label={aspect.label}
                                    error={errors[aspect.name]}
                                >
                                    <Input
                                        id={aspect.name}
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={data[aspect.name]}
                                        onChange={(e) =>
                                            setData(aspect.name, e.target.value)
                                        }
                                    />
                                </Field>
                            ))}
                        </div>
                    </Section>

                    <Section title={__('Assessment')}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Field
                                id="work_result_rating"
                                label={__('Work Result Rating')}
                                error={errors.work_result_rating}
                            >
                                <select
                                    id="work_result_rating"
                                    value={data.work_result_rating}
                                    onChange={(e) =>
                                        setData(
                                            'work_result_rating',
                                            e.target.value,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">{__('Not rated')}</option>
                                    {Object.entries(ratingLabels).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </Field>
                            <Field
                                id="behavior_rating"
                                label={__('Behaviour Rating')}
                                error={errors.behavior_rating}
                            >
                                <select
                                    id="behavior_rating"
                                    value={data.behavior_rating}
                                    onChange={(e) =>
                                        setData(
                                            'behavior_rating',
                                            e.target.value,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">{__('Not rated')}</option>
                                    {Object.entries(ratingLabels).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </Field>
                            <Field
                                id="performance_predicate"
                                label={__('Performance Predicate')}
                                error={errors.performance_predicate}
                            >
                                <select
                                    id="performance_predicate"
                                    value={data.performance_predicate}
                                    onChange={(e) =>
                                        setData(
                                            'performance_predicate',
                                            e.target.value,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="">{__('Not set')}</option>
                                    {Object.entries(predicateLabels)
                                        .reverse()
                                        .map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                </select>
                            </Field>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Field
                                id="skp_achievement"
                                label={__('Achievement (%)')}
                                error={errors.skp_achievement}
                            >
                                <Input
                                    id="skp_achievement"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    max={200}
                                    value={data.skp_achievement}
                                    onChange={(e) =>
                                        setData(
                                            'skp_achievement',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                id="points"
                                label={__('Points')}
                                error={errors.points}
                            >
                                <Input
                                    id="points"
                                    type="number"
                                    min={0}
                                    value={data.points}
                                    onChange={(e) =>
                                        setData('points', e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                id="status"
                                label={__('Status *')}
                                error={errors.status}
                            >
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    required
                                    className={selectClass}
                                >
                                    {Object.entries(statusLabels).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={close}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                        >
                            <Save className="h-4 w-4" />{' '}
                            {ept ? __('Save Changes') : __('Save Target')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
