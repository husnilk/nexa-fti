import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react';
import {
    show as procurementShow,
} from '@/actions/App/Http/Controllers/EquipmentProcurementController';
import {
    index as receiptIndex,
    edit,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentReceiptController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Auth, EquipmentReceipt } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentReceipt: EquipmentReceipt;
}

export default function EquipmentReceiptShow({ equipmentReceipt: r }: PageProps) {
    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this receipt?')) {
return;
}

        router.delete(destroy.url(r.id));
    };

    return (
        <>
            <Head title={`Receipt Details - ${r.receipt_number}`} />

            <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Equipment Receipt: ${r.receipt_number}`}
                        description="View details and items received in this batch."
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.get(edit.url(r.id))}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Received Items</CardTitle>
                            <CardDescription>Items arriving from procurement {r.equipment_procurement?.procurement_number}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="p-3 text-left">Item / Model</th>
                                            <th className="p-3 text-center">Qty</th>
                                            <th className="p-3 text-center">Status</th>
                                            <th className="p-3 text-right">Unit Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {r.equipment_receipt_items?.map((item) => (
                                            <tr key={item.id} className="border-b last:border-0">
                                                <td className="p-3">
                                                    <div className="font-medium">
                                                        {item.equipment_procurement_item?.equipment_model?.model_name || item.equipment_procurement_item?.name}
                                                    </div>
                                                    {item.status === 'rejected' && item.rejection_reason && (
                                                        <div className="text-xs mt-1 text-destructive font-medium italic">
                                                            Reason: {item.rejection_reason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center font-bold">{item.quantity}</td>
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center">
                                                        {item.status === 'accepted' ? (
                                                            <Badge className="bg-green-600 border-none capitalize"><CheckCircle2 className="mr-1 h-3 w-3" /> Accepted</Badge>
                                                        ) : (
                                                            <Badge variant="destructive" className="capitalize"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right">
                                                    {item.unit_price ? `$${parseFloat(item.unit_price).toLocaleString()}` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Receipt Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Arrival Date</span>
                                    <span className="font-medium">{new Date(r.receipt_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Supplier</span>
                                    <span className="font-medium">{r.supplier_name || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Invoice / Delivery #</span>
                                    <span className="font-medium">{r.invoice_number || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Received By</span>
                                    <span className="font-medium">{r.received_by_employee?.name || 'Unknown'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Linked Procurement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="font-bold">{r.equipment_procurement?.procurement_number}</div>
                                <div className="text-muted-foreground">{r.equipment_procurement?.title}</div>
                                <Button variant="link" className="p-0 h-auto" onClick={() => router.get(procurementShow.url(r.equipment_procurement_id))}>
                                    View Full Procurement
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

EquipmentReceiptShow.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Receipts', href: receiptIndex.url() },
        { title: 'Details', href: '#' },
    ],
};
