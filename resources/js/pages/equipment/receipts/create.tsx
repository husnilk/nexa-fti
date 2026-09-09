import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2, Plus, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    index as receiptIndex,
    create,
    store,
} from '@/actions/App/Http/Controllers/EquipmentReceiptController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, EquipmentProcurement, EquipmentProcurementItem } from '@/types';

interface PageProps {
    auth: Auth;
    procurement?: EquipmentProcurement;
    procurements: EquipmentProcurement[];
}

export default function EquipmentReceiptCreate({ procurement, procurements = [] }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        equipment_procurement_id: procurement?.id || '',
        receipt_date: new Date().toISOString().split('T')[0],
        supplier_name: '',
        invoice_number: '',
        items: [] as any[]
    });

    useEffect(() => {
        if (procurement?.equipment_procurement_items) {
            const initialItems = procurement.equipment_procurement_items.map(item => ({
                equipment_procurement_item_id: item.id,
                name: item.equipment_model?.model_name || item.name,
                quantity: item.quantity,
                unit_price: item.estimated_unit_price || '',
                status: 'accepted',
                rejection_reason: ''
            }));
            setData('items', initialItems);
        }
    }, [procurement]);

    const handleProcurementChange = (id: string) => {
        router.get(create.url({ equipment_procurement_id: id }), {}, { preserveState: true });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <>
            <Head title="New Equipment Receipt" />

            <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
                <Heading
                    title="Record Equipment Receipt"
                    description="Record the arrival of items from a procurement request."
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Receipt Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="procurement">Approved Procurement</Label>
                                <Select
                                    onValueChange={handleProcurementChange}
                                    value={data.equipment_procurement_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an approved procurement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {procurements.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.procurement_number} - {p.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.equipment_procurement_id && <div className="text-sm text-destructive">{errors.equipment_procurement_id}</div>}
                            </div>

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
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="invoice_number">Invoice / Delivery #</Label>
                                    <Input
                                        id="invoice_number"
                                        value={data.invoice_number}
                                        onChange={(e) => setData('invoice_number', e.target.value)}
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {data.items.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Received Items</h3>
                            <div className="grid gap-4">
                                {data.items.map((item, index) => (
                                    <Card key={index} className={item.status === 'rejected' ? 'border-destructive/50 bg-destructive/5' : ''}>
                                        <CardContent className="p-4 grid gap-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-bold">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">From Procurement Item</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="button" 
                                                        variant={item.status === 'accepted' ? 'default' : 'outline'} 
                                                        size="sm"
                                                        onClick={() => updateItem(index, 'status', 'accepted')}
                                                        className={item.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                    >
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Accept
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        variant={item.status === 'rejected' ? 'destructive' : 'outline'} 
                                                        size="sm"
                                                        onClick={() => updateItem(index, 'status', 'rejected')}
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Quantity Received</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                                            required
                                                        />
                                                        {errors[`items.${index}.quantity` as keyof typeof errors] && (
                                                            <div className="text-sm text-destructive">{errors[`items.${index}.quantity` as keyof typeof errors]}</div>
                                                        )}
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Actual Unit Price</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                {item.status === 'rejected' && (
                                                    <div className="grid gap-2">
                                                        <Label className="text-destructive font-bold">Rejection Reason</Label>
                                                        <Input
                                                            value={item.rejection_reason}
                                                            onChange={(e) => updateItem(index, 'rejection_reason', e.target.value)}
                                                            placeholder="Why is this item being rejected?"
                                                            required
                                                            className="border-destructive focus-visible:ring-destructive"
                                                        />
                                                        {errors[`items.${index}.rejection_reason` as keyof typeof errors] && (
                                                            <div className="text-sm text-destructive">{errors[`items.${index}.rejection_reason` as keyof typeof errors]}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.get(receiptIndex.url())}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || data.items.length === 0}>
                            Record Receipt
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EquipmentReceiptCreate.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Receipts', href: receiptIndex.url() },
        { title: 'New Receipt', href: create.url() },
    ],
};
