import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    ClipboardList,
    Package,
    User,
    Calendar,
    XCircle,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';
import type { FormEvent } from 'react';
import InventoryRequestController from '@/actions/App/Http/Controllers/Inventory/InventoryRequestController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { __, intlLocale } from '@/lib/i18n';
import { index as requestIndex } from '@/routes/inventory-requests';
import type { Auth, InventoryRequest } from '@/types';

interface PageProps {
    auth: Auth;
    inventoryRequest: InventoryRequest;
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
        approveForm.post(
            InventoryRequestController.approve.url(inventoryRequest.id),
        );
    };

    const handleReject = (e: FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert(__('Please provide a reason for rejection.'));

            return;
        }

        rejectForm.post(
            InventoryRequestController.reject.url(inventoryRequest.id),
        );
    };

    const canApprove =
        inventoryRequest.status === 'pending' &&
        (auth.roles.includes('super-admin') ||
            auth.permissions.includes('inventory.approval'));

    const canIssue =
        inventoryRequest.status === 'approved' &&
        (auth.roles.includes('super-admin') ||
            auth.permissions.includes('inventory.issue'));

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Request Detail: :number', {
                    number: inventoryRequest.request_number,
                })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href={requestIndex()}>
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
                            {__('Request: :number', {
                                number: inventoryRequest.request_number,
                            })}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Submitted by :name', {
                                name:
                                    inventoryRequest.employee?.name ||
                                    __('Unknown requester'),
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${inventoryRequest.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-400' : ''} ${inventoryRequest.status === 'approved' ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${inventoryRequest.status === 'rejected' ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-400' : ''} ${inventoryRequest.status === 'fulfilled' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} `}
                    >
                        {statusLabels[inventoryRequest.status] ??
                            inventoryRequest.status}
                    </span>
                    {canIssue && (
                        <Link
                            href={`/inventory/issues/create?request_id=${inventoryRequest.id}`}
                        >
                            <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                                <ClipboardList className="h-4 w-4" />{' '}
                                {__('Issue Items')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Request details */}
                <div className="space-y-6 md:col-span-2">
                    <Card className="border shadow-sm dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                <ClipboardList className="size-5 text-primary" />
                                {__('Request Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Request Number')}
                                </span>
                                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                    {inventoryRequest.request_number}
                                </code>
                            </div>
                            <Separator className="dark:bg-zinc-800" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Requested By')}
                                </span>
                                <span className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                                    <User className="h-4 w-4 text-zinc-400" />
                                    {inventoryRequest.employee?.name ||
                                        __('Unknown requester')}
                                </span>
                            </div>
                            <Separator className="dark:bg-zinc-800" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Request Date')}
                                </span>
                                <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                                    <Calendar className="h-4 w-4 text-zinc-400" />
                                    {formatDate(inventoryRequest.request_date)}
                                </span>
                            </div>
                            {inventoryRequest.approved_at && (
                                <>
                                    <Separator className="dark:bg-zinc-800" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {__('Action Date')}
                                        </span>
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            {formatDate(
                                                inventoryRequest.approved_at,
                                            )}
                                        </span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                                <Package className="size-5 text-primary" />
                                {__('Items Requested')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="border-b text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            <th className="px-4 py-3">
                                                {__('Item')}
                                            </th>
                                            <th className="w-[150px] px-4 py-3 text-right">
                                                {__('Quantity')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {inventoryRequest.inventory_request_items?.map(
                                            (item) => (
                                                <tr
                                                    key={item.id}
                                                    className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                                            {item.item?.name}
                                                        </div>
                                                        <div className="font-mono text-xs text-muted-foreground">
                                                            {item.item?.code}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">
                                                        {item.quantity}{' '}
                                                        {item.item?.unit ||
                                                            __('units')}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Review/Approvals sidepanel */}
                <div className="space-y-6">
                    {canApprove && (
                        <Card className="border border-indigo-200 bg-indigo-50/15 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/10">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-indigo-950 dark:text-indigo-50">
                                    {__('Review Request')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-1.5">
                                    <label className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                                        {__('Notes / Comments')}
                                    </label>
                                    <Textarea
                                        placeholder={__(
                                            'Add notes for this action...',
                                        )}
                                        value={
                                            approveForm.data.notes ||
                                            rejectForm.data.notes
                                        }
                                        onChange={(e) => {
                                            approveForm.setData(
                                                'notes',
                                                e.target.value,
                                            );
                                            rejectForm.setData(
                                                'notes',
                                                e.target.value,
                                            );
                                        }}
                                        className="bg-white dark:bg-zinc-900"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20"
                                        onClick={handleReject}
                                        disabled={rejectForm.processing}
                                    >
                                        <XCircle className="mr-1.5 h-4 w-4" />{' '}
                                        {__('Reject')}
                                    </Button>
                                    <Button
                                        type="button"
                                        className="cursor-pointer bg-primary font-medium text-primary-foreground hover:bg-primary/90"
                                        onClick={handleApprove}
                                        disabled={approveForm.processing}
                                    >
                                        <CheckCircle className="mr-1.5 h-4 w-4" />{' '}
                                        {__('Approve')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {inventoryRequest.inventory_request_approvals &&
                        inventoryRequest.inventory_request_approvals.length >
                            0 && (
                            <Card className="border shadow-sm dark:border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        {__('Review Logs')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {inventoryRequest.inventory_request_approvals.map(
                                        (app) => (
                                            <div
                                                key={app.id}
                                                className="space-y-2 rounded-lg border bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {__(
                                                            'Approver ID: :id',
                                                            {
                                                                id: app.approver_id,
                                                            },
                                                        )}
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            app.status ===
                                                            'approved'
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                        className="px-1.5 py-0 text-[10px]"
                                                    >
                                                        {statusLabels[
                                                            app.status
                                                        ] ?? app.status}
                                                    </Badge>
                                                </div>
                                                {app.notes && (
                                                    <p className="text-zinc-600 italic dark:text-zinc-400">
                                                        "{app.notes}"
                                                    </p>
                                                )}
                                                <div className="text-right text-[10px] text-muted-foreground">
                                                    {formatDate(
                                                        app.action_date,
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
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
        { title: __('Inventory'), href: '#' },
        { title: __('Requests'), href: requestIndex() },
        { title: __('Request Detail'), href: '#' },
    ],
};
