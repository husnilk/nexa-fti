import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronLeft,
    Clock,
    FileText,
    History,
    User,
    Users,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __, intlLocale } from '@/lib/i18n';
import { index as overtimeApprovalsIndex } from '@/routes/overtime-approvals';
import type { Auth } from '@/types';
import type { OvertimeRequest, OvertimeStatus } from '@/types/overtime';

interface PageProps {
    auth: Auth;
    overtimeRequest: OvertimeRequest;
}

const statusColors: Record<OvertimeStatus, string> = {
    draft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-750',
    pending:
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/35 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900',
    approved:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    rejected:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    completed:
        'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    cancelled:
        'bg-zinc-100 text-zinc-750 dark:bg-zinc-850 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
};

const statusLabels: Record<string, string> = {
    draft: __('Draft'),
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    completed: __('Completed'),
    cancelled: __('Cancelled'),
};

export default function OvertimeApprovalShow({ overtimeRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ notes: '' });

    const isPending = overtimeRequest.status === 'pending';
    const isCompleted = overtimeRequest.status === 'completed';

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(`/overtime-approvals/${overtimeRequest.id}/approve`);
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert(__('Please provide a reason for rejection.'));

            return;
        }

        rejectForm.post(`/overtime-approvals/${overtimeRequest.id}/reject`);
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) {
            return __('N/A');
        }

        return new Date(dateStr).toLocaleString(intlLocale(), {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    // Summarize hours if completed
    const totalPlannedHours =
        overtimeRequest.members?.reduce(
            (acc, m) => acc + (parseFloat(m.planned_hours as string) || 0),
            0,
        ) || 0;
    const totalActualHours =
        overtimeRequest.members?.reduce(
            (acc, m) => acc + (parseFloat(m.actual_hours as string) || 0),
            0,
        ) || 0;

    return (
        <>
            <Head
                title={__('Overtime Request Approval - :number', {
                    number: overtimeRequest.request_number,
                })}
            />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title={__('Back to Approvals')}
                        >
                            <Link href={overtimeApprovalsIndex()}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={__('Overtime Request: :number', {
                                number: overtimeRequest.request_number,
                            })}
                            description={__('Submitted by :name on :date', {
                                name:
                                    overtimeRequest.requester?.name ||
                                    __('Unknown'),
                                date: overtimeRequest.submitted_at
                                    ? new Date(
                                          overtimeRequest.submitted_at,
                                      ).toLocaleDateString(intlLocale(), {
                                          dateStyle: 'long',
                                      })
                                    : __('N/A'),
                            })}
                        />
                    </div>
                    <Badge
                        variant="outline"
                        className={`${statusColors[overtimeRequest.status]} px-4 py-1.5 font-semibold capitalize`}
                    >
                        {statusLabels[overtimeRequest.status] ??
                            overtimeRequest.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Overtime Details */}
                        <Card className="border dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    {__('Overtime Details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            <User className="h-3 w-3" />
                                            <Label>
                                                {__('Title / Purpose')}
                                            </Label>
                                        </div>
                                        <p className="mt-1 text-lg font-medium text-foreground">
                                            {overtimeRequest.title}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            <Clock className="h-3 w-3" />
                                            <Label>
                                                {__('Planned Schedule')}
                                            </Label>
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-foreground">
                                            {__(':start to :end', {
                                                start: formatDateTime(
                                                    overtimeRequest.planned_start_time,
                                                ),
                                                end: formatDateTime(
                                                    overtimeRequest.planned_end_time,
                                                ),
                                            })}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            {__('Request Date: :date', {
                                                date: new Date(
                                                    overtimeRequest.request_date,
                                                ).toLocaleDateString(
                                                    intlLocale(),
                                                    { dateStyle: 'medium' },
                                                ),
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        <FileText className="h-3 w-3" />
                                        <Label>
                                            {__('Description / Reason')}
                                        </Label>
                                    </div>
                                    <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">
                                        {overtimeRequest.description ||
                                            __('No description provided.')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Members and Report Card */}
                        <Card className="border dark:border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-lg font-semibold">
                                        {isCompleted
                                            ? __('Overtime Completion Report')
                                            : __('Team Members Involved')}
                                    </CardTitle>
                                </div>
                                {isCompleted && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-50 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                    >
                                        {__(
                                            'Done Completely • Total: :actual / :planned hrs',
                                            {
                                                actual: totalActualHours,
                                                planned: totalPlannedHours,
                                            },
                                        )}
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                                <th className="px-6 py-3">
                                                    {__('Name')}
                                                </th>
                                                <th className="px-6 py-3">
                                                    {__(
                                                        'Role & Job Description',
                                                    )}
                                                </th>
                                                <th className="px-6 py-3 text-center">
                                                    {__('Planned Hours')}
                                                </th>
                                                <th className="px-6 py-3">
                                                    {__(
                                                        'Actual Time Range & Hours',
                                                    )}
                                                </th>
                                                <th className="px-6 py-3">
                                                    {__('Activity & Outcome')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                            {overtimeRequest.members &&
                                            overtimeRequest.members.length >
                                                0 ? (
                                                overtimeRequest.members.map(
                                                    (member) => (
                                                        <tr
                                                            key={member.id}
                                                            className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                                        >
                                                            <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                                                                {member.employee
                                                                    ?.name ||
                                                                    __(
                                                                        'Unknown',
                                                                    )}
                                                            </td>
                                                            <td className="text-zinc-650 px-6 py-4 dark:text-zinc-400">
                                                                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                                    {member.role ||
                                                                        '-'}
                                                                </div>
                                                                <div className="mt-0.5 text-xs whitespace-pre-wrap text-muted-foreground">
                                                                    {member.job_desc ||
                                                                        '-'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center font-medium text-zinc-700 dark:text-zinc-300">
                                                                {__(
                                                                    ':hours hrs',
                                                                    {
                                                                        hours: member.planned_hours,
                                                                    },
                                                                )}
                                                            </td>
                                                            <td className="text-zinc-650 px-6 py-4 text-xs dark:text-zinc-400">
                                                                {member.actual_hours ? (
                                                                    <div>
                                                                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                                                                            {__(
                                                                                ':hours hrs',
                                                                                {
                                                                                    hours: member.actual_hours,
                                                                                },
                                                                            )}
                                                                        </span>
                                                                        <div className="mt-1 text-[10px] text-muted-foreground">
                                                                            {__(
                                                                                ':start to',
                                                                                {
                                                                                    start: formatDateTime(
                                                                                        member.actual_start_time ||
                                                                                            '',
                                                                                    ),
                                                                                },
                                                                            )}{' '}
                                                                            <br />
                                                                            {formatDateTime(
                                                                                member.actual_end_time ||
                                                                                    '',
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground italic">
                                                                        {__(
                                                                            'Not reported yet',
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="text-zinc-650 max-w-xs px-6 py-4 text-xs dark:text-zinc-400">
                                                                {member.actual_hours ? (
                                                                    <div className="space-y-1">
                                                                        <div>
                                                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                                                {__(
                                                                                    'Activity:',
                                                                                )}
                                                                            </span>{' '}
                                                                            <span className="text-zinc-650 dark:text-zinc-350">
                                                                                {member.activity ||
                                                                                    '-'}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                                                {__(
                                                                                    'Outcome:',
                                                                                )}
                                                                            </span>{' '}
                                                                            <span className="text-zinc-650 dark:text-zinc-350">
                                                                                {member.outcome ||
                                                                                    '-'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground">
                                                                        -
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="py-4 text-center text-muted-foreground"
                                                    >
                                                        {__(
                                                            'No members listed.',
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Approval logs */}
                        <Card className="border dark:border-zinc-800">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle className="text-lg font-semibold">
                                        {__('Approval History')}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {overtimeRequest.approval_logs &&
                                overtimeRequest.approval_logs.length > 0 ? (
                                    <div className="space-y-6">
                                        {overtimeRequest.approval_logs.map(
                                            (log) => (
                                                <div
                                                    key={log.id}
                                                    className="relative border-l-2 border-primary py-1 pl-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                                {log.approver
                                                                    ?.name ||
                                                                    __(
                                                                        'Approver',
                                                                    )}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                log.status ===
                                                                'approved'
                                                                    ? 'default'
                                                                    : 'destructive'
                                                            }
                                                            className="h-5 text-[10px] font-semibold capitalize"
                                                        >
                                                            {statusLabels[
                                                                log.status
                                                            ] ?? log.status}
                                                        </Badge>
                                                    </div>
                                                    {log.action_date && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {formatDateTime(
                                                                log.action_date,
                                                            )}
                                                        </p>
                                                    )}
                                                    {log.notes && (
                                                        <p className="text-zinc-650 mt-2 rounded border bg-zinc-50 p-2 text-sm italic dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                                                            "{log.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        {__('No approval actions taken yet.')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Process Approval */}
                        {isPending ? (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle>
                                        {__('Process Approval')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="flex items-center gap-1.5 rounded border border-yellow-200 bg-yellow-100/50 p-2 text-[10px] font-medium text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-300">
                                        <AlertCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                        {__(
                                            'Your action is required to approve or reject this request.',
                                        )}
                                    </div>
                                    <Textarea
                                        placeholder={__(
                                            'Add notes for this action...',
                                        )}
                                        value={
                                            approveForm.data.notes ||
                                            rejectForm.data.notes
                                        }
                                        onChange={(e) => {
                                            approveForm.setData(
                                                'notes',
                                                e.target.value,
                                            );
                                            rejectForm.setData(
                                                'notes',
                                                e.target.value,
                                            );
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="cursor-pointer border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                                            onClick={handleReject}
                                            disabled={rejectForm.processing}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />{' '}
                                            {__('Reject')}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="default"
                                            onClick={handleApprove}
                                            disabled={approveForm.processing}
                                            className="cursor-pointer"
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                            {__('Approve')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            !isCompleted && (
                                <div className="rounded border border-dashed bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                                    <Clock className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
                                    {__(
                                        'This request has already been processed:',
                                    )}{' '}
                                    <span className="font-semibold text-foreground capitalize">
                                        {statusLabels[overtimeRequest.status] ??
                                            overtimeRequest.status}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

OvertimeApprovalShow.layout = {
    breadcrumbs: [
        {
            title: __('Overtime Approvals'),
            href: overtimeApprovalsIndex(),
        },
        {
            title: __('Detail'),
            href: '#',
        },
    ],
};
