import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, ChevronLeft, XCircle, Clock, FileText, Users } from 'lucide-react';
import { index as overtimeIndex } from '@/actions/App/Http/Controllers/Hr/OvertimeRequestController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, OvertimeRequest, OvertimeStatus } from '@/types';

interface PageProps {
    auth: Auth;
    overtimeRequest: OvertimeRequest;
}

const statusColors: Record<OvertimeStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function OvertimeRequestShow({ overtimeRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const approveForm = useForm({ approver_id: '', notes: '' });
    const rejectForm = useForm({ approver_id: '', notes: '' });

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(`/overtime-requests/${overtimeRequest.id}/approve`);
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert('Please provide a reason for rejection.');

            return;
        }

        rejectForm.post(`/overtime-requests/${overtimeRequest.id}/reject`);
    };

    const canApprove =
        overtimeRequest.status === 'pending' &&
        (auth.roles.includes('super-admin') ||
            auth.permissions.includes('overtime.manage'));

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) {
return 'N/A';
}

        return new Date(dateStr).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <>
            <Head
                title={`Overtime Request - ${overtimeRequest.request_number}`}
            />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Back to Overtime Requests"
                        >
                            <Link href={overtimeIndex().url}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={`Overtime Request: ${overtimeRequest.request_number}`}
                            description={`Submitted by ${overtimeRequest.requester?.name} on ${overtimeRequest.submitted_at}`}
                        />
                    </div>
                    <Badge
                        variant="outline"
                        className={`${statusColors[overtimeRequest.status]} px-4 py-1`}
                    >
                        {overtimeRequest.status.toUpperCase()}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                                    <div>
                                        <Label className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            Title
                                        </Label>
                                        <p className="mt-1 text-lg font-medium">
                                            {overtimeRequest.title}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            <Clock className="h-3 w-3" />
                                            <Label>Planned Period</Label>
                                        </div>
                                        <p className="mt-1 font-medium text-sm">
                                            {overtimeRequest.planned_start_time}{' '}
                                            to{' '}
                                            {overtimeRequest.planned_end_time}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Request Date:{' '}
                                            {overtimeRequest.request_date}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                        <FileText className="h-3 w-3" />
                                        <Label>Description</Label>
                                    </div>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">
                                        {overtimeRequest.description ||
                                            'No description provided.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <CardTitle>Team Members</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                 <table className="w-full text-sm border-collapse text-left">
                                     <thead>
                                         <tr className="border-b text-muted-foreground font-medium">
                                             <th className="py-2 px-4">Employee</th>
                                             <th className="py-2 px-4">Role & Job Description</th>
                                             <th className="py-2 px-4 text-center">Planned Hours</th>
                                             <th className="py-2 px-4">Actual Period & Hours</th>
                                             <th className="py-2 px-4">Activity & Outcome</th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {overtimeRequest.members?.map(
                                             (member) => (
                                                 <tr
                                                     key={member.id}
                                                     className="border-b last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                                 >
                                                     <td className="py-3 px-4 font-medium">
                                                         {member.employee?.name}
                                                     </td>
                                                     <td className="py-3 px-4">
                                                         <div className="font-semibold text-zinc-900 dark:text-zinc-100">{member.role || '-'}</div>
                                                         <div className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">{member.job_desc || '-'}</div>
                                                     </td>
                                                     <td className="py-3 px-4 text-center">
                                                         {member.planned_hours} hrs
                                                     </td>
                                                     <td className="py-3 px-4 text-xs">
                                                         {member.actual_hours ? (
                                                             <div>
                                                                 <span className="font-semibold text-blue-700 dark:text-blue-400">{member.actual_hours} hrs</span>
                                                                 <div className="text-[10px] text-muted-foreground mt-1">
                                                                     {formatDateTime(member.actual_start_time || '')} to <br />
                                                                     {formatDateTime(member.actual_end_time || '')}
                                                                 </div>
                                                             </div>
                                                         ) : (
                                                             <span className="text-muted-foreground italic text-xs">Not reported yet</span>
                                                         )}
                                                     </td>
                                                     <td className="py-3 px-4 text-xs max-w-xs">
                                                         {member.actual_hours ? (
                                                             <div className="space-y-1">
                                                                 <div>
                                                                     <span className="font-semibold text-zinc-850 dark:text-zinc-200">Activity:</span>{' '}
                                                                     <span className="text-zinc-650 dark:text-zinc-350">{member.activity || '-'}</span>
                                                                 </div>
                                                                 <div>
                                                                     <span className="font-semibold text-zinc-855 dark:text-zinc-200">Outcome:</span>{' '}
                                                                     <span className="text-zinc-655 dark:text-zinc-350">{member.outcome || '-'}</span>
                                                                 </div>
                                                             </div>
                                                         ) : (
                                                             <span className="text-muted-foreground">-</span>
                                                         )}
                                                     </td>
                                                 </tr>
                                             ),
                                         )}
                                     </tbody>
                                 </table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Approval Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {overtimeRequest.approval_logs &&
                                overtimeRequest.approval_logs.length > 0 ? (
                                    <div className="space-y-4">
                                        {overtimeRequest.approval_logs.map(
                                            (log) => (
                                                <div
                                                    key={log.id}
                                                    className="border-l-2 border-primary py-1 pl-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold">
                                                            {log.approver?.name}
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                log.status ===
                                                                'approved'
                                                                    ? 'default'
                                                                    : 'destructive'
                                                            }
                                                            className="h-4 text-[10px]"
                                                        >
                                                            {log.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        {log.action_date}
                                                    </p>
                                                    {log.notes && (
                                                        <p className="mt-2 text-sm text-muted-foreground italic">
                                                            "{log.notes}"
                                                        </p>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        No approval activity yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {canApprove && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle>Process Approval</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <Textarea
                                        placeholder="Add notes for this action..."
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
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={handleReject}
                                            disabled={rejectForm.processing}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />{' '}
                                            Reject
                                        </Button>
                                        <Button
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

OvertimeRequestShow.layout = {
    breadcrumbs: [
        {
            title: 'Overtime Requests',
            href: overtimeIndex(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
