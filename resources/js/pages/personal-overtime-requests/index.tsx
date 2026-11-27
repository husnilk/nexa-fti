import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import {
    index as personalOvertimeIndex,
    create as personalOvertimeCreate,
    show as personalOvertimeShow,
} from '@/routes/personal-overtime-requests';
import type { Auth } from '@/types';
import type { OvertimeRequest, OvertimeStatus } from '@/types/overtime';

interface PageProps {
    auth: Auth;
    overtimeRequests: {
        data: OvertimeRequest[];
        links: any[];
    };
    [key: string]: any;
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

export default function PersonalOvertimeRequestIndex({
    overtimeRequests,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredRequests = overtimeRequests.data.filter((req) => {
        const matchesSearch =
            req.title.toLowerCase().includes(search.toLowerCase()) ||
            req.request_number.toLowerCase().includes(search.toLowerCase()) ||
            (req.description || '')
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('My Overtime Requests')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('My Overtime Requests')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Submit and monitor your overtime requests, members, and approval status.',
                        )}
                    </p>
                </div>
                <Link href={personalOvertimeCreate().url}>
                    <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                        <Plus className="h-4 w-4" /> {__('New Request')}
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 sm:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__(
                            'Search by title, description or ID...',
                        )}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full gap-3 sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Statuses')}</option>
                        <option value="pending">{__('Pending')}</option>
                        <option value="approved">{__('Approved')}</option>
                        <option value="rejected">{__('Rejected')}</option>
                        <option value="completed">{__('Completed')}</option>
                        <option value="cancelled">{__('Cancelled')}</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">{__('Request #')}</th>
                                <th className="px-6 py-4">{__('Title')}</th>
                                <th className="px-6 py-4">{__('Date')}</th>
                                <th className="w-[100px] px-6 py-4 text-center">
                                    {__('Members')}
                                </th>
                                <th className="w-[160px] px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="w-[100px] px-6 py-4 text-right">
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
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {req.request_number}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">
                                            {req.title}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {new Date(
                                                req.request_date,
                                            ).toLocaleDateString(intlLocale(), {
                                                dateStyle: 'medium',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                                            {req.members_count ??
                                                (req.members
                                                    ? req.members.length
                                                    : 0)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                variant="outline"
                                                className={`font-semibold capitalize ${statusColors[req.status]}`}
                                            >
                                                {statusLabels[req.status] ??
                                                    req.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={personalOvertimeShow.url({
                                                    personal_overtime_request:
                                                        req.id,
                                                })}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title={__('View Detail')}
                                                    className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
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
                                            'No overtime requests found matching the filters.',
                                        )}
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

PersonalOvertimeRequestIndex.layout = {
    breadcrumbs: [
        { title: __('Self-Service'), href: '#' },
        { title: __('My Overtime Requests'), href: personalOvertimeIndex() },
    ],
};
