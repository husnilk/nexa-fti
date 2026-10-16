import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    Plus,
    Search,
    Trash2,
    X,
    Calendar,
    User,
    Clock,
    ClipboardList,
} from 'lucide-react';
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
import { __ } from '@/lib/i18n';
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

const statusLabels: Record<LeaveStatus, string> = {
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    cancelled: __('Cancelled'),
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
            req.employee?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            req.leave_type?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Leave Requests')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Leave Requests')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage employee leave requests and approvals workflow.',
                        )}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {canViewLeaveTypes && (
                        <Link href={leaveTypesIndex()}>
                            <Button
                                variant="outline"
                                className="cursor-pointer gap-2"
                            >
                                <ClipboardList className="h-4 w-4" />{' '}
                                {__('Leave Types')}
                            </Button>
                        </Link>
                    )}
                    {mayCreate && (
                        <Link href={LeaveRequestController.create.url()}>
                            <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                                <Plus className="h-4 w-4" /> {__('New Request')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search requests...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Statuses')}</option>
                        <option value="pending">{__('Pending')}</option>
                        <option value="approved">{__('Approved')}</option>
                        <option value="rejected">{__('Rejected')}</option>
                        <option value="cancelled">{__('Cancelled')}</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Employee')}</th>
                                <th className="px-6 py-4">
                                    {__('Leave Type')}
                                </th>
                                <th className="px-6 py-4">{__('Period')}</th>
                                <th className="w-[100px] px-6 py-4 text-center">
                                    {__('Days')}
                                </th>
                                <th className="w-[160px] px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="w-[150px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr
                                        key={req.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <span className="font-semibold text-nowrap text-zinc-900 dark:text-zinc-50">
                                                    {req.employee?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="outline"
                                                className="font-medium text-nowrap"
                                            >
                                                {req.leave_type?.name}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-zinc-600 dark:text-zinc-400">
                                                <div className="flex items-center gap-1.5 text-nowrap">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>
                                                        {req.start_date}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-nowrap text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>
                                                        {__('to :date', {
                                                            date: req.end_date,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">
                                            {req.total_days}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                variant="outline"
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[req.status]}`}
                                            >
                                                {statusLabels[req.status] ??
                                                    req.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={LeaveRequestController.show.url(
                                                        req.id,
                                                    )}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__(
                                                            'View Detail',
                                                        )}
                                                        className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Delete')}
                                                        onClick={() =>
                                                            setDeletingRequest(
                                                                req,
                                                            )
                                                        }
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
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
                                    <td
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No leave requests found matching the filters.',
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={!!deletingRequest}
                onOpenChange={(open) => !open && setDeletingRequest(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Leave Request')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__(
                            'Are you sure you want to delete this leave request for ":name"? This action cannot be undone.',
                            { name: deletingRequest?.employee?.name },
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingRequest(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            className="cursor-pointer"
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

LeaveRequestIndex.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        {
            title: __('Leave Requests'),
            href: LeaveRequestController.index.url(),
        },
    ],
};
