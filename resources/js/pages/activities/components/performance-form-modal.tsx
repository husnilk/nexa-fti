import { useForm } from '@inertiajs/react';
import { FileText, Save } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import PerformanceController from '@/actions/App/Http/Controllers/PerformanceController';
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
import { evidence as performanceEvidence } from '@/routes/performances';
import type { Activity, ActivityPerformance } from '@/types/remuneration';
import { EVIDENCE_ACCEPT } from './activity-form';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    activity: Activity;
    performance: ActivityPerformance | null;
    employees: { id: string; name: string; emp_number: string }[];
};

type FormData = {
    _method?: 'put';
    employee_id: string;
    rubric_detail_id: string;
    quantity: string;
    points: string;
    evidence_file: File | null;
    evidence_link: string;
};

const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 bg-white dark:bg-zinc-900';

function Field({
    id,
    label,
    error,
    hint,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    hint?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-1.5">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

/**
 * Add or edit an employee's involvement. Mount with a fresh `key` per open.
 */
export default function PerformanceFormModal({
    open,
    onOpenChange,
    activity,
    performance,
    employees,
}: Props) {
    const details = activity.rubric?.details ?? [];
    const perEmployeeEvidence = !activity.shared_performance_evidence;

    const { data, setData, post, processing, errors, clearErrors } =
        useForm<FormData>({
            ...(performance ? { _method: 'put' as const } : {}),
            employee_id: performance?.employee_id ?? '',
            rubric_detail_id:
                performance?.rubric_detail_id ?? details[0]?.id ?? '',
            quantity: String(performance?.quantity ?? 1),
            points:
                performance &&
                performance.rubric_detail &&
                !performance.rubric_detail.is_fixed_poin
                    ? String(performance.points ?? '')
                    : '',
            evidence_file: null,
            evidence_link: performance?.evidence_link ?? '',
        });

    const takenEmployeeIds = new Set(
        (activity.performances ?? [])
            .filter((p) => p.id !== performance?.id)
            .map((p) => p.employee_id),
    );
    const availableEmployees = employees.filter(
        (emp) => !takenEmployeeIds.has(emp.id),
    );

    const detail = details.find((d) => d.id === data.rubric_detail_id);
    const computedPoints = detail
        ? detail.poin * (Number(data.quantity) || 0)
        : 0;
    const isFixed = Boolean(detail?.is_fixed_poin);

    function close(): void {
        onOpenChange(false);
        clearErrors();
    }

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();

        const url = performance
            ? PerformanceController.update.url({
                  activity: activity.id,
                  performance: performance.id,
              })
            : PerformanceController.store.url(activity.id);

        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: close,
        });
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => (value ? onOpenChange(true) : close())}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {performance
                            ? __('Edit Employee Involvement')
                            : __('Add Employee')}
                    </DialogTitle>
                    <DialogDescription>
                        {performance
                            ? __("Update :name's role in this activity.", {
                                  name: performance.employee?.name,
                              })
                            : __(
                                  'Add an employee involved in this activity and choose their position.',
                              )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                            <option value="">{__('Select Employee')}</option>
                            {availableEmployees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.emp_number})
                                </option>
                            ))}
                        </select>
                    </Field>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field
                            id="rubric_detail_id"
                            label={__('Position *')}
                            error={errors.rubric_detail_id}
                        >
                            <select
                                id="rubric_detail_id"
                                value={data.rubric_detail_id}
                                onChange={(e) =>
                                    setData('rubric_detail_id', e.target.value)
                                }
                                required
                                className={selectClass}
                            >
                                <option value="">
                                    {__('Select Position')}
                                </option>
                                {details.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {__(':position (:points pts)', {
                                            position: d.position,
                                            points: d.poin,
                                        })}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field
                            id="quantity"
                            label={
                                activity.rubric?.unit
                                    ? __('Quantity * (:unit)', {
                                          unit: activity.rubric.unit,
                                      })
                                    : __('Quantity *')
                            }
                            error={errors.quantity}
                        >
                            <Input
                                id="quantity"
                                type="number"
                                step="0.01"
                                min={0}
                                value={data.quantity}
                                onChange={(e) =>
                                    setData('quantity', e.target.value)
                                }
                                required
                            />
                        </Field>
                    </div>

                    <Field
                        id="points"
                        label={__('Points')}
                        error={errors.points}
                        hint={
                            isFixed
                                ? __(
                                      'This position has fixed points: position points × quantity.',
                                  )
                                : __(
                                      'Leave blank to use position points × quantity.',
                                  )
                        }
                    >
                        <Input
                            id="points"
                            type="number"
                            step="0.01"
                            min={0}
                            value={
                                isFixed ? String(computedPoints) : data.points
                            }
                            placeholder={String(computedPoints)}
                            onChange={(e) => setData('points', e.target.value)}
                            disabled={isFixed}
                        />
                    </Field>

                    {perEmployeeEvidence ? (
                        <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2 dark:border-zinc-800">
                            <Field
                                id="evidence_file"
                                label={__('Evidence File')}
                                error={errors.evidence_file}
                                hint={
                                    performance?.evidence_file ? (
                                        <a
                                            href={performanceEvidence.url({
                                                activity: activity.id,
                                                performance: performance.id,
                                            })}
                                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            <FileText className="h-3.5 w-3.5" />{' '}
                                            {__('Download current file')}
                                        </a>
                                    ) : (
                                        __('PDF, JPG or PNG, up to 10 MB.')
                                    )
                                }
                            >
                                <Input
                                    id="evidence_file"
                                    type="file"
                                    accept={EVIDENCE_ACCEPT}
                                    onChange={(e) =>
                                        setData(
                                            'evidence_file',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                            </Field>
                            <Field
                                id="evidence_link"
                                label={__('Evidence Link')}
                                error={errors.evidence_link}
                            >
                                <Input
                                    id="evidence_link"
                                    type="url"
                                    value={data.evidence_link}
                                    onChange={(e) =>
                                        setData('evidence_link', e.target.value)
                                    }
                                    placeholder="https://"
                                />
                            </Field>
                        </div>
                    ) : (
                        <p className="rounded-lg border bg-zinc-50 p-3 text-sm text-muted-foreground dark:border-zinc-800 dark:bg-zinc-900/50">
                            {__(
                                'This activity uses shared evidence, so no evidence is needed per employee.',
                            )}
                        </p>
                    )}

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
                            {performance
                                ? __('Save Changes')
                                : __('Add Employee')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
