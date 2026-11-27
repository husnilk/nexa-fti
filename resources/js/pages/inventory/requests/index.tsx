import { Head, Link, usePage } from '@inertiajs/react';
import {
    Eye,
    Plus,
    Search,
    X,
    ClipboardList,
    Calendar,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import { index as issueIndex } from '@/routes/inventory-issues';
import {
    index as requestIndex,
    create as requestCreate,
    show as requestShow,
} from '@/routes/inventory-requests';
import type { Auth, InventoryRequest } from '@/types';

interface PageProps {
    auth: Auth;
    requests: {
        data: InventoryRequest[];
        links: any[];
    };
}

const statusLabels: Record<string, string> = {
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    fulfilled: __('Fulfilled'),
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(intlLocale(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export default function RequestIndex({ requests }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredRequests = requests.data.filter((req) => {
        const matchesSearch =
            req.request_number.toLowerCase().includes(search.toLowerCase()) ||
            (req.employee?.name &&
                req.employee.name.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === 'all' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const canCreate =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('inventory.request');
    const mayManage =
        auth.roles.includes('super-admin') ||
        auth.permissions.includes('inventory.manage');

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Inventory Requests')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        <ClipboardList className="h-8 w-8 text-primary" />{' '}
                        {__('Inventory Requests')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Track and manage employee requests for inventory items, components, and office supplies.',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {mayManage && (
                        <Link href={issueIndex()}>
                            <Button
                                variant="outline"
                                className="cursor-pointer gap-2"
                            >
                                <ClipboardList className="h-4 w-4" />{' '}
                                {__('Issues')}
                            </Button>
                        </Link>
                    )}
                    {canCreate && (
                        <Link href={requestCreate()}>
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
                        <option value="fulfilled">{__('Fulfilled')}</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="w-[200px] px-6 py-4">
                                    {__('Request Number')}
                                </th>
                                <th className="px-6 py-4">{__('Requester')}</th>
                                <th className="w-[180px] px-6 py-4">
                                    {__('Request Date')}
                                </th>
                                <th className="w-[160px] px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="w-[120px] px-6 py-4 text-right">
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
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {req.request_number}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-zinc-400" />
                                                {req.employee?.name ||
                                                    __('Unknown requester')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                                {formatDate(req.request_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${req.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-400' : ''} ${req.status === 'approved' ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${req.status === 'rejected' ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-400' : ''} ${req.status === 'fulfilled' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} `}
                                            >
                                                {statusLabels[req.status] ??
                                                    req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={requestShow.url(
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
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No inventory requests found matching the filters.',
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

RequestIndex.layout = {
    breadcrumbs: [
        { title: __('Inventory'), href: '#' },
        { title: __('Requests'), href: requestIndex() },
    ],
};
