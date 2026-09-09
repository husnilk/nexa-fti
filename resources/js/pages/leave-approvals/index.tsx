import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Search, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Auth, LeaveRequest, LeaveStatus } from '@/types';

interface PageProps {
    auth: Auth;
    leaveRequests: {
        data: LeaveRequest[];
        links: any[];
    };
}

const statusColors: Record<LeaveStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function LeaveApprovalIndex({ leaveRequests }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

    const isPendingMyApproval = (req: LeaveRequest) => {
        const nextPending = req.leave_approvals?.find((a) => a.status === 'pending');

        return nextPending && nextPending.approver_id === auth.user.id;
    };

    const filteredRequests = leaveRequests.data.filter((req) => {
        const matchesSearch =
            req.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.leave_type?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.reason?.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'pending') {
            return matchesSearch && isPendingMyApproval(req);
        }

        return matchesSearch;
    });

    return (
        <>
            <Head title="Leave Approvals" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Heading
                        title="Leave Approvals"
                        description="Review and process pending employee leave requests sequentially."
                    />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-muted">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                            activeTab === 'pending'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Pending My Approval ({leaveRequests.data.filter(isPendingMyApproval).length})
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                            activeTab === 'all'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        All Assigned Requests ({leaveRequests.data.length})
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search requests..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Employee
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Leave Type
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Period
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Days
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Your Stage
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Overall Status
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((req) => {
                                const userApproval = req.leave_approvals?.find(
                                    (a) => a.approver_id === auth.user.id
                                );
                                const isNext = isPendingMyApproval(req);

                                return (
                                    <tr
                                        key={req.id}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <td className="p-4 align-middle font-medium">
                                            {req.employee?.name}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {req.leave_type?.name}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {req.start_date} to {req.end_date}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {req.total_days}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {userApproval ? (
                                                <div className="flex items-center gap-1.5">
                                                    {userApproval.status === 'approved' && (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    )}
                                                    {userApproval.status === 'rejected' && (
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    )}
                                                    {userApproval.status === 'pending' && isNext && (
                                                        <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />
                                                    )}
                                                    {userApproval.status === 'pending' && !isNext && (
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <span className="text-xs font-medium">
                                                        Level {userApproval.level}:{' '}
                                                        {isNext ? 'Awaiting Action' : userApproval.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Not in chain</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge
                                                variant="outline"
                                                className={statusColors[req.status]}
                                            >
                                                {req.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/leave-approvals/${req.id}`}>
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    Detail
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No leave requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

LeaveApprovalIndex.layout = {
    breadcrumbs: [
        {
            title: 'Leave Approvals',
            href: '#',
        },
    ],
};
