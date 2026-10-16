import { Head, Link, usePage } from '@inertiajs/react';
import {
    Eye,
    Search,
    CheckCircle,
    Clock,
    XCircle,
    FileText,
} from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import { index as overtimeApprovalsIndex } from '@/routes/overtime-approvals';
import type { Auth } from '@/types';
import type { OvertimeRequest, OvertimeStatus } from '@/types/overtime';

interface PageProps {
    auth: Auth;
    overtimeRequests: {
        data: OvertimeRequest[];
        links: any[];
    };
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

export default function OvertimeApprovalIndex({ overtimeRequests }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<
        'pending' | 'history' | 'completed'
    >('pending');

    const pendingRequests = overtimeRequests.data.filter(
        (req) => req.status === 'pending',
    );
    const historyRequests = overtimeRequests.data.filter(
        (req) => req.status === 'approved' || req.status === 'rejected',
    );
    const completedRequests = overtimeRequests.data.filter(
        (req) => req.status === 'completed',
    );

    const getTabRequests = () => {
        switch (activeTab) {
            case 'pending':
                return pendingRequests;
            case 'history':
                return historyRequests;
            case 'completed':
                return completedRequests;
        }
    };

    const filteredRequests = getTabRequests().filter((req) => {
        return (
            req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.request_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (req.requester?.name || '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    });

    return (
        <>
            <Head title={__('Overtime Approvals')} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <Heading
                        title={__('Overtime Approvals')}
                        description={__(
                            'Review and process employee overtime requests and reports.',
                        )}
                    />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-muted">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'pending'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {__('Pending Approval (:count)', {
                            count: pendingRequests.length,
                        })}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'history'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {__('Approval History (:count)', {
                            count: historyRequests.length,
                        })}
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'completed'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {__('Completed (Reports) (:count)', {
                            count: completedRequests.length,
                        })}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={__('Search requests...')}
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Request #')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Title')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Requester')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Date')}
                                </th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                                    {__('Members')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Status')}
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((req) => (
                                <tr
                                    key={req.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {req.request_number}
                                    </td>
                                    <td className="p-4 align-middle font-medium">
                                        {req.title}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {req.requester?.name || __('Unknown')}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {new Date(
                                            req.request_date,
                                        ).toLocaleDateString(intlLocale(), {
                                            dateStyle: 'medium',
                                        })}
                                    </td>
                                    <td className="p-4 text-center align-middle font-medium">
                                        {req.members_count ??
                                            (req.members
                                                ? req.members.length
                                                : 0)}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge
                                            variant="outline"
                                            className={statusColors[req.status]}
                                        >
                                            {statusLabels[req.status] ??
                                                req.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/overtime-approvals/${req.id}`}
                                            >
                                                <Eye className="mr-1 h-4 w-4" />
                                                {__('Detail')}
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        {__('No overtime requests found.')}
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

OvertimeApprovalIndex.layout = {
    breadcrumbs: [
        {
            title: __('Overtime Approvals'),
            href: '#',
        },
    ],
};
