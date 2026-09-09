import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, X, ClipboardList, Calendar, User } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { index as issueIndex } from '@/routes/inventory-issues';
import { index as requestIndex, create as requestCreate, show as requestShow } from '@/routes/inventory-requests';
import type { Auth, InventoryRequest } from '@/types';

interface PageProps {
    auth: Auth;
    requests: {
        data: InventoryRequest[];
        links: any[];
    };
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
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
            (req.employee?.name && req.employee.name.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const canCreate = auth.roles.includes('super-admin') || auth.permissions.includes('inventory.request');
    const mayManage = auth.roles.includes('super-admin') || auth.permissions.includes('inventory.manage');

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Inventory Requests" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <ClipboardList className="h-8 w-8 text-primary" /> Inventory Requests
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage employee requests for inventory items, components, and office supplies.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {mayManage && (
                        <Link href={issueIndex()}>
                            <Button variant="outline" className="cursor-pointer gap-2">
                                <ClipboardList className="h-4 w-4" /> Issues
                            </Button>
                        </Link>
                    )}
                    {canCreate && (
                        <Link href={requestCreate()}>
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
                        <option value="fulfilled">Fulfilled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6 w-[200px]">Request Number</th>
                                <th className="py-4 px-6">Requester</th>
                                <th className="py-4 px-6 w-[180px]">Request Date</th>
                                <th className="py-4 px-6 text-center w-[160px]">Status</th>
                                <th className="py-4 px-6 text-right w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                                {req.request_number}
                                            </code>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-zinc-400" />
                                                {req.employee?.name || 'Unknown requester'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                                {formatDate(req.request_date)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border
                                                ${req.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/35 dark:text-amber-400 dark:border-amber-900' : ''}
                                                ${req.status === 'approved' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/35 dark:text-indigo-400 dark:border-indigo-900' : ''}
                                                ${req.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/35 dark:text-rose-400 dark:border-rose-900' : ''}
                                                ${req.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/35 dark:text-emerald-400 dark:border-emerald-900' : ''}
                                            `}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={requestShow.url(req.id)}>
                                                    <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No inventory requests found matching the filters.
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
        { title: 'Inventory', href: '#' },
        { title: 'Requests', href: requestIndex() },
    ],
};
