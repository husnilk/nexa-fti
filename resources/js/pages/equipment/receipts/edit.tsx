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
import { __ } from '@/lib/i18n';
import type { Auth, EquipmentProcurement, EquipmentReceipt } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentReceipt: EquipmentReceipt;
    procurement: EquipmentProcurement;
}

const statusLabels: Record<string, string> = {
    accepted: __('Accepted'),
    rejected: __('Rejected'),
};

export default function EquipmentReceiptEdit({
    equipmentReceipt,
    procurement,
}: PageProps) {
    const { data, setData, patch, processing, errors } = useForm({
        receipt_date: equipmentReceipt.receipt_date.split('T')[0],
        supplier_name: equipmentReceipt.supplier_name || '',
        invoice_number: equipmentReceipt.invoice_number || '',
        items:
            equipmentReceipt.equipment_receipt_items?.map((item) => ({
                id: item.id,
                equipment_procurement_item_id:
                    item.equipment_procurement_item_id,
                quantity: item.quantity,
                unit_price: item.unit_price || '',
                status: item.status,
                rejection_reason: item.rejection_reason || '',
            })) || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(update.url(equipmentReceipt.id));
    };

    return (
        <>
            <Head
                title={__('Edit Receipt - :number', {
                    number: equipmentReceipt.receipt_number,
                })}
            />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <Heading
                    title={__('Edit Receipt: :number', {
                        number: equipmentReceipt.receipt_number,
                    })}
                    description={__('Update the receipt metadata.')}
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{__('General Information')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="receipt_date">
                                        {__('Arrival Date')}
                                    </Label>
                                    <Input
                                        id="receipt_date"
                                        type="date"
                                        value={data.receipt_date}
                                        onChange={(e) =>
                                            setData(
                                                'receipt_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.receipt_date && (
                                        <div className="text-sm text-destructive">
                                            {errors.receipt_date}
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="supplier_name">
                                        {__('Supplier Name')}
                                    </Label>
                                    <Input
                                        id="supplier_name"
                                        value={data.supplier_name}
                                        onChange={(e) =>
                                            setData(
                                                'supplier_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="invoice_number">
                                        {__('Invoice / Delivery #')}
                                    </Label>
                                    <Input
                                        id="invoice_number"
                                        value={data.invoice_number}
                                        onChange={(e) =>
                                            setData(
                                                'invoice_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-muted-foreground">
                            {__('Received Items (View Only)')}
                        </h3>
                        <p className="text-xs text-muted-foreground italic">
                            {__(
                                'Quantity and status cannot be modified here for batch integrity.',
                            )}
                        </p>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left">
                                            {__('Item')}
                                        </th>
                                        <th className="p-3 text-center">
                                            {__('Qty')}
                                        </th>
                                        <th className="p-3 text-center">
                                            {__('Status')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipmentReceipt.equipment_receipt_items?.map(
                                        (item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="p-3">
                                                    {item
                                                        .equipment_procurement_item
                                                        ?.equipment_model
                                                        ?.model_name ||
                                                        item
                                                            .equipment_procurement_item
                                                            ?.name}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {item.quantity}
                                                </td>
                                                <td className="p-3 text-center capitalize">
                                                    {statusLabels[
                                                        item.status
                                                    ] ?? item.status}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(receiptIndex.url())}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {__('Update Receipt')}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EquipmentReceiptEdit.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Receipts'), href: receiptIndex.url() },
        { title: __('Edit'), href: '#' },
    ],
};
