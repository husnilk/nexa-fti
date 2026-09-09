import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, ClipboardList } from 'lucide-react';
import {
    index as requestIndex,
} from '@/actions/App/Http/Controllers/Inventory/InventoryRequestController';
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
import type { Auth, Employee, InventoryRequest, Warehouse } from '@/types';

interface PageProps {
    auth: Auth;
    requests: InventoryRequest[];
    selectedRequest?: InventoryRequest;
    warehouses: Warehouse[];
    employees: Employee[];
}

export default function IssueCreate({
    requests,
    selectedRequest,
    warehouses,
    employees,
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        inventory_request_id: selectedRequest?.id || '',
        warehouse_id: '',
        issued_by: '',
        issue_date: new Date().toISOString().split('T')[0],
        items: selectedRequest?.inventory_request_items?.map((detail) => ({
            inventory_request_detail_id: detail.id,
            item_id: detail.item_id,
            item_name: detail.item?.name,
            quantity: detail.quantity,
        })) || [],
    });

    const handleRequestChange = (id: string) => {
        const req = requests.find((r) => r.id === id);

        if (req) {
            setData({
                ...data,
                inventory_request_id: id,
                items: req.inventory_request_items?.map((detail) => ({
                    inventory_request_detail_id: detail.id,
                    item_id: detail.item_id,
                    item_name: detail.item?.name,
                    quantity: detail.quantity,
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
        post('/inventory/issues');
    };

    return (
        <>
            <Head title="Issue Items" />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Back"
                    >
                        <Link href={selectedRequest ? `/inventory/requests/${selectedRequest.id}` : requestIndex().url}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="Issue Inventory Items"
                        description="Fulfill an approved request from a warehouse."
                    />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-8">
                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Issue Details
                        </h3>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="request">Inventory Request</Label>
                                <Select
                                    value={data.inventory_request_id}
                                    onValueChange={handleRequestChange}
                                    disabled={!!selectedRequest}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select request" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {requests.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.request_number} - {r.employee?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="warehouse">Source Warehouse</Label>
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
                                    <Label htmlFor="date">Issue Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.issue_date}
                                        onChange={(e) => setData('issue_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="issuer">Issued By</Label>
                                <Select
                                    onValueChange={(val) => setData('issued_by', val)}
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
                                {errors.issued_by && (
                                    <p className="text-sm text-destructive">{errors.issued_by}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Items to Issue
                        </h3>

                        <div className="grid gap-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                    <div className="col-span-8">
                                        <div className="font-medium">{item.item_name}</div>
                                    </div>
                                    <div className="col-span-4 grid gap-2">
                                        <Label>Quantity to Issue</Label>
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
                                    Please select a request to load items.
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
                            <Link href={selectedRequest ? `/inventory/requests/${selectedRequest.id}` : requestIndex().url}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing || data.items.length === 0}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Submit Issue
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

IssueCreate.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Requests',
            href: requestIndex(),
        },
        {
            title: 'New Issue',
            href: '#',
        },
    ],
};
