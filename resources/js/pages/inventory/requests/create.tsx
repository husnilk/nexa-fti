import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2, Package } from 'lucide-react';
import type { FormEvent } from 'react';
import InventoryRequestController from '@/actions/App/Http/Controllers/Inventory/InventoryRequestController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { __ } from '@/lib/i18n';
import { index as requestIndex } from '@/routes/inventory-requests';
import type { Auth, Employee, Item } from '@/types';

interface PageProps {
    auth: Auth;
    items: Item[];
    employees: Employee[];
}

export default function RequestCreate({
    items = [],
    employees = [],
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm<{
        employee_id: string;
        items: { item_id: string; quantity: number }[];
    }>({
        employee_id: '',
        items: [{ item_id: '', quantity: 1 }],
    });

    const addItem = () => {
        setData('items', [...data.items, { item_id: '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (
        index: number,
        field: 'item_id' | 'quantity',
        value: any,
    ) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    function submit(e: FormEvent) {
        e.preventDefault();
        post(InventoryRequestController.store.url());
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('New Request')} />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
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
                        {__('New Inventory Request')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Submit a request for one or more inventory items.',
                        )}
                    </p>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="mx-auto grid w-full max-w-3xl gap-6"
            >
                {/* Requester Info */}
                <Card className="border shadow-sm dark:border-zinc-800">
                    <CardContent className="grid gap-4 pt-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            {__('Requester Information')}
                        </h3>
                        <div className="grid gap-2">
                            <Label htmlFor="employee_id">
                                {__('Requested By')}
                            </Label>
                            <Select
                                value={data.employee_id}
                                onValueChange={(value) =>
                                    setData('employee_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="employee_id"
                                    className="w-full"
                                >
                                    <SelectValue
                                        placeholder={__('Select employee')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((emp) => (
                                        <SelectItem key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.employee_id && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors.employee_id}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Items Info */}
                <Card className="border shadow-sm dark:border-zinc-800">
                    <CardContent className="grid gap-6 pt-6">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <Package className="h-5 w-5 text-primary" />{' '}
                                {__('Items Requested')}
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                                className="cursor-pointer"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />{' '}
                                {__('Add Item')}
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-end gap-4 border-b pb-4 last:border-b-0 last:pb-0 dark:border-zinc-800"
                                >
                                    <div className="grid flex-1 gap-2">
                                        <Label>{__('Item Name')}</Label>
                                        <Select
                                            value={item.item_id}
                                            onValueChange={(val) =>
                                                updateItem(
                                                    index,
                                                    'item_id',
                                                    val,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={__(
                                                        'Select item',
                                                    )}
                                                />
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
                                        {errors[
                                            `items.${index}.item_id` as any
                                        ] && (
                                            <p className="text-xs font-medium text-destructive">
                                                {
                                                    errors[
                                                        `items.${index}.item_id` as any
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid w-[120px] gap-2">
                                        <Label>{__('Quantity')}</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'quantity',
                                                    parseInt(e.target.value) ||
                                                        1,
                                                )
                                            }
                                        />
                                        {errors[
                                            `items.${index}.quantity` as any
                                        ] && (
                                            <p className="text-xs font-medium text-destructive">
                                                {
                                                    errors[
                                                        `items.${index}.quantity` as any
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                            disabled={data.items.length === 1}
                                            className="h-10 w-10 cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.items && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.items}
                            </p>
                        )}

                        <div className="mt-2 flex justify-end gap-3 border-t pt-4">
                            <Link href={requestIndex()}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    {__('Cancel')}
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Save className="h-4 w-4" />{' '}
                                {processing
                                    ? __('Submitting...')
                                    : __('Submit Request')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}

RequestCreate.layout = {
    breadcrumbs: [
        { title: __('Inventory'), href: '#' },
        { title: __('Requests'), href: requestIndex() },
        { title: __('New Request'), href: '#' },
    ],
};
