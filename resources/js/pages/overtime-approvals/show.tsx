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
import { index as overtimeApprovalsIndex } from '@/routes/overtime-approvals';
import type { Auth } from '@/types';
import type { OvertimeRequest, OvertimeStatus } from '@/types/overtime';

interface PageProps {
    auth: Auth;
    overtimeRequest: OvertimeRequest;
}

const statusColors: Record<OvertimeStatus, string> = {
    draft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-750',
    pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/35 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    completed: 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    cancelled: 'bg-zinc-100 text-zinc-750 dark:bg-zinc-850 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
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
            alert('Please provide a reason for rejection.');

            return;
        }

        rejectForm.post(`/overtime-approvals/${overtimeRequest.id}/reject`);
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) {
return 'N/A';
}

        return new Date(dateStr).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    // Summarize hours if completed
    const totalPlannedHours = overtimeRequest.members?.reduce((acc, m) => acc + (parseFloat(m.planned_hours as string) || 0), 0) || 0;
    const totalActualHours = overtimeRequest.members?.reduce((acc, m) => acc + (parseFloat(m.actual_hours as string) || 0), 0) || 0;

    return (
        <>
            <Head title={`Overtime Request Approval - ${overtimeRequest.request_number}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Back to Approvals"
                        >
                            <Link href={overtimeApprovalsIndex()}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={`Overtime Request: ${overtimeRequest.request_number}`}
                            description={`Submitted by ${overtimeRequest.requester?.name || 'Unknown'} on ${
                                overtimeRequest.submitted_at
                                    ? new Date(overtimeRequest.submitted_at).toLocaleDateString(undefined, { dateStyle: 'long' })
                                    : 'N/A'
                            }`}
                        />
                    </div>
                    <Badge
                        variant="outline"
                        className={`${statusColors[overtimeRequest.status]} px-4 py-1.5 font-semibold capitalize`}
                    >
                        {overtimeRequest.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Overtime Details */}
                        <Card className="border dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Overtime Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            <User className="h-3 w-3" />
                                            <Label>Title / Purpose</Label>
                                        </div>
                                        <p className="mt-1 text-lg font-medium text-foreground">
                                            {overtimeRequest.title}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            <Clock className="h-3 w-3" />
                                            <Label>Planned Schedule</Label>
                                        </div>
                                        <p className="mt-1 font-medium text-sm text-foreground">
                                            {formatDateTime(overtimeRequest.planned_start_time)} to{' '}
                                            {formatDateTime(overtimeRequest.planned_end_time)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                                            Request Date: {new Date(overtimeRequest.request_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                        <FileText className="h-3 w-3" />
                                        <Label>Description / Reason</Label>
                                    </div>
                                    <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">
                                        {overtimeRequest.description || 'No description provided.'}
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
                                        {isCompleted ? 'Overtime Completion Report' : 'Team Members Involved'}
                                    </CardTitle>
                                </div>
                                {isCompleted && (
                                    <Badge variant="secondary" className="font-semibold text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        Done Completely &bull; Total: {totalActualHours} / {totalPlannedHours} hrs
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                <th className="py-3 px-6">Name</th>
                                                <th className="py-3 px-6">Role & Job Description</th>
                                                <th className="py-3 px-6 text-center">Planned Hours</th>
                                                <th className="py-3 px-6">Actual Time Range & Hours</th>
                                                <th className="py-3 px-6">Activity & Outcome</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                                            {overtimeRequest.members && overtimeRequest.members.length > 0 ? (
                                                overtimeRequest.members.map((member) => (
                                                    <tr key={member.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                                                        <td className="py-4 px-6 font-medium text-zinc-900 dark:text-zinc-50">
                                                            {member.employee?.name || 'Unknown'}
                                                        </td>
                                                        <td className="py-4 px-6 text-zinc-650 dark:text-zinc-400">
                                                            <div className="font-semibold text-zinc-900 dark:text-zinc-100">{member.role || '-'}</div>
                                                            <div className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">{member.job_desc || '-'}</div>
                                                        </td>
                                                        <td className="py-4 px-6 text-center font-medium text-zinc-700 dark:text-zinc-300">
                                                            {member.planned_hours} hrs
                                                        </td>
                                                        <td className="py-4 px-6 text-zinc-650 dark:text-zinc-400 text-xs">
                                                            {member.actual_hours ? (
                                                                <div>
                                                                    <span className="font-semibold text-blue-700 dark:text-blue-400">{member.actual_hours} hrs</span>
                                                                    <div className="text-[10px] text-muted-foreground mt-1">
                                                                        {formatDateTime(member.actual_start_time || '')} to <br />
                                                                        {formatDateTime(member.actual_end_time || '')}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground italic">Not reported yet</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6 text-zinc-650 dark:text-zinc-400 text-xs max-w-xs">
                                                            {member.actual_hours ? (
                                                                <div className="space-y-1">
                                                                    <div>
                                                                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Activity:</span>{' '}
                                                                        <span className="text-zinc-650 dark:text-zinc-350">{member.activity || '-'}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Outcome:</span>{' '}
                                                                        <span className="text-zinc-650 dark:text-zinc-350">{member.outcome || '-'}</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                                                        No members listed.
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
                                    <CardTitle className="text-lg font-semibold">Approval History</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {overtimeRequest.approval_logs && overtimeRequest.approval_logs.length > 0 ? (
                                    <div className="space-y-6">
                                        {overtimeRequest.approval_logs.map((log) => (
                                            <div
                                                key={log.id}
                                                className="relative border-l-2 border-primary py-1 pl-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                            {log.approver?.name || 'Approver'}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            log.status === 'approved'
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                        className="h-5 text-[10px] capitalize font-semibold"
                                                    >
                                                        {log.status}
                                                    </Badge>
                                                </div>
                                                {log.action_date && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatDateTime(log.action_date)}
                                                    </p>
                                                )}
                                                {log.notes && (
                                                    <p className="mt-2 text-sm text-zinc-650 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/50 border dark:border-zinc-800 p-2 rounded">
                                                        "{log.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No approval actions taken yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Process Approval */}
                        {isPending ? (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle>Process Approval</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="flex items-center gap-1.5 bg-yellow-100/50 border border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900 rounded p-2 text-[10px] text-yellow-800 dark:text-yellow-300 font-medium">
                                        <AlertCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                        Your action is required to approve or reject this request.
                                    </div>
                                    <Textarea
                                        placeholder="Add notes for this action..."
                                        value={approveForm.data.notes || rejectForm.data.notes}
                                        onChange={(e) => {
                                            approveForm.setData('notes', e.target.value);
                                            rejectForm.setData('notes', e.target.value);
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 cursor-pointer"
                                            onClick={handleReject}
                                            disabled={rejectForm.processing}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />{' '}
                                            Reject
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="default"
                                            onClick={handleApprove}
                                            disabled={approveForm.processing}
                                            className="cursor-pointer"
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                            Approve
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            !isCompleted && (
                                <div className="text-center p-4 border border-dashed rounded bg-muted/20 text-xs text-muted-foreground">
                                    <Clock className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                                    This request has already been processed: <span className="font-semibold text-foreground capitalize">{overtimeRequest.status}</span>
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
            title: 'Overtime Approvals',
            href: overtimeApprovalsIndex(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
