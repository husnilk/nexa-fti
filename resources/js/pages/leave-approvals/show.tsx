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
import { __ } from '@/lib/i18n';
import { index, approve, reject } from '@/routes/leave-approvals';
import type { Auth, LeaveRequest, LeaveStatus } from '@/types';

interface PageProps {
    auth: Auth;
    leaveRequest: LeaveRequest;
}

const statusColors: Record<LeaveStatus, string> = {
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const statusLabels: Record<string, string> = {
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    cancelled: __('Cancelled'),
};

export default function LeaveApprovalShow({ leaveRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ notes: '' });

    const nextPendingApproval = leaveRequest.leave_approvals?.find(
        (a) => a.status === 'pending',
    );

    const isCurrentApprover =
        nextPendingApproval && auth.user.id === nextPendingApproval.approver_id;

    const canApprove =
        isCurrentApprover && auth.permissions.includes('leave.approval');

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(approve.url(leaveRequest.id));
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert(__('Please provide a reason for rejection.'));

            return;
        }

        rejectForm.post(reject.url(leaveRequest.id));
    };

    return (
        <>
            <Head
                title={__('Leave Request Approval - :name', {
                    name: leaveRequest.employee?.name,
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
                            <Link href={index().url}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={__('Leave Request: :name', {
                                name: leaveRequest.employee?.name,
                            })}
                            description={__('Submitted on :date', {
                                date:
                                    leaveRequest.submitted_at ||
                                    __('unknown date'),
                            })}
                        />
                    </div>
                    <Badge
                        variant="outline"
                        className={`${statusColors[leaveRequest.status]} px-4 py-1 font-semibold`}
                    >
                        {(
                            statusLabels[leaveRequest.status] ??
                            leaveRequest.status
                        ).toUpperCase()}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{__('Leave Details')}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            <User className="h-3 w-3" />
                                            <Label>{__('Leave Type')}</Label>
                                        </div>
                                        <p className="mt-1 text-lg font-medium text-foreground">
                                            {leaveRequest.leave_type?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            <Clock className="h-3 w-3" />
                                            <Label>{__('Period')}</Label>
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-foreground">
                                            {__(':start to :end', {
                                                start: leaveRequest.start_date,
                                                end: leaveRequest.end_date,
                                            })}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            {__('Total: :count days', {
                                                count: leaveRequest.total_days,
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        <FileText className="h-3 w-3" />
                                        <Label>{__('Reason')}</Label>
                                    </div>
                                    <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">
                                        {leaveRequest.reason ||
                                            __('No reason provided.')}
                                    </p>
                                </div>

                                {(leaveRequest.address_leave ||
                                    leaveRequest.contact_leave) && (
                                    <div className="grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
                                        {leaveRequest.address_leave && (
                                            <div>
                                                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    <MapPin className="h-3 w-3" />
                                                    <Label>
                                                        {__('Leave Address')}
                                                    </Label>
                                                </div>
                                                <p className="mt-1 text-sm text-foreground">
                                                    {leaveRequest.address_leave}
                                                </p>
                                            </div>
                                        )}
                                        {leaveRequest.contact_leave && (
                                            <div>
                                                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    <Phone className="h-3 w-3" />
                                                    <Label>
                                                        {__('Contact number')}
                                                    </Label>
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
                                    <CardTitle>
                                        {__('Approval Workflow')}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {leaveRequest.leave_approvals &&
                                leaveRequest.leave_approvals.length > 0 ? (
                                    <div className="space-y-6">
                                        {leaveRequest.leave_approvals.map(
                                            (approval) => {
                                                const isAwaitingCurrent =
                                                    nextPendingApproval?.id ===
                                                    approval.id;

                                                return (
                                                    <div
                                                        key={approval.id}
                                                        className={`relative border-l-2 py-1 pl-4 ${
                                                            isAwaitingCurrent
                                                                ? 'border-yellow-400 dark:border-yellow-600'
                                                                : approval.status ===
                                                                    'approved'
                                                                  ? 'border-green-500'
                                                                  : approval.status ===
                                                                      'rejected'
                                                                    ? 'border-red-500'
                                                                    : 'border-muted'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                                    {__(
                                                                        'Level :level',
                                                                        {
                                                                            level: approval.level,
                                                                        },
                                                                    )}
                                                                </p>
                                                                <p className="mt-0.5 font-semibold text-foreground">
                                                                    {approval
                                                                        .approver
                                                                        ?.name ||
                                                                        __(
                                                                            'Assigned Approver',
                                                                        )}
                                                                    {auth.user
                                                                        .id ===
                                                                        approval.approver_id &&
                                                                        ` ${__('(You)')}`}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    approval.status ===
                                                                    'approved'
                                                                        ? 'default'
                                                                        : approval.status ===
                                                                            'rejected'
                                                                          ? 'destructive'
                                                                          : 'outline'
                                                                }
                                                                className={`h-5 text-[10px] ${
                                                                    approval.status ===
                                                                        'pending' &&
                                                                    isAwaitingCurrent
                                                                        ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                                                                        : approval.status ===
                                                                            'pending'
                                                                          ? 'bg-muted text-muted-foreground'
                                                                          : ''
                                                                }`}
                                                            >
                                                                {(
                                                                    statusLabels[
                                                                        approval
                                                                            .status
                                                                    ] ??
                                                                    approval.status
                                                                ).toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                        {approval.action_date && (
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {
                                                                    approval.action_date
                                                                }
                                                            </p>
                                                        )}
                                                        {approval.notes && (
                                                            <p className="mt-2 rounded bg-muted/30 p-2 text-sm text-muted-foreground italic">
                                                                "
                                                                {approval.notes}
                                                                "
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        {__('No approval workflow defined.')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {canApprove ? (
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
                                            'Your action is required for Level :level',
                                            {
                                                level: nextPendingApproval.level,
                                            },
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
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
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
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                            {__('Approve')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : nextPendingApproval ? (
                            <div className="rounded border border-dashed bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                                <Clock className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
                                {__('Awaiting Level :level approval by', {
                                    level: nextPendingApproval.level,
                                })}{' '}
                                <span className="font-semibold text-foreground">
                                    {nextPendingApproval.approver?.name ||
                                        __('Assigned Approver')}
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
            title: __('Leave Approvals'),
            href: index().url,
        },
        {
            title: __('Detail'),
            href: '#',
        },
    ],
};
