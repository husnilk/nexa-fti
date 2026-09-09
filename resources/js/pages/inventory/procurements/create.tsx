import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import {
    index as procurementIndex,
    store,
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
import type { Auth, Employee, Item } from '@/types';

interface PageProps {
    auth: Auth;
    items: Item[];
    employees: Employee[];
}

export default function ProcurementCreate({ items, employees }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        created_by: '',
        items: [
            { item_id: '', quantity: 1 },
        ],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            { item_id: '', quantity: 1 },
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        (newItems[index] as any)[field] = value;
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <>
            <Head title="New Procurement" />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
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
                        title="New Procurement Request"
                        description="Request new items for inventory."
                    />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-8">
                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Request Details
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="e.g. Monthly Stationery Supply"
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="created_by">Requested By</Label>
                            <Select
                                onValueChange={(val) =>
                                    setData('created_by', val)
                                }
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
                            {errors.created_by && (
                                <p className="text-sm text-destructive">
                                    {errors.created_by}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-lg font-semibold">Items</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </div>

                        {data.items.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 items-end gap-4 border-b pb-4 last:border-0 last:pb-0"
                            >
                                <div className="col-span-7 grid gap-2">
                                    <Label>Item</Label>
                                    <Select
                                        onValueChange={(val) =>
                                            updateItem(
                                                index,
                                                'item_id',
                                                val,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {items.map((i) => (
                                                <SelectItem
                                                    key={i.id}
                                                    value={i.id}
                                                >
                                                    {i.name} ({i.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-3 grid gap-2">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'quantity',
                                                parseInt(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(index)}
                                        disabled={data.items.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {errors.items && (
                            <p className="text-sm text-destructive">
                                {errors.items}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href={procurementIndex().url}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Submit Procurement Request
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ProcurementCreate.layout = {
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
            title: 'New Request',
            href: '#',
        },
    ],
};
