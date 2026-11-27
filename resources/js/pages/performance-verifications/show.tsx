import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ExternalLink,
    FileText,
    Info,
    Undo2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import PerformanceVerificationController from '@/actions/App/Http/Controllers/PerformanceVerificationController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import {
    activityEvidence,
    index as verificationIndex,
    performanceEvidence,
} from '@/routes/performance-verifications';
import type { Activity, ActivityPerformance } from '@/types/remuneration';
import {
    VERIFICATION_APPROVED,
    VERIFICATION_REJECTED,
    VERIFICATION_RETURNED,
    VerificationBadge,
} from './components/verification-status';

type PageProps = {
    activity: Activity;
    performances: ActivityPerformance[];
    ownPerformance: {
        status: number | null;
        supervisor: { id: string; name: string } | null;
    } | null;
};

type Decision = typeof VERIFICATION_REJECTED | typeof VERIFICATION_RETURNED;

function Item({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {label}
            </p>
            <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {children}
            </div>
        </div>
    );
}

function EvidenceLinks({
    fileHref,
    link,
}: {
    fileHref: string | null;
    link: string | null;
}) {
    if (!fileHref && !link) {
        return <span className="text-muted-foreground">-</span>;
    }

    return (
        <span className="flex flex-wrap items-center gap-3">
            {fileHref && (
                <a
                    href={fileHref}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                >
                    <FileText className="h-3.5 w-3.5" /> {__('File')}
                </a>
            )}
            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                >
                    <ExternalLink className="h-3.5 w-3.5" /> {__('Link')}
                </a>
            )}
        </span>
    );
}

const decisionText: Record<
    Decision,
    { title: string; action: string; description: string }
> = {
    [VERIFICATION_REJECTED]: {
        title: __('Reject Performance'),
        action: __('Reject'),
        description: __(
            'The performance will not count and can no longer be edited by the operator.',
        ),
    },
    [VERIFICATION_RETURNED]: {
        title: __('Return Performance'),
        action: __('Return for Correction'),
        description: __(
            'The operator can correct it; it comes back to you as pending once saved.',
        ),
    },
};

export default function VerificationShow({
    activity,
    performances,
    ownPerformance,
}: PageProps) {
    const [deciding, setDeciding] = useState<{
        performance: ActivityPerformance;
        status: Decision;
    } | null>(null);
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const form = useForm({
        status: VERIFICATION_REJECTED as number,
        reason: '',
    });

    function approve(performance: ActivityPerformance): void {
        setApprovingId(performance.id);
        router.post(
            PerformanceVerificationController.verify.url(performance.id),
            { status: VERIFICATION_APPROVED },
            { preserveScroll: true, onFinish: () => setApprovingId(null) },
        );
    }

    function openDecision(
        performance: ActivityPerformance,
        status: Decision,
    ): void {
        form.clearErrors();
        form.setData({ status, reason: '' });
        setDeciding({ performance, status });
    }

    function submitDecision(e: FormEvent): void {
        e.preventDefault();

        if (!deciding) {
            return;
        }

        form.post(
            PerformanceVerificationController.verify.url(
                deciding.performance.id,
            ),
            {
                preserveScroll: true,
                onSuccess: () => setDeciding(null),
            },
        );
    }

    const pending = performances.filter(
        (p) => (p.verification_status ?? 0) === 0,
    ).length;

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Verify: :name', { name: activity.name })} />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={verificationIndex()}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {activity.name}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {activity.rubric?.code} — {activity.rubric?.activity}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Item label={__('Period')}>{activity.period?.name}</Item>
                    <Item label={__('Organization')}>
                        {activity.organization?.name ?? '-'}
                    </Item>
                    <Item label={__('Document Number')}>
                        {activity.document_number || '-'}
                    </Item>
                    <Item label={__('Verifier')}>
                        {activity.verifier?.name ?? '-'}
                    </Item>
                    <Item label={__('Activity Document')}>
                        <EvidenceLinks
                            fileHref={
                                activity.evidence_file
                                    ? activityEvidence.url({
                                          activity: activity.id,
                                          type: 'document',
                                      })
                                    : null
                            }
                            link={activity.evidence_link}
                        />
                    </Item>
                    {activity.shared_performance_evidence && (
                        <Item label={__('Shared Performance Evidence')}>
                            <EvidenceLinks
                                fileHref={
                                    activity.performance_evidence_file
                                        ? activityEvidence.url({
                                              activity: activity.id,
                                              type: 'performance',
                                          })
                                        : null
                                }
                                link={activity.performance_evidence_link}
                            />
                        </Item>
                    )}
                </div>
            </div>

            {ownPerformance && (
                <div className="flex items-start gap-2 rounded-xl border bg-indigo-50 px-4 py-3 text-sm text-indigo-800 dark:border-zinc-800 dark:bg-indigo-950/35 dark:text-indigo-300">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    {ownPerformance.supervisor ? (
                        <span>
                            {__(
                                'You are also involved in this activity. Your own performance is verified by your supervisor,',
                            )}{' '}
                            <span className="font-semibold">
                                {ownPerformance.supervisor.name}
                            </span>
                            .
                        </span>
                    ) : (
                        <span>
                            {__(
                                'You are also involved in this activity, but no supervisor is set on your employee record, so nobody can verify your own performance yet.',
                            )}
                        </span>
                    )}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b px-6 py-4 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {__('Performances to Verify')}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                        {__(':pending pending of :total', {
                            pending,
                            total: performances.length,
                        })}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Employee')}</th>
                                <th className="px-6 py-4">{__('Position')}</th>
                                <th className="px-6 py-4 text-center">
                                    {__('Quantity')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Points')}
                                </th>
                                {!activity.shared_performance_evidence && (
                                    <th className="px-6 py-4">
                                        {__('Evidence')}
                                    </th>
                                )}
                                <th className="px-6 py-4">{__('Status')}</th>
                                <th className="px-6 py-4 text-right">
                                    {__('Decision')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {performances.length > 0 ? (
                                performances.map((performance) => (
                                    <tr
                                        key={performance.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="block font-semibold text-zinc-900 dark:text-zinc-50">
                                                {performance.employee?.name}
                                            </span>
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {
                                                    performance.employee
                                                        ?.emp_number
                                                }
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {performance.position ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-zinc-700 dark:text-zinc-300">
                                            {performance.quantity ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono font-semibold text-indigo-700 dark:text-indigo-400">
                                            {performance.points ?? '-'}
                                        </td>
                                        {!activity.shared_performance_evidence && (
                                            <td className="px-6 py-4">
                                                <EvidenceLinks
                                                    fileHref={
                                                        performance.evidence_file
                                                            ? performanceEvidence.url(
                                                                  performance.id,
                                                              )
                                                            : null
                                                    }
                                                    link={
                                                        performance.evidence_link
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <VerificationBadge
                                                status={
                                                    performance.verification_status
                                                }
                                            />
                                            {performance.verification_reason && (
                                                <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                                                    {
                                                        performance.verification_reason
                                                    }
                                                </p>
                                            )}
                                            {performance.verifier && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {__('by :name', {
                                                        name: performance
                                                            .verifier.name,
                                                    })}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        approvingId ===
                                                            performance.id ||
                                                        performance.verification_status ===
                                                            VERIFICATION_APPROVED
                                                    }
                                                    onClick={() =>
                                                        approve(performance)
                                                    }
                                                    className="cursor-pointer gap-1 text-emerald-700 dark:text-emerald-400"
                                                >
                                                    <Check className="h-4 w-4" />{' '}
                                                    {__('Approve')}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        performance.verification_status ===
                                                        VERIFICATION_RETURNED
                                                    }
                                                    onClick={() =>
                                                        openDecision(
                                                            performance,
                                                            VERIFICATION_RETURNED,
                                                        )
                                                    }
                                                    className="cursor-pointer gap-1 text-amber-700 dark:text-amber-400"
                                                >
                                                    <Undo2 className="h-4 w-4" />{' '}
                                                    {__('Return')}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        performance.verification_status ===
                                                        VERIFICATION_REJECTED
                                                    }
                                                    onClick={() =>
                                                        openDecision(
                                                            performance,
                                                            VERIFICATION_REJECTED,
                                                        )
                                                    }
                                                    className="cursor-pointer gap-1 text-rose-700 dark:text-rose-400"
                                                >
                                                    <X className="h-4 w-4" />{' '}
                                                    {__('Reject')}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No performances for you to verify in this activity.',
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={deciding !== null}
                onOpenChange={(open) => !open && setDeciding(null)}
            >
                <DialogContent>
                    {deciding && (
                        <form onSubmit={submitDecision} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>
                                    {decisionText[deciding.status].title}
                                </DialogTitle>
                                <DialogDescription>
                                    {deciding.performance.employee?.name} —{' '}
                                    {deciding.performance.position}.{' '}
                                    {decisionText[deciding.status].description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-2">
                                <Label htmlFor="reason">{__('Reason *')}</Label>
                                <Textarea
                                    id="reason"
                                    value={form.data.reason}
                                    onChange={(e) =>
                                        form.setData('reason', e.target.value)
                                    }
                                    maxLength={191}
                                    rows={3}
                                    required
                                    placeholder={__(
                                        'Explain what is wrong or what needs to be corrected.',
                                    )}
                                />
                                {form.errors.reason && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.reason}
                                    </p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeciding(null)}
                                    className="cursor-pointer"
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant={
                                        deciding.status ===
                                        VERIFICATION_REJECTED
                                            ? 'destructive'
                                            : 'default'
                                    }
                                    disabled={form.processing}
                                    className="cursor-pointer"
                                >
                                    {decisionText[deciding.status].action}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

VerificationShow.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Verification'), href: verificationIndex() },
        { title: __('Activity'), href: '' },
    ],
};
