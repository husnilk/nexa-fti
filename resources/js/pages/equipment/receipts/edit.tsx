import { Head, router, useForm } from '@inertiajs/react';
import {
    index as receiptIndex,
    update,
} from '@/actions/App/Http/Controllers/EquipmentReceiptController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Auth, EquipmentProcurement, EquipmentReceipt } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentReceipt: EquipmentReceipt;
    procurement: EquipmentProcurement;
}

export default function EquipmentReceiptEdit({ equipmentReceipt, procurement }: PageProps) {
    const { data, setData, patch, processing, errors } = useForm({
        receipt_date: equipmentReceipt.receipt_date.split('T')[0],
        supplier_name: equipmentReceipt.supplier_name || '',
        invoice_number: equipmentReceipt.invoice_number || '',
        items: equipmentReceipt.equipment_receipt_items?.map(item => ({
            id: item.id,
            equipment_procurement_item_id: item.equipment_procurement_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price || '',
            status: item.status,
            rejection_reason: item.rejection_reason || ''
        })) || []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update.url(equipmentReceipt.id));
    };

    return (
        <>
            <Head title={`Edit Receipt - ${equipmentReceipt.receipt_number}`} />

            <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
                <Heading
                    title={`Edit Receipt: ${equipmentReceipt.receipt_number}`}
                    description="Update the receipt metadata."
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="receipt_date">Arrival Date</Label>
                                    <Input
                                        id="receipt_date"
                                        type="date"
                                        value={data.receipt_date}
                                        onChange={(e) => setData('receipt_date', e.target.value)}
                                        required
                                    />
                                    {errors.receipt_date && <div className="text-sm text-destructive">{errors.receipt_date}</div>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="supplier_name">Supplier Name</Label>
                                    <Input
                                        id="supplier_name"
                                        value={data.supplier_name}
                                        onChange={(e) => setData('supplier_name', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="invoice_number">Invoice / Delivery #</Label>
                                    <Input
                                        id="invoice_number"
                                        value={data.invoice_number}
                                        onChange={(e) => setData('invoice_number', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-muted-foreground">Received Items (View Only)</h3>
                        <p className="text-xs text-muted-foreground italic">Quantity and status cannot be modified here for batch integrity.</p>
                        <div className="border rounded-md">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="p-3 text-left">Item</th>
                                        <th className="p-3 text-center">Qty</th>
                                        <th className="p-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipmentReceipt.equipment_receipt_items?.map((item) => (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="p-3">
                                                {item.equipment_procurement_item?.equipment_model?.model_name || item.equipment_procurement_item?.name}
                                            </td>
                                            <td className="p-3 text-center">{item.quantity}</td>
                                            <td className="p-3 text-center capitalize">{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.get(receiptIndex.url())}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Update Receipt
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EquipmentReceiptEdit.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Receipts', href: receiptIndex.url() },
        { title: 'Edit', href: '#' },
    ],
};
