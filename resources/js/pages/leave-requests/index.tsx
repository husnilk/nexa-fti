import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, Trash2, X, Calendar, User, Clock, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import LeaveRequestController from '@/actions/App/Http/Controllers/Hr/LeaveRequestController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { index as leaveTypesIndex } from '@/routes/leave-types';
import type { Auth, LeaveRequest, LeaveStatus } from '@/types';

interface PageProps {
    auth: Auth;
    leaveRequests: {
        data: LeaveRequest[];
        links: any[];
    };
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

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function LeaveRequestIndex({ leaveRequests }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deletingRequest, setDeletingRequest] = useState<LeaveRequest | null>(
        null,
    );

    const mayCreate = can(auth, 'leave.manage');
    const mayDelete = can(auth, 'leave.manage');
    const canViewLeaveTypes = can(auth, 'leave.view');

    const handleDelete = () => {
        if (!deletingRequest) {
            return;
        }

        router.delete(LeaveRequestController.destroy.url(deletingRequest.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingRequest(null),
        });
    };

    const filteredRequests = leaveRequests.data.filter((req) => {
        const matchesSearch = 
            req.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.leave_type?.name.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Leave Requests" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Leave Requests
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage employee leave requests and approvals workflow.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {canViewLeaveTypes && (
                        <Link href={leaveTypesIndex()}>
                            <Button variant="outline" className="cursor-pointer gap-2">
                                <ClipboardList className="h-4 w-4" /> Leave Types
                            </Button>
                        </Link>
                    )}
                    {mayCreate && (
                        <Link href={LeaveRequestController.create.url()}>
                            <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                                <Plus className="h-4 w-4" /> New Request
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search requests..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
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
                                <th className="py-4 px-6">Employee</th>
                                <th className="py-4 px-6">Leave Type</th>
                                <th className="py-4 px-6">Period</th>
                                <th className="py-4 px-6 w-[100px] text-center">Days</th>
                                <th className="py-4 px-6 text-center w-[160px]">Status</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-nowrap">
                                                    {req.employee?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant="outline" className="font-medium text-nowrap">
                                                {req.leave_type?.name}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1 text-zinc-600 dark:text-zinc-400">
                                                <div className="flex items-center gap-1.5 text-nowrap">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{req.start_date}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground text-nowrap">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>to {req.end_date}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center font-medium">
                                            {req.total_days}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Badge
                                                variant="outline"
                                                className={`capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[req.status]}`}
                                            >
                                                {req.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={LeaveRequestController.show.url(req.id)}>
                                                    <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Delete"
                                                        onClick={() => setDeletingRequest(req)}
                                                        className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
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

            <Dialog open={!!deletingRequest} onOpenChange={(open) => !open && setDeletingRequest(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Leave Request</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete this leave request for "{deletingRequest?.employee?.name}"? This action cannot be undone.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setDeletingRequest(null)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete} className="cursor-pointer">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

LeaveRequestIndex.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Leave Requests', href: LeaveRequestController.index.url() },
    ],
};
