import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    ChevronLeft,
    ClipboardCheck,
    FileText,
    History,
    Package,
    XCircle,
} from 'lucide-react';
import {
    index as procurementIndex,
    approve,
    reject,
} from '@/actions/App/Http/Controllers/Inventory/InventoryProcurementController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, InventoryProcurement, ProcurementStatus } from '@/types';

interface PageProps {
    auth: Auth;
    procurement: InventoryProcurement;
}

const statusColors: Record<ProcurementStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    submitted:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function ProcurementShow({ procurement }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ notes: '' });

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(approve.url(procurement.id));
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!rejectForm.data.notes) {
            alert('Please provide a reason for rejection.');

            return;
        }

        rejectForm.post(reject.url(procurement.id));
    };

    const canApprove =
        procurement.status === 'submitted' &&
        (auth.roles.includes('super-admin') ||
            auth.permissions.includes('inventory.approval'));

    const canReceive =
        procurement.status === 'approved' &&
        (auth.roles.includes('super-admin') ||
            auth.permissions.includes('inventory.receipt'));

    return (
        <>
            <Head title={`Procurement - ${procurement.request_number}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Back to Procurements"
                        >
                            <Link href={procurementIndex().url}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={`Procurement: ${procurement.request_number}`}
                            description={`Submitted by ${procurement.created_by?.name} on ${procurement.created_at}`}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge
                            variant="outline"
                            className={`${statusColors[procurement.status]} px-4 py-1`}
                        >
                            {procurement.status.toUpperCase()}
                        </Badge>
                        {canReceive && (
                            <Button asChild>
                                <Link href={`/inventory/receipts/create?procurement_id=${procurement.id}`}>
                                    <ClipboardCheck className="mr-2 h-4 w-4" />
                                    Receive Items
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div>
                                    <Label className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                        Title
                                    </Label>
                                    <p className="mt-1 text-lg font-medium">
                                        {procurement.title}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <div>
                                        <Label className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            Request Number
                                        </Label>
                                        <p className="mt-1 font-medium">
                                            {procurement.request_number}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                                            Approved At
                                        </Label>
                                        <p className="mt-1 font-medium">
                                            {procurement.approved_at || '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    <CardTitle>Items Requested</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-muted-foreground">
                                            <th className="h-10 text-left font-medium">Item</th>
                                            <th className="h-10 text-right font-medium">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {procurement.inventory_procurement_items?.map((item) => (
                                            <tr key={item.id} className="border-b last:border-0">
                                                <td className="py-4">
                                                    <div className="font-medium">{item.item?.name}</div>
                                                    <div className="text-xs text-muted-foreground">{item.item?.code}</div>
                                                </td>
                                                <td className="py-4 text-right">
                                                    {item.quantity} {item.item?.unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        {procurement.inventory_receipts && procurement.inventory_receipts.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <ClipboardCheck className="h-5 w-5 text-green-600" />
                                        <CardTitle>Receipt History</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-muted-foreground">
                                                <th className="h-10 text-left font-medium">Receipt #</th>
                                                <th className="h-10 text-left font-medium">Received By</th>
                                                <th className="h-10 text-right font-medium">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {procurement.inventory_receipts.map((receipt) => (
                                                <tr key={receipt.id} className="border-b last:border-0">
                                                    <td className="py-4 font-medium">{receipt.receipt_number}</td>
                                                    <td className="py-4">{receipt.received_by?.name}</td>
                                                    <td className="py-4 text-right">{receipt.receipt_date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {canApprove && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle>Review Procurement</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <Textarea
                                        placeholder="Add notes for this action..."
                                        value={approveForm.data.notes || rejectForm.data.notes}
                                        onChange={(e) => {
                                            approveForm.setData('notes', e.target.value);
                                            rejectForm.setData('notes', e.target.value);
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={handleReject}
                                            disabled={rejectForm.processing}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                        <Button
                                            onClick={handleApprove}
                                            disabled={approveForm.processing}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ProcurementShow.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Procurements',
            href: procurementIndex(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
