import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { index as personalLeaveIndex, create as personalLeaveCreate, show as personalLeaveShow } from '@/routes/personal-leave-requests';
import type { Auth, LeaveStatus } from '@/types';

type LeaveRequest = {
    id: string;
    leave_type?: { name: string };
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: LeaveStatus;
    submitted_at: string;
};

interface PageProps {
    auth: Auth;
    leaveRequests: {
        data: LeaveRequest[];
        links: any[];
    };
    [key: string]: any;
}

const statusColors: Record<LeaveStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/35 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900',
    approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    cancelled: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-850 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800',
};

export default function PersonalLeaveRequestIndex({ leaveRequests }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredRequests = leaveRequests.data.filter((req) => {
        const matchesSearch = 
            (req.leave_type?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (req.reason || '').toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="My Leave Requests" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        My Leave Requests
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Submit and monitor your personal leave requests and approval status.
                    </p>
                </div>
                <Link href={personalLeaveCreate().url}>
                    <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                        <Plus className="h-4 w-4" /> New Request
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by type or reason..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Leave Type</th>
                                <th className="py-4 px-6">Period</th>
                                <th className="py-4 px-6 w-[100px] text-center">Days</th>
                                <th className="py-4 px-6">Reason</th>
                                <th className="py-4 px-6 text-center w-[160px]">Status</th>
                                <th className="py-4 px-6 text-right w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {req.leave_type?.name || 'Leave Request'}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                            {new Date(req.start_date).toLocaleDateString(undefined, { dateStyle: 'medium' })} to {new Date(req.end_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </td>
                                        <td className="py-4 px-6 text-center font-medium text-zinc-700 dark:text-zinc-300">
                                            {req.total_days}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-455 line-clamp-1 max-w-xs mt-3">
                                            {req.reason}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Badge
                                                variant="outline"
                                                className={`capitalize font-semibold ${statusColors[req.status]}`}
                                            >
                                                {req.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link href={personalLeaveShow.url({ personal_leave_request: req.id })}>
                                                <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No leave requests found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

PersonalLeaveRequestIndex.layout = {
    breadcrumbs: [
        { title: 'Self-Service', href: '#' },
        { title: 'My Leave Requests', href: personalLeaveIndex() },
    ],
};
