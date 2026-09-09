import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronLeft,
    Clock,
    FileText,
    History,
    MapPin,
    Phone,
    User,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index, approve, reject } from '@/routes/leave-approvals';
import type { Auth, LeaveRequest, LeaveStatus } from '@/types';

interface PageProps {
    auth: Auth;
    leaveRequest: LeaveRequest;
}

const statusColors: Record<LeaveStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function LeaveApprovalShow({ leaveRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ notes: '' });

    const nextPendingApproval = leaveRequest.leave_approvals?.find(
        (a) => a.status === 'pending',
    );

    const isCurrentApprover =
        nextPendingApproval &&
        auth.user.id === nextPendingApproval.approver_id;

    const canApprove =
        isCurrentApprover &&
        auth.permissions.includes('leave.approval');

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(approve.url(leaveRequest.id));
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert('Please provide a reason for rejection.');

            return;
        }

        rejectForm.post(reject.url(leaveRequest.id));
    };

    return (
        <>
            <Head title={`Leave Request Approval - ${leaveRequest.employee?.name}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Back to Approvals"
                        >
                            <Link href={index().url}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={`Leave Request: ${leaveRequest.employee?.name}`}
                            description={`Submitted on ${leaveRequest.submitted_at || 'unknown date'}`}
                        />
                    </div>
                    <Badge
                        variant="outline"
                        className={`${statusColors[leaveRequest.status]} px-4 py-1 font-semibold`}
                    >
                        {leaveRequest.status.toUpperCase()}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Leave Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            <User className="h-3 w-3" />
                                            <Label>Leave Type</Label>
                                        </div>
                                        <p className="mt-1 text-lg font-medium text-foreground">
                                            {leaveRequest.leave_type?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            <Clock className="h-3 w-3" />
                                            <Label>Period</Label>
                                        </div>
                                        <p className="mt-1 font-medium text-sm text-foreground">
                                            {leaveRequest.start_date} to {leaveRequest.end_date}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                                            Total: {leaveRequest.total_days} days
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                        <FileText className="h-3 w-3" />
                                        <Label>Reason</Label>
                                    </div>
                                    <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">
                                        {leaveRequest.reason || 'No reason provided.'}
                                    </p>
                                </div>

                                {(leaveRequest.address_leave || leaveRequest.contact_leave) && (
                                    <div className="grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
                                        {leaveRequest.address_leave && (
                                            <div>
                                                <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                                    <MapPin className="h-3 w-3" />
                                                    <Label>Leave Address</Label>
                                                </div>
                                                <p className="mt-1 text-sm text-foreground">
                                                    {leaveRequest.address_leave}
                                                </p>
                                            </div>
                                        )}
                                        {leaveRequest.contact_leave && (
                                            <div>
                                                <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                                    <Phone className="h-3 w-3" />
                                                    <Label>Contact number</Label>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-foreground">
                                                    {leaveRequest.contact_leave}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-muted-foreground" />
                                    <CardTitle>Approval Workflow</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {leaveRequest.leave_approvals && leaveRequest.leave_approvals.length > 0 ? (
                                    <div className="space-y-6">
                                        {leaveRequest.leave_approvals.map((approval) => {
                                            const isAwaitingCurrent =
                                                nextPendingApproval?.id === approval.id;

                                            return (
                                                <div
                                                    key={approval.id}
                                                    className={`relative border-l-2 py-1 pl-4 ${
                                                        isAwaitingCurrent
                                                            ? 'border-yellow-400 dark:border-yellow-600'
                                                            : approval.status === 'approved'
                                                            ? 'border-green-500'
                                                            : approval.status === 'rejected'
                                                            ? 'border-red-500'
                                                            : 'border-muted'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                                Level {approval.level}
                                                            </p>
                                                            <p className="font-semibold mt-0.5 text-foreground">
                                                                {approval.approver?.name || 'Assigned Approver'}
                                                                {auth.user.id === approval.approver_id && ' (You)'}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                approval.status === 'approved'
                                                                    ? 'default'
                                                                    : approval.status === 'rejected'
                                                                    ? 'destructive'
                                                                    : 'outline'
                                                            }
                                                            className={`h-5 text-[10px] ${
                                                                approval.status === 'pending' && isAwaitingCurrent
                                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800'
                                                                    : approval.status === 'pending'
                                                                    ? 'bg-muted text-muted-foreground'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {approval.status.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    {approval.action_date && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {approval.action_date}
                                                        </p>
                                                    )}
                                                    {approval.notes && (
                                                        <p className="mt-2 text-sm text-muted-foreground italic bg-muted/30 p-2 rounded">
                                                            "{approval.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No approval workflow defined.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {canApprove ? (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle>Process Approval</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="flex items-center gap-1.5 bg-yellow-100/50 border border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900 rounded p-2 text-[10px] text-yellow-800 dark:text-yellow-300 font-medium">
                                        <AlertCircle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                        Your action is required for Level {nextPendingApproval.level}
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
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
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
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                            Approve
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : nextPendingApproval ? (
                            <div className="text-center p-4 border border-dashed rounded bg-muted/20 text-xs text-muted-foreground">
                                <Clock className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
                                Awaiting Level {nextPendingApproval.level} approval by{' '}
                                <span className="font-semibold text-foreground">
                                    {nextPendingApproval.approver?.name || 'Assigned Approver'}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

LeaveApprovalShow.layout = {
    breadcrumbs: [
        {
            title: 'Leave Approvals',
            href: index().url,
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
