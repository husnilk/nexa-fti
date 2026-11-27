import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    FileText,
    History,
    MapPin,
    Phone,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { __, intlLocale } from '@/lib/i18n';
import { index as personalLeaveIndex } from '@/routes/personal-leave-requests';
import type { Auth, LeaveRequest, LeaveStatus } from '@/types';

interface PageProps {
    auth: Auth;
    leaveRequest: LeaveRequest;
}

const statusColors: Record<LeaveStatus, string> = {
    pending:
        'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/35 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900',
    approved:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    rejected:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    cancelled:
        'bg-zinc-100 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
};

const statusLabels: Record<string, string> = {
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    cancelled: __('Cancelled'),
};

export default function PersonalLeaveRequestShow({ leaveRequest }: PageProps) {
    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Leave Request Detail')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href={personalLeaveIndex()}>
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
                            {__('Leave Request Detail')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Submitted on :date', {
                                date: leaveRequest.submitted_at
                                    ? new Date(
                                          leaveRequest.submitted_at,
                                      ).toLocaleDateString(intlLocale(), {
                                          dateStyle: 'long',
                                      })
                                    : __('N/A'),
                            })}
                        </p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={`${statusColors[leaveRequest.status]} px-4 py-1.5 text-xs font-semibold capitalize`}
                >
                    {statusLabels[leaveRequest.status] ?? leaveRequest.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
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
                                        <Label>{__('Leave Type')}</Label>
                                    </div>
                                    <p className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-50">
                                        {leaveRequest.leave_type?.name}
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        <Clock className="h-3.5 w-3.5" />
                                        <Label>{__('Period')}</Label>
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                        {__(':start to :end', {
                                            start: new Date(
                                                leaveRequest.start_date,
                                            ).toLocaleDateString(intlLocale(), {
                                                dateStyle: 'medium',
                                            }),
                                            end: new Date(
                                                leaveRequest.end_date,
                                            ).toLocaleDateString(intlLocale(), {
                                                dateStyle: 'medium',
                                            }),
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
                                    <FileText className="h-3.5 w-3.5" />
                                    <Label>{__('Reason')}</Label>
                                </div>
                                <p className="mt-1 text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
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
                                                <MapPin className="h-3.5 w-3.5" />
                                                <Label>
                                                    {__('Leave Address')}
                                                </Label>
                                            </div>
                                            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                                                {leaveRequest.address_leave}
                                            </p>
                                        </div>
                                    )}
                                    {leaveRequest.contact_leave && (
                                        <div>
                                            <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                <Phone className="h-3.5 w-3.5" />
                                                <Label>
                                                    {__('Contact Number')}
                                                </Label>
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
                                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    {__('Approval Workflow')}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {leaveRequest.leave_approvals &&
                            leaveRequest.leave_approvals.length > 0 ? (
                                <div className="space-y-6">
                                    {leaveRequest.leave_approvals.map(
                                        (approval) => (
                                            <div
                                                key={approval.id}
                                                className="relative border-l-2 border-primary py-1 pl-4"
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
                                                        <p className="mt-0.5 font-semibold text-zinc-900 dark:text-zinc-50">
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
                                                        className={`h-5 text-[10px] font-semibold capitalize ${
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
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {new Date(
                                                            approval.action_date,
                                                        ).toLocaleString(
                                                            intlLocale(),
                                                            {
                                                                dateStyle:
                                                                    'medium',
                                                                timeStyle:
                                                                    'short',
                                                            },
                                                        )}
                                                    </p>
                                                )}
                                                {approval.notes && (
                                                    <p className="text-zinc-650 mt-2 rounded border bg-zinc-50 p-2 text-sm italic dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                                                        "{approval.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    {__('No approval workflow defined.')}
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
        { title: __('Self-Service'), href: '#' },
        { title: __('My Leave Requests'), href: personalLeaveIndex() },
        { title: __('Detail'), href: '#' },
    ],
};
