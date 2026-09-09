import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, ClipboardList, Package, User, Calendar, XCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { FormEvent } from 'react';
import InventoryRequestController from '@/actions/App/Http/Controllers/Inventory/InventoryRequestController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { index as requestIndex } from '@/routes/inventory-requests';
import type { Auth, InventoryRequest } from '@/types';

interface PageProps {
    auth: Auth;
    inventoryRequest: InventoryRequest;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function RequestShow({ inventoryRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ notes: '' });

    const handleApprove = (e: FormEvent) => {
        e.preventDefault();
        approveForm.post(InventoryRequestController.approve.url(inventoryRequest.id));
    };

    const handleReject = (e: FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert('Please provide a reason for rejection.');

            return;
        }

        rejectForm.post(InventoryRequestController.reject.url(inventoryRequest.id));
    };

    const canApprove =
        inventoryRequest.status === 'pending' &&
        (auth.roles.includes('super-admin') || auth.permissions.includes('inventory.approval'));

    const canIssue =
        inventoryRequest.status === 'approved' &&
        (auth.roles.includes('super-admin') || auth.permissions.includes('inventory.issue'));

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Request Detail: ${inventoryRequest.request_number}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={requestIndex()}>
                        <Button variant="outline" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Request: {inventoryRequest.request_number}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Submitted by {inventoryRequest.employee?.name || 'Unknown requester'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize border
                        ${inventoryRequest.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/35 dark:text-amber-400 dark:border-amber-900' : ''}
                        ${inventoryRequest.status === 'approved' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/35 dark:text-indigo-400 dark:border-indigo-900' : ''}
                        ${inventoryRequest.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/35 dark:text-rose-400 dark:border-rose-900' : ''}
                        ${inventoryRequest.status === 'fulfilled' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/35 dark:text-emerald-400 dark:border-emerald-900' : ''}
                    `}>
                        {inventoryRequest.status}
                    </span>
                    {canIssue && (
                        <Link href={`/inventory/issues/create?request_id=${inventoryRequest.id}`}>
                            <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                                <ClipboardList className="h-4 w-4" /> Issue Items
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Request details */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border dark:border-zinc-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                <ClipboardList className="size-5 text-primary" />
                                Request Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Request Number</span>
                                <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                    {inventoryRequest.request_number}
                                </code>
                            </div>
                            <Separator className="dark:bg-zinc-800" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Requested By</span>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                    <User className="h-4 w-4 text-zinc-400" />
                                    {inventoryRequest.employee?.name || 'Unknown requester'}
                                </span>
                            </div>
                            <Separator className="dark:bg-zinc-800" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Request Date</span>
                                <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-zinc-400" />
                                    {formatDate(inventoryRequest.request_date)}
                                </span>
                            </div>
                            {inventoryRequest.approved_at && (
                                <>
                                    <Separator className="dark:bg-zinc-800" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Action Date</span>
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {formatDate(inventoryRequest.approved_at)}
                                        </span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border dark:border-zinc-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                <Package className="size-5 text-primary" />
                                Items Requested
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            <th className="py-3 px-4">Item</th>
                                            <th className="py-3 px-4 w-[150px] text-right">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {inventoryRequest.inventory_request_items?.map((item) => (
                                            <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{item.item?.name}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">{item.item?.code}</div>
                                                </td>
                                                <td className="py-3 px-4 text-right font-semibold text-zinc-700 dark:text-zinc-300">
                                                    {item.quantity} {item.item?.unit || 'units'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Review/Approvals sidepanel */}
                <div className="space-y-6">
                    {canApprove && (
                        <Card className="border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/15 dark:bg-indigo-950/10 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-indigo-950 dark:text-indigo-50">
                                    Review Request
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-1.5">
                                    <label className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">Notes / Comments</label>
                                    <Textarea
                                        placeholder="Add notes for this action..."
                                        value={approveForm.data.notes || rejectForm.data.notes}
                                        onChange={(e) => {
                                            approveForm.setData('notes', e.target.value);
                                            rejectForm.setData('notes', e.target.value);
                                        }}
                                        className="bg-white dark:bg-zinc-900"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 cursor-pointer"
                                        onClick={handleReject}
                                        disabled={rejectForm.processing}
                                    >
                                        <XCircle className="mr-1.5 h-4 w-4" /> Reject
                                    </Button>
                                    <Button
                                        type="button"
                                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                                        onClick={handleApprove}
                                        disabled={approveForm.processing}
                                    >
                                        <CheckCircle className="mr-1.5 h-4 w-4" /> Approve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {inventoryRequest.inventory_request_approvals && inventoryRequest.inventory_request_approvals.length > 0 && (
                        <Card className="border dark:border-zinc-800 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Review Logs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {inventoryRequest.inventory_request_approvals.map((app) => (
                                    <div key={app.id} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 text-xs space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Approver ID: {app.approver_id}</span>
                                            <Badge variant={app.status === 'approved' ? 'default' : 'destructive'} className="py-0 px-1.5 text-[10px]">
                                                {app.status}
                                            </Badge>
                                        </div>
                                        {app.notes && (
                                            <p className="italic text-zinc-600 dark:text-zinc-400">"{app.notes}"</p>
                                        )}
                                        <div className="text-[10px] text-muted-foreground text-right">
                                            {formatDate(app.action_date)}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

RequestShow.layout = {
    breadcrumbs: [
        { title: 'Inventory', href: '#' },
        { title: 'Requests', href: requestIndex() },
        { title: 'Request Detail', href: '#' },
    ],
};
