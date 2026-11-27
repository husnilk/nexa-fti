import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    FileText,
    History,
    User,
    Users,
    Edit,
    Trash2,
    ClipboardCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __, intlLocale } from '@/lib/i18n';
import {
    index as personalOvertimeIndex,
    edit as personalOvertimeEdit,
    destroy as personalOvertimeDestroy,
    report as personalOvertimeReport,
    myReport as personalOvertimeMyReport,
} from '@/routes/personal-overtime-requests';
import type { Auth } from '@/types';
import type { OvertimeRequest, OvertimeStatus } from '@/types/overtime';

interface PageProps {
    auth: Auth;
    overtimeRequest: OvertimeRequest;
    currentEmployeeId: string;
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

export default function PersonalOvertimeRequestShow({
    overtimeRequest,
    currentEmployeeId,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [cancellingRequest, setCancellingRequest] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const isSubmitter = currentEmployeeId === overtimeRequest.submitted_by;
    const canModify = isSubmitter && overtimeRequest.status === 'pending';
    const canReport = isSubmitter && overtimeRequest.status === 'approved';
    const isCompleted = overtimeRequest.status === 'completed';
    const isMember = overtimeRequest.members?.some(
        (m) => m.employee_id === currentEmployeeId,
    );
    const myMemberRecord = overtimeRequest.members?.find(
        (m) => m.employee_id === currentEmployeeId,
    );
    const canReportMyWork =
        isMember &&
        overtimeRequest.status === 'approved' &&
        !myMemberRecord?.actual_hours;

    const formatDateTimeLocal = (dateStr: string) => {
        if (!dateStr) {
            return '';
        }

        const d = new Date(dateStr);
        const tzOffset = d.getTimezoneOffset() * 60000;

        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    const reportForm = useForm({
        actual_start_time: formatDateTimeLocal(
            overtimeRequest.planned_start_time,
        ),
        actual_end_time: formatDateTimeLocal(overtimeRequest.planned_end_time),
        actual_hours:
            typeof myMemberRecord?.planned_hours === 'string'
                ? parseFloat(myMemberRecord.planned_hours)
                : myMemberRecord?.planned_hours || 0.5,
        activity: '',
        outcome: '',
    });

    const handleCancel = () => {
        router.delete(
            personalOvertimeDestroy.url({
                personal_overtime_request: overtimeRequest.id,
            }),
            {
                onSuccess: () => setCancellingRequest(false),
            },
        );
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
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Overtime Request - :number', {
                    number: overtimeRequest.request_number,
                })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href={personalOvertimeIndex()}>
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
                            {__('Overtime Request Details')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {overtimeRequest.request_number} &bull;{' '}
                            {__('Submitted on :date', {
                                date: overtimeRequest.submitted_at
                                    ? new Date(
                                          overtimeRequest.submitted_at,
                                      ).toLocaleDateString(intlLocale(), {
                                          dateStyle: 'long',
                                      })
                                    : __('N/A'),
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`${statusColors[overtimeRequest.status]} px-4 py-1.5 text-xs font-semibold capitalize`}
                    >
                        {statusLabels[overtimeRequest.status] ??
                            overtimeRequest.status}
                    </Badge>
                    {canModify && (
                        <>
                            <Link
                                href={personalOvertimeEdit.url({
                                    personal_overtime_request:
                                        overtimeRequest.id,
                                })}
                            >
                                <Button
                                    variant="outline"
                                    className="cursor-pointer gap-2"
                                >
                                    <Edit className="h-4 w-4" /> {__('Edit')}
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                onClick={() => setCancellingRequest(true)}
                                className="cursor-pointer gap-2"
                            >
                                <Trash2 className="h-4 w-4" />{' '}
                                {__('Cancel Request')}
                            </Button>
                        </>
                    )}
                    {canReportMyWork && (
                        <Button
                            onClick={() => setIsReportModalOpen(true)}
                            className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <ClipboardCheck className="h-4 w-4" />{' '}
                            {__('Report My Overtime Work')}
                        </Button>
                    )}
                    {isMember && myMemberRecord?.actual_hours && (
                        <Button
                            variant="outline"
                            onClick={() => setIsViewModalOpen(true)}
                            className="cursor-pointer gap-2"
                        >
                            <FileText className="h-4 w-4" />{' '}
                            {__('View My Report')}
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Information Card */}
                    <Card className="border dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                {__('Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        <User className="h-3.5 w-3.5" />
                                        <Label>{__('Title / Purpose')}</Label>
                                    </div>
                                    <p className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                                        {overtimeRequest.title}
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        <Clock className="h-3.5 w-3.5" />
                                        <Label>{__('Planned Schedule')}</Label>
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
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
                                        {__('Date: :date', {
                                            date: new Date(
                                                overtimeRequest.request_date,
                                            ).toLocaleDateString(intlLocale(), {
                                                dateStyle: 'medium',
                                            }),
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                    <FileText className="h-3.5 w-3.5" />
                                    <Label>{__('Description / Reason')}</Label>
                                </div>
                                <p className="mt-1 text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                    {overtimeRequest.description ||
                                        __('No description provided.')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        <User className="h-3.5 w-3.5" />
                                        <Label>{__('Submitted By')}</Label>
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                        {overtimeRequest.requester?.name ||
                                            __('Unknown')}
                                    </p>
                                </div>
                                {overtimeRequest.approved_by && (
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                            <User className="h-3.5 w-3.5" />
                                            <Label>{__('Approved By')}</Label>
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                            {overtimeRequest.approver?.name ||
                                                __('Unknown')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Members / Report Card */}
                    <Card className="border dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
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
                                                {__('Role & Job Description')}
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
                                        overtimeRequest.members.length > 0 ? (
                                            overtimeRequest.members.map(
                                                (member) => (
                                                    <tr
                                                        key={member.id}
                                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                                                            {member.employee
                                                                ?.name ||
                                                                __('Unknown')}
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
                                                            {__(':hours hrs', {
                                                                hours: member.planned_hours,
                                                            })}
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
                                                    {__('No members listed.')}
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
                    <Card className="border dark:border-zinc-800">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
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
                                                                __('Approver')}
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
                                <div className="py-6 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        {__('No approval actions taken yet.')}
                                    </p>
                                    {overtimeRequest.status === 'pending' && (
                                        <p className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                            {__('Status: Waiting for approval')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Cancel/Delete Request Dialog */}
            <Dialog
                open={cancellingRequest}
                onOpenChange={setCancellingRequest}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Cancel Overtime Request')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Are you sure you want to cancel and delete overtime request ":title"? This action cannot be undone.',
                                { title: overtimeRequest.title },
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancellingRequest(false)}
                            className="cursor-pointer"
                        >
                            {__('No, keep it')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            className="cursor-pointer"
                        >
                            {__('Yes, cancel request')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Report Overtime Dialog */}
            <Dialog
                open={isReportModalOpen}
                onOpenChange={setIsReportModalOpen}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {__('Report My Overtime Work')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Please input your actual hours worked, along with the activities performed and their outcomes.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            reportForm.post(
                                `/personal-overtime-requests/${overtimeRequest.id}/my-report`,
                                {
                                    onSuccess: () => {
                                        setIsReportModalOpen(false);
                                        reportForm.reset();
                                    },
                                },
                            );
                        }}
                        className="space-y-4 pt-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="actual_start_time">
                                    {__('Actual Start Time')}
                                </Label>
                                <Input
                                    id="actual_start_time"
                                    type="datetime-local"
                                    value={reportForm.data.actual_start_time}
                                    onChange={(e) =>
                                        reportForm.setData(
                                            'actual_start_time',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {reportForm.errors.actual_start_time && (
                                    <p className="text-xs text-destructive">
                                        {reportForm.errors.actual_start_time}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="actual_end_time">
                                    {__('Actual End Time')}
                                </Label>
                                <Input
                                    id="actual_end_time"
                                    type="datetime-local"
                                    value={reportForm.data.actual_end_time}
                                    onChange={(e) =>
                                        reportForm.setData(
                                            'actual_end_time',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {reportForm.errors.actual_end_time && (
                                    <p className="text-xs text-destructive">
                                        {reportForm.errors.actual_end_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="actual_hours">
                                {__('Actual Hours Worked')}
                            </Label>
                            <Input
                                id="actual_hours"
                                type="number"
                                step="0.5"
                                min="0.5"
                                value={reportForm.data.actual_hours}
                                onChange={(e) =>
                                    reportForm.setData(
                                        'actual_hours',
                                        parseFloat(e.target.value) || 0.5,
                                    )
                                }
                                required
                            />
                            {reportForm.errors.actual_hours && (
                                <p className="text-xs text-destructive">
                                    {reportForm.errors.actual_hours}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="activity">
                                {__('Activity performed')}
                            </Label>
                            <Textarea
                                id="activity"
                                placeholder={__(
                                    'Describe what tasks you performed during this overtime session...',
                                )}
                                value={reportForm.data.activity}
                                onChange={(e) =>
                                    reportForm.setData(
                                        'activity',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            {reportForm.errors.activity && (
                                <p className="text-xs text-destructive">
                                    {reportForm.errors.activity}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="outcome">{__('Outcome')}</Label>
                            <Textarea
                                id="outcome"
                                placeholder={__(
                                    'What was the result or outcome of the overtime work?',
                                )}
                                value={reportForm.data.outcome}
                                onChange={(e) =>
                                    reportForm.setData(
                                        'outcome',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            {reportForm.errors.outcome && (
                                <p className="text-xs text-destructive">
                                    {reportForm.errors.outcome}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsReportModalOpen(false)}
                                className="cursor-pointer"
                            >
                                {__('Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={reportForm.processing}
                                className="cursor-pointer"
                            >
                                {__('Submit Report')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View My Report Dialog */}
            {myMemberRecord && (
                <Dialog
                    open={isViewModalOpen}
                    onOpenChange={setIsViewModalOpen}
                >
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {__('My Overtime Report Details')}
                            </DialogTitle>
                            <DialogDescription>
                                {__(
                                    'Details of the overtime work you submitted.',
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4 text-sm">
                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                <div>
                                    <span className="block text-xs font-semibold text-muted-foreground uppercase">
                                        {__('Actual Period')}
                                    </span>
                                    <span className="mt-1 block font-medium">
                                        {__(':start to', {
                                            start: formatDateTime(
                                                myMemberRecord.actual_start_time ||
                                                    '',
                                            ),
                                        })}{' '}
                                        <br />
                                        {formatDateTime(
                                            myMemberRecord.actual_end_time ||
                                                '',
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-muted-foreground uppercase">
                                        {__('Actual Hours')}
                                    </span>
                                    <span className="mt-1 block text-lg font-bold text-blue-700 dark:text-blue-400">
                                        {__(':hours hrs', {
                                            hours: myMemberRecord.actual_hours,
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2 border-b pb-4">
                                <span className="block text-xs font-semibold text-muted-foreground uppercase">
                                    {__('Activity Performed')}
                                </span>
                                <p className="dark:text-zinc-355 whitespace-pre-wrap text-zinc-700">
                                    {myMemberRecord.activity || '-'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <span className="block text-xs font-semibold text-muted-foreground uppercase">
                                    {__('Outcome / Deliverable')}
                                </span>
                                <p className="dark:text-zinc-355 whitespace-pre-wrap text-zinc-700">
                                    {myMemberRecord.outcome || '-'}
                                </p>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="cursor-pointer"
                                >
                                    {__('Close')}
                                </Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

PersonalOvertimeRequestShow.layout = {
    breadcrumbs: [
        { title: __('Self-Service'), href: '#' },
        { title: __('My Overtime Requests'), href: personalOvertimeIndex() },
        { title: __('Detail'), href: '#' },
    ],
};
