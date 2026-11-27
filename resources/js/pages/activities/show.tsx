import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ExternalLink,
    FileText,
    Pencil,
    Trash2,
    UserPlus,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import PerformanceController from '@/actions/App/Http/Controllers/PerformanceController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { __, intlLocale } from '@/lib/i18n';
import {
    edit as activityEdit,
    evidence as activityEvidence,
    index as activityIndex,
} from '@/routes/activities';
import { evidence as performanceEvidence } from '@/routes/performances';
import type { Auth } from '@/types';
import type { Activity, ActivityPerformance } from '@/types/remuneration';
import {
    VerificationBadge,
    isLocked,
} from '../performance-verifications/components/verification-status';
import PerformanceFormModal from './components/performance-form-modal';

type PageProps = {
    auth: Auth;
    activity: Activity;
    employees: { id: string; name: string; emp_number: string }[];
};

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

export default function ActivityShow({ activity, employees = [] }: PageProps) {
    const { auth, errors } = usePage<
        PageProps & { errors: Record<string, string> }
    >().props;
    const mayManage =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('activity.manage');

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ActivityPerformance | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [removing, setRemoving] = useState<ActivityPerformance | null>(null);

    const performances = activity.performances ?? [];
    const totalPoints = performances.reduce(
        (sum, p) => sum + (p.points ?? 0),
        0,
    );
    const maxEmployees = activity.rubric?.rule_max_employee ?? -1;
    const isFull = maxEmployees >= 0 && performances.length >= maxEmployees;
    const hasPositions = (activity.rubric?.details ?? []).length > 0;

    function openForm(performance: ActivityPerformance | null): void {
        setEditing(performance);
        setFormKey((key) => key + 1);
        setModalOpen(true);
    }

    function removePerformance(): void {
        if (!removing) {
            return;
        }

        router.delete(
            PerformanceController.destroy.url({
                activity: activity.id,
                performance: removing.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => setRemoving(null),
            },
        );
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={activity.name} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Link href={activityIndex()}>
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
                            {activity.rubric?.code} —{' '}
                            {activity.rubric?.activity}
                        </p>
                    </div>
                </div>
                {mayManage && (
                    <Link href={activityEdit(activity.id)}>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 border-zinc-200 font-medium shadow-xs dark:border-zinc-800"
                        >
                            <Pencil className="h-4 w-4" /> {__('Edit Activity')}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Item label={__('Period')}>{activity.period?.name}</Item>
                    <Item label={__('Organization')}>
                        {activity.organization?.name ?? '-'}
                    </Item>
                    <Item label={__('Document Number')}>
                        {activity.document_number || '-'}
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
                    <Item label={__('Performance Evidence')}>
                        {activity.shared_performance_evidence ? (
                            <span className="space-y-1">
                                <span className="block text-xs text-muted-foreground">
                                    {__('Shared by all employees')}
                                </span>
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
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                {__('Per employee')}
                            </span>
                        )}
                    </Item>
                    <Item label={__('Verifier')}>
                        {activity.verifier?.name ?? __('Not assigned')}
                    </Item>
                    <Item label={__('Recorded By')}>
                        {activity.creator?.name ?? '-'}
                    </Item>
                </div>
            </div>

            {(errors.performance || errors.activity) && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-400">
                    {errors.performance ?? errors.activity}
                </p>
            )}

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            {__('Employees Involved')}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            {performances.length}
                            {maxEmployees >= 0 && ` / ${maxEmployees}`} ·{' '}
                            {__(':points pts', {
                                points: totalPoints.toLocaleString(
                                    intlLocale(),
                                ),
                            })}
                        </span>
                    </div>
                    {mayManage && (
                        <Button
                            onClick={() => openForm(null)}
                            disabled={isFull || !hasPositions}
                            className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                        >
                            <UserPlus className="h-4 w-4" />{' '}
                            {__('Add Employee')}
                        </Button>
                    )}
                </div>

                {mayManage && !hasPositions && (
                    <p className="border-b bg-amber-50 px-6 py-3 text-sm text-amber-700 dark:border-zinc-800 dark:bg-amber-950/35 dark:text-amber-400">
                        {__(
                            'This rubric has no active positions yet. Add positions to the rubric before adding employees.',
                        )}
                    </p>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Emp #')}</th>
                                <th className="px-6 py-4">
                                    {__('Employee Name')}
                                </th>
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
                                <th className="px-6 py-4">
                                    {__('Verification')}
                                </th>
                                {mayManage && (
                                    <th className="px-6 py-4 text-right">
                                        {__('Actions')}
                                    </th>
                                )}
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
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {
                                                    performance.employee
                                                        ?.emp_number
                                                }
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {performance.employee?.name}
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
                                                                  {
                                                                      activity:
                                                                          activity.id,
                                                                      performance:
                                                                          performance.id,
                                                                  },
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
                                        </td>
                                        {mayManage && (
                                            <td className="px-6 py-4 text-right">
                                                {isLocked(
                                                    performance.verification_status,
                                                ) ? (
                                                    <span className="text-xs text-muted-foreground">
                                                        {__('Locked')}
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            onClick={() =>
                                                                openForm(
                                                                    performance,
                                                                )
                                                            }
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                setRemoving(
                                                                    performance,
                                                                )
                                                            }
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No employees added yet.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {mayManage && (
                <PerformanceFormModal
                    key={formKey}
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    activity={activity}
                    performance={editing}
                    employees={employees}
                />
            )}

            <Dialog
                open={removing !== null}
                onOpenChange={(open) => !open && setRemoving(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Remove Employee')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground italic">
                        {__('Remove :name from this activity?', {
                            name: removing?.employee?.name,
                        })}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRemoving(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={removePerformance}
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

ActivityShow.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Activities'), href: activityIndex() },
        { title: __('Detail'), href: '' },
    ],
};
