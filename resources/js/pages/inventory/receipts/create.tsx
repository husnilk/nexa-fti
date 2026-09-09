import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, ClipboardCheck } from 'lucide-react';
import { useEffect } from 'react';
import {
    index as procurementIndex,
} from '@/actions/App/Http/Controllers/Inventory/InventoryProcurementController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Auth, Employee, InventoryProcurement, Warehouse } from '@/types';

interface PageProps {
    auth: Auth;
    procurements: InventoryProcurement[];
    selectedProcurement?: InventoryProcurement;
    warehouses: Warehouse[];
    employees: Employee[];
}

export default function ReceiptCreate({
    procurements,
    selectedProcurement,
    warehouses,
    employees,
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        inventory_procurement_id: selectedProcurement?.id || '',
        warehouse_id: '',
        received_by: '',
        receipt_date: new Date().toISOString().split('T')[0],
        items: selectedProcurement?.inventory_procurement_items?.map((item) => ({
            inventory_procurement_item_id: item.id,
            item_id: item.item_id,
            item_name: item.item?.name,
            quantity: item.quantity,
        })) || [],
    });

    const handleProcurementChange = (id: string) => {
        const proc = procurements.find((p) => p.id === id);

        if (proc) {
            setData({
                ...data,
                inventory_procurement_id: id,
                items: proc.inventory_procurement_items?.map((item) => ({
                    inventory_procurement_item_id: item.id,
                    item_id: item.item_id,
                    item_name: item.item?.name,
                    quantity: item.quantity,
                })) || [],
            });
        }
    };

    const updateItemQuantity = (index: number, qty: number) => {
        const newItems = [...data.items];
        newItems[index].quantity = qty;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventory/receipts');
    };

    return (
        <>
            <Head title="Receive Items" />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Back"
                    >
                        <Link href={selectedProcurement ? `/inventory/procurements/${selectedProcurement.id}` : procurementIndex().url}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="Receive Inventory Items"
                        description="Record incoming items into a warehouse."
                    />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-8">
                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Receipt Details
                        </h3>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="procurement">Procurement Request</Label>
                                <Select
                                    value={data.inventory_procurement_id}
                                    onValueChange={handleProcurementChange}
                                    disabled={!!selectedProcurement}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select procurement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {procurements.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.request_number} - {p.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="warehouse">Target Warehouse</Label>
                                    <Select
                                        onValueChange={(val) => setData('warehouse_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select warehouse" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map((wh) => (
                                                <SelectItem key={wh.id} value={wh.id}>
                                                    {wh.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.warehouse_id && (
                                        <p className="text-sm text-destructive">{errors.warehouse_id}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Receipt Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.receipt_date}
                                        onChange={(e) => setData('receipt_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="receiver">Received By</Label>
                                <Select
                                    onValueChange={(val) => setData('received_by', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.received_by && (
                                    <p className="text-sm text-destructive">{errors.received_by}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Items Received
                        </h3>

                        <div className="grid gap-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                    <div className="col-span-8">
                                        <div className="font-medium">{item.item_name}</div>
                                    </div>
                                    <div className="col-span-4 grid gap-2">
                                        <Label>Quantity Received</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(index, parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            ))}
                            {data.items.length === 0 && (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    Please select a procurement to load items.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href={selectedProcurement ? `/inventory/procurements/${selectedProcurement.id}` : procurementIndex().url}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing || data.items.length === 0}>
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Submit Receipt
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ReceiptCreate.layout = {
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
            title: 'New Receipt',
            href: '#',
        },
    ],
};
