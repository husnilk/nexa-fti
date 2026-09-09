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
            alert('Please provide a reason for rejection.');

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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Leave Request - ${leaveRequest.employee?.name}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={LeaveRequestController.index.url()}>
                        <Button variant="outline" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Leave Request Details
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Request from {leaveRequest.employee?.name} submitted on {leaveRequest.submitted_at}
                        </p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={`${statusColors[leaveRequest.status]} px-4 py-1.5 text-sm font-semibold rounded-full capitalize`}
                >
                    {leaveRequest.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="size-5 text-primary" />
                                Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Employee</span>
                                <div className="flex items-center gap-2 font-medium">
                                    <User className="size-4" />
                                    {leaveRequest.employee?.name}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Leave Type</span>
                                <Badge variant="secondary">
                                    {leaveRequest.leave_type?.name}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Period</span>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar className="size-4 text-muted-foreground" />
                                        {leaveRequest.start_date} to {leaveRequest.end_date}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Total: {leaveRequest.total_days} days
                                    </span>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                    <FileText className="size-3" />
                                    Reason
                                </div>
                                <p className="text-sm bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-lg border dark:border-zinc-800 whitespace-pre-wrap italic text-zinc-700 dark:text-zinc-300">
                                    "{leaveRequest.reason || 'No reason provided.'}"
                                </p>
                            </div>

                            {(leaveRequest.address_leave || leaveRequest.contact_leave) && (
                                <>
                                    <Separator />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        {leaveRequest.address_leave && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                                    <MapPin className="size-3" />
                                                    Leave Address
                                                </div>
                                                <p className="text-sm font-medium pl-5 text-zinc-700 dark:text-zinc-300">
                                                    {leaveRequest.address_leave}
                                                </p>
                                            </div>
                                        )}
                                        {leaveRequest.contact_leave && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                                    <Phone className="size-3" />
                                                    Contact Number
                                                </div>
                                                <p className="text-sm font-medium pl-5 text-zinc-700 dark:text-zinc-300">
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
                                Approval Workflow
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {leaveRequest.leave_approvals && leaveRequest.leave_approvals.length > 0 ? (
                                <div className="space-y-6">
                                    {leaveRequest.leave_approvals.map((approval) => (
                                        <div
                                            key={approval.id}
                                            className="relative border-l-2 border-primary/30 py-1 pl-4 before:absolute before:-left-[5px] before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                        Level {approval.level}
                                                    </p>
                                                    <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {approval.approver?.name || 'Assigned Approver'}
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
                                                    className={`h-5 text-[10px] font-bold uppercase ${
                                                        approval.status === 'pending'
                                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                            : ''
                                                    }`}
                                                >
                                                    {approval.status}
                                                </Badge>
                                            </div>
                                            {approval.action_date && (
                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {approval.action_date}
                                                </p>
                                            )}
                                            {approval.notes && (
                                                <p className="mt-2 rounded-md bg-zinc-50 dark:bg-zinc-950/50 border dark:border-zinc-800 p-2 text-xs italic text-zinc-600 dark:text-zinc-400">
                                                    "{approval.notes}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-sm text-muted-foreground italic">No approval workflow defined.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {canApprove && (
                        <Card className="border-primary/20 bg-primary/5 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Process Approval</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="bg-yellow-100/50 border border-yellow-200 rounded p-2.5 text-[11px] text-yellow-800 font-bold uppercase tracking-wide">
                                    Acting as Level {nextPendingApproval.level} Approver
                                </div>
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Add notes for this action..."
                                        className="min-h-[100px] bg-white dark:bg-zinc-900"
                                        value={approveForm.data.notes || rejectForm.data.notes}
                                        onChange={(e) => {
                                            approveForm.setData('notes', e.target.value);
                                            rejectForm.setData('notes', e.target.value);
                                        }}
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Notes are required for rejection.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                                        onClick={handleReject}
                                        disabled={rejectForm.processing}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="cursor-pointer"
                                        onClick={handleApprove}
                                        disabled={approveForm.processing}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
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
        { title: 'HR', href: '#' },
        { title: 'Leave Requests', href: LeaveRequestController.index.url() },
        { title: 'Request Details', href: '#' },
    ],
};
