import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, FileText, History, MapPin, Phone, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { index as personalLeaveIndex } from '@/routes/personal-leave-requests';
import type { Auth, LeaveRequest, LeaveStatus } from '@/types';

interface PageProps {
    auth: Auth;
    leaveRequest: LeaveRequest;
}

const statusColors: Record<LeaveStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/35 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    cancelled: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
};

export default function PersonalLeaveRequestShow({ leaveRequest }: PageProps) {
    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Leave Request Detail`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={personalLeaveIndex()}>
                        <Button variant="outline" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Leave Request Detail
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Submitted on {leaveRequest.submitted_at ? new Date(leaveRequest.submitted_at).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                        </p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={`${statusColors[leaveRequest.status]} px-4 py-1.5 text-xs font-semibold capitalize`}
                >
                    {leaveRequest.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card className="border dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                        <User className="h-3.5 w-3.5" />
                                        <Label>Leave Type</Label>
                                    </div>
                                    <p className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                                        {leaveRequest.leave_type?.name}
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                        <Clock className="h-3.5 w-3.5" />
                                        <Label>Period</Label>
                                    </div>
                                    <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50 text-sm">
                                        {new Date(leaveRequest.start_date).toLocaleDateString(undefined, { dateStyle: 'medium' })} to{' '}
                                        {new Date(leaveRequest.end_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                                        Total: {leaveRequest.total_days} days
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                    <FileText className="h-3.5 w-3.5" />
                                    <Label>Reason</Label>
                                </div>
                                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                    {leaveRequest.reason || 'No reason provided.'}
                                </p>
                            </div>

                            {(leaveRequest.address_leave || leaveRequest.contact_leave) && (
                                <div className="grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
                                    {leaveRequest.address_leave && (
                                        <div>
                                            <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                                <MapPin className="h-3.5 w-3.5" />
                                                <Label>Leave Address</Label>
                                            </div>
                                            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                                                {leaveRequest.address_leave}
                                            </p>
                                        </div>
                                    )}
                                    {leaveRequest.contact_leave && (
                                        <div>
                                            <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                                <Phone className="h-3.5 w-3.5" />
                                                <Label>Contact Number</Label>
                                            </div>
                                            <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
                    <Card className="border dark:border-zinc-800">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Approval Workflow</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {leaveRequest.leave_approvals && leaveRequest.leave_approvals.length > 0 ? (
                                <div className="space-y-6">
                                    {leaveRequest.leave_approvals.map((approval) => (
                                        <div
                                            key={approval.id}
                                            className="relative border-l-2 border-primary py-1 pl-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        Level {approval.level}
                                                    </p>
                                                    <p className="font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">
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
                                                    className={`h-5 text-[10px] capitalize font-semibold ${
                                                        approval.status === 'pending'
                                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                            : ''
                                                    }`}
                                                >
                                                    {approval.status}
                                                </Badge>
                                            </div>
                                            {approval.action_date && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(approval.action_date).toLocaleDateString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            )}
                                            {approval.notes && (
                                                <p className="mt-2 text-sm text-zinc-650 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/50 border dark:border-zinc-800 p-2 rounded">
                                                    "{approval.notes}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No approval workflow defined.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

PersonalLeaveRequestShow.layout = {
    breadcrumbs: [
        { title: 'Self-Service', href: '#' },
        { title: 'My Leave Requests', href: personalLeaveIndex() },
        { title: 'Detail', href: '#' },
    ],
};
