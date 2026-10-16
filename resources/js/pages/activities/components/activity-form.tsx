import { Link, useForm } from '@inertiajs/react';
import { FileText, Save } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import ActivityController from '@/actions/App/Http/Controllers/ActivityController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { __ } from '@/lib/i18n';
import {
    evidence as activityEvidence,
    index as activityIndex,
    show as activityShow,
} from '@/routes/activities';
import type {
    Activity,
    ActivityRubricOption,
    EptPeriodOption,
} from '@/types/remuneration';

export type ActivityFormOptions = {
    periods: EptPeriodOption[];
    rubrics: ActivityRubricOption[];
    organizations: { id: string; name: string }[];
    verifiers: { id: string; name: string; emp_number: string }[];
};

type Props = ActivityFormOptions & {
    activity?: Activity;
};

type FormData = {
    _method?: 'put';
    period_id: string;
    rubric_id: string;
    name: string;
    organization_id: string;
    document_number: string;
    verifier_id: string;
    evidence_file: File | null;
    evidence_link: string;
    shared_performance_evidence: boolean;
    performance_evidence_file: File | null;
    performance_evidence_link: string;
};

const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 bg-white dark:bg-zinc-900';

export const EVIDENCE_ACCEPT = '.pdf,.jpg,.jpeg,.png';

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
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function CurrentFile({ href }: { href: string }) {
    return (
        <a
            href={href}
            className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
        >
            <FileText className="h-3.5 w-3.5" /> {__('Download current file')}
        </a>
    );
}

export default function ActivityForm({
    activity,
    periods,
    rubrics,
    organizations,
    verifiers,
}: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        ...(activity ? { _method: 'put' as const } : {}),
        period_id: activity?.period_id ?? '',
        rubric_id: activity?.rubric_id ?? '',
        name: activity?.name ?? '',
        organization_id: activity?.organization_id ?? '',
        document_number: activity?.document_number ?? '',
        verifier_id: activity?.verifier_id ?? '',
        evidence_file: null,
        evidence_link: activity?.evidence_link ?? '',
        shared_performance_evidence:
            activity?.shared_performance_evidence ?? false,
        performance_evidence_file: null,
        performance_evidence_link: activity?.performance_evidence_link ?? '',
    });

    const rubricLocked = (activity?.performances_count ?? 0) > 0;

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();

        const url = activity
            ? ActivityController.update.url(activity.id)
            : ActivityController.store.url();

        post(url, { forceFormData: true });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {__('Activity')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {__('What was done, under which rubric and period.')}
                    </p>
                </div>

                <Field
                    id="name"
                    label={__('Activity Name *')}
                    error={errors.name}
                >
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder={__(
                            'e.g. Panitia Seminar Nasional Teknologi Informasi 2026',
                        )}
                        required
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        id="period_id"
                        label={__('Period *')}
                        error={errors.period_id}
                    >
                        <select
                            id="period_id"
                            value={data.period_id}
                            onChange={(e) =>
                                setData('period_id', e.target.value)
                            }
                            required
                            className={selectClass}
                        >
                            <option value="">{__('Select Period')}</option>
                            {periods.map((period) => (
                                <option key={period.id} value={period.id}>
                                    {period.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        id="rubric_id"
                        label={__('Rubric *')}
                        error={errors.rubric_id}
                        hint={
                            rubricLocked
                                ? __(
                                      'Locked because employees have already been added.',
                                  )
                                : undefined
                        }
                    >
                        <select
                            id="rubric_id"
                            value={data.rubric_id}
                            onChange={(e) =>
                                setData('rubric_id', e.target.value)
                            }
                            required
                            disabled={rubricLocked}
                            className={selectClass}
                        >
                            <option value="">{__('Select Rubric')}</option>
                            {rubrics.map((rubric) => (
                                <option key={rubric.id} value={rubric.id}>
                                    {rubric.code} — {rubric.activity}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        id="organization_id"
                        label={__('Organization')}
                        error={errors.organization_id}
                    >
                        <select
                            id="organization_id"
                            value={data.organization_id}
                            onChange={(e) =>
                                setData('organization_id', e.target.value)
                            }
                            className={selectClass}
                        >
                            <option value="">{__('None')}</option>
                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
                                >
                                    {organization.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        id="document_number"
                        label={__('Document Number')}
                        error={errors.document_number}
                    >
                        <Input
                            id="document_number"
                            value={data.document_number}
                            onChange={(e) =>
                                setData('document_number', e.target.value)
                            }
                            placeholder={__(
                                'e.g. SK Dekan No. 123/UN16.15/KPT/2026',
                            )}
                        />
                    </Field>

                    <Field
                        id="verifier_id"
                        label={__('Verifier')}
                        error={errors.verifier_id}
                        hint={__(
                            "Verifies the employees' performances. If the verifier is also involved, their own performance goes to their supervisor.",
                        )}
                    >
                        <select
                            id="verifier_id"
                            value={data.verifier_id}
                            onChange={(e) =>
                                setData('verifier_id', e.target.value)
                            }
                            className={selectClass}
                        >
                            <option value="">{__('Not assigned')}</option>
                            {verifiers.map((verifier) => (
                                <option key={verifier.id} value={verifier.id}>
                                    {verifier.name} ({verifier.emp_number})
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
            </div>

            <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {__('Activity Document')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {__(
                            'Assignment letter or other proof of the activity. PDF, JPG or PNG, up to 10 MB.',
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        id="evidence_file"
                        label={__('Document File')}
                        error={errors.evidence_file}
                        hint={
                            activity?.evidence_file ? (
                                <CurrentFile
                                    href={activityEvidence.url({
                                        activity: activity.id,
                                        type: 'document',
                                    })}
                                />
                            ) : undefined
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
                        label={__('Document Link')}
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
            </div>

            <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start gap-3">
                    <Checkbox
                        id="shared_performance_evidence"
                        checked={data.shared_performance_evidence}
                        onCheckedChange={(checked) =>
                            setData(
                                'shared_performance_evidence',
                                checked === true,
                            )
                        }
                        className="mt-1"
                    />
                    <div>
                        <Label
                            htmlFor="shared_performance_evidence"
                            className="text-base font-semibold"
                        >
                            {__('Shared performance evidence')}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            {__(
                                'One piece of evidence covers every employee in this activity. Leave unchecked to collect evidence per employee.',
                            )}
                        </p>
                    </div>
                </div>

                {data.shared_performance_evidence && (
                    <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2 dark:border-zinc-800">
                        <Field
                            id="performance_evidence_file"
                            label={__('Evidence File')}
                            error={errors.performance_evidence_file}
                            hint={
                                activity?.performance_evidence_file ? (
                                    <CurrentFile
                                        href={activityEvidence.url({
                                            activity: activity.id,
                                            type: 'performance',
                                        })}
                                    />
                                ) : undefined
                            }
                        >
                            <Input
                                id="performance_evidence_file"
                                type="file"
                                accept={EVIDENCE_ACCEPT}
                                onChange={(e) =>
                                    setData(
                                        'performance_evidence_file',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                        </Field>
                        <Field
                            id="performance_evidence_link"
                            label={__('Evidence Link')}
                            error={errors.performance_evidence_link}
                        >
                            <Input
                                id="performance_evidence_link"
                                type="url"
                                value={data.performance_evidence_link}
                                onChange={(e) =>
                                    setData(
                                        'performance_evidence_link',
                                        e.target.value,
                                    )
                                }
                                placeholder="https://"
                            />
                        </Field>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href={
                        activity
                            ? activityShow.url(activity.id)
                            : activityIndex.url()
                    }
                >
                    <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                    >
                        {__('Cancel')}
                    </Button>
                </Link>
                <Button
                    type="submit"
                    disabled={processing}
                    className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                >
                    <Save className="h-4 w-4" />{' '}
                    {activity ? __('Save Changes') : __('Save & Add Employees')}
                </Button>
            </div>
        </form>
    );
}
