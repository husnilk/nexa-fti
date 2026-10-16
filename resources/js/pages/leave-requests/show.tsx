import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ArrowLeft,
    Clock,
    FileText,
    History,
    MapPin,
    Phone,
    User,
    XCircle,
    Calendar,
    ClipboardList,
} from 'lucide-react';
import LeaveRequestController from '@/actions/App/Http/Controllers/Hr/LeaveRequestController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import type { Auth, LeaveRequest, LeaveStatus } from '@/types';

interface PageProps {
    auth: Auth;
    leaveRequest: LeaveRequest;
}

const statusColors: Record<LeaveStatus, string> = {
    pending:
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/35 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900',
    approved:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    rejected:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    cancelled:
        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
};

const statusLabels: Record<string, string> = {
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    cancelled: __('Cancelled'),
};

export default function LeaveRequestShow({ leaveRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ notes: '' });

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(LeaveRequestController.approve.url(leaveRequest.id));
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert(__('Please provide a reason for rejection.'));

            return;
        }

        rejectForm.post(LeaveRequestController.reject.url(leaveRequest.id));
    };

    const nextPendingApproval = leaveRequest.leave_approvals?.find(
        (a) => a.status === 'pending',
    );
    const canApprove =
        nextPendingApproval &&
        (auth.roles.includes('super-admin') ||
            auth.permissions.includes('leave.manage'));

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Leave Request - :name', {
                    name: leaveRequest.employee?.name,
                })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href={LeaveRequestController.index.url()}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {__('Leave Request Details')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Request from :name submitted on :date', {
                                name: leaveRequest.employee?.name,
                                date: leaveRequest.submitted_at,
                            })}
                        </p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={`${statusColors[leaveRequest.status]} rounded-full px-4 py-1.5 text-sm font-semibold capitalize`}
                >
                    {statusLabels[leaveRequest.status] ?? leaveRequest.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="size-5 text-primary" />
                                {__('Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Employee')}
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    <User className="size-4" />
                                    {leaveRequest.employee?.name}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Leave Type')}
                                </span>
                                <Badge variant="secondary">
                                    {leaveRequest.leave_type?.name}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Period')}
                                </span>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar className="size-4 text-muted-foreground" />
                                        {__(':start to :end', {
                                            start: leaveRequest.start_date,
                                            end: leaveRequest.end_date,
                                        })}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {__('Total: :count days', {
                                            count: leaveRequest.total_days,
                                        })}
                                    </span>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-sm text-[10px] font-bold font-medium tracking-wider text-muted-foreground uppercase">
                                    <FileText className="size-3" />
                                    {__('Reason')}
                                </div>
                                <p className="rounded-lg border bg-zinc-50 p-4 text-sm whitespace-pre-wrap text-zinc-700 italic dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300">
                                    "
                                    {leaveRequest.reason ||
                                        __('No reason provided.')}
                                    "
                                </p>
                            </div>

                            {(leaveRequest.address_leave ||
                                leaveRequest.contact_leave) && (
                                <>
                                    <Separator />
                                    <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                                        {leaveRequest.address_leave && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    <MapPin className="size-3" />
                                                    {__('Leave Address')}
                                                </div>
                                                <p className="pl-5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    {leaveRequest.address_leave}
                                                </p>
                                            </div>
                                        )}
                                        {leaveRequest.contact_leave && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    <Phone className="size-3" />
                                                    {__('Contact Number')}
                                                </div>
                                                <p className="pl-5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    {leaveRequest.contact_leave}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="size-5 text-primary" />
                                {__('Approval Workflow')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {leaveRequest.leave_approvals &&
                            leaveRequest.leave_approvals.length > 0 ? (
                                <div className="space-y-6">
                                    {leaveRequest.leave_approvals.map(
                                        (approval) => (
                                            <div
                                                key={approval.id}
                                                className="relative border-l-2 border-primary/30 py-1 pl-4 before:absolute before:top-2 before:-left-[5px] before:h-2 before:w-2 before:rounded-full before:bg-primary"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                            {__(
                                                                'Level :level',
                                                                {
                                                                    level: approval.level,
                                                                },
                                                            )}
                                                        </p>
                                                        <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {approval.approver
                                                                ?.name ||
                                                                __(
                                                                    'Assigned Approver',
                                                                )}
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
                                                        className={`h-5 text-[10px] font-bold uppercase ${
                                                            approval.status ===
                                                            'pending'
                                                                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                                                : ''
                                                        }`}
                                                    >
                                                        {statusLabels[
                                                            approval.status
                                                        ] ?? approval.status}
                                                    </Badge>
                                                </div>
                                                {approval.action_date && (
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {approval.action_date}
                                                    </p>
                                                )}
                                                {approval.notes && (
                                                    <p className="mt-2 rounded-md border bg-zinc-50 p-2 text-xs text-zinc-600 italic dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                                                        "{approval.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-sm text-muted-foreground italic">
                                        {__('No approval workflow defined.')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {canApprove && (
                        <Card className="border-primary/20 bg-primary/5 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {__('Process Approval')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="rounded border border-yellow-200 bg-yellow-100/50 p-2.5 text-[11px] font-bold tracking-wide text-yellow-800 uppercase">
                                    {__('Acting as Level :level Approver', {
                                        level: nextPendingApproval.level,
                                    })}
                                </div>
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder={__(
                                            'Add notes for this action...',
                                        )}
                                        className="min-h-[100px] bg-white dark:bg-zinc-900"
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
                                    <p className="text-[10px] text-muted-foreground">
                                        {__(
                                            'Notes are required for rejection.',
                                        )}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                        onClick={handleReject}
                                        disabled={rejectForm.processing}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />{' '}
                                        {__('Reject')}
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="cursor-pointer"
                                        onClick={handleApprove}
                                        disabled={approveForm.processing}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                        {__('Approve')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

LeaveRequestShow.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        {
            title: __('Leave Requests'),
            href: LeaveRequestController.index.url(),
        },
        { title: __('Request Details'), href: '#' },
    ],
};
