import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { store } from '@/actions/App/Http/Controllers/EquipmentProcurementController';
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
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import type { Auth, EquipmentModel } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentModels: EquipmentModel[];
}

export default function EquipmentProcurementCreate({
    equipmentModels = [],
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        request_date: new Date().toISOString().split('T')[0],
        items: [
            {
                equipment_model_id: '',
                quantity: 1,
                estimated_unit_price: '',
                specification: '',
            },
        ],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                equipment_model_id: '',
                quantity: 1,
                estimated_unit_price: '',
                specification: '',
            },
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
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
            <Head title={__('New Procurement Request')} />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <Heading
                    title={__('New Procurement Request')}
                    description={__(
                        'Create a new request for equipment procurement.',
                    )}
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-4 rounded-lg border bg-card p-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">{__('Request Title')}</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder={__(
                                    'e.g., Q3 Office Equipment Upgrade',
                                )}
                                required
                            />
                            {errors.title && (
                                <div className="text-sm text-destructive">
                                    {errors.title}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="request_date">
                                    {__('Request Date')}
                                </Label>
                                <Input
                                    id="request_date"
                                    type="date"
                                    value={data.request_date}
                                    onChange={(e) =>
                                        setData('request_date', e.target.value)
                                    }
                                    required
                                />
                                {errors.request_date && (
                                    <div className="text-sm text-destructive">
                                        {errors.request_date}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                {__('Description / Justification')}
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder={__(
                                    'Provide context for this procurement request...',
                                )}
                            />
                            {errors.description && (
                                <div className="text-sm text-destructive">
                                    {errors.description}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                                {__('Procurement Items')}
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {__('Add Item')}
                            </Button>
                        </div>

                        {data.items.map((item, index) => (
                            <div
                                key={index}
                                className="relative grid gap-4 rounded-lg border bg-muted/30 p-4"
                            >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>{__('Equipment Model')}</Label>
                                        <Select
                                            onValueChange={(val) =>
                                                updateItem(
                                                    index,
                                                    'equipment_model_id',
                                                    val,
                                                )
                                            }
                                            value={item.equipment_model_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={__(
                                                        'Select model',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {equipmentModels.map(
                                                    (model) => (
                                                        <SelectItem
                                                            key={model.id}
                                                            value={model.id}
                                                        >
                                                            {model.manufacturer}{' '}
                                                            {model.brand} -{' '}
                                                            {model.model_name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors[
                                            `items.${index}.equipment_model_id` as keyof typeof errors
                                        ] && (
                                            <div className="text-sm text-destructive">
                                                {
                                                    errors[
                                                        `items.${index}.equipment_model_id` as keyof typeof errors
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label>{__('Quantity')}</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'quantity',
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                required
                                            />
                                            {errors[
                                                `items.${index}.quantity` as keyof typeof errors
                                            ] && (
                                                <div className="text-sm text-destructive">
                                                    {
                                                        errors[
                                                            `items.${index}.quantity` as keyof typeof errors
                                                        ]
                                                    }
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>
                                                {__('Est. Unit Price')}
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={
                                                    item.estimated_unit_price
                                                }
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'estimated_unit_price',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>
                                        {__('Specification Requirements')}
                                    </Label>
                                    <Input
                                        value={item.specification}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'specification',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={__(
                                            'Specific requirements for this item...',
                                        )}
                                    />
                                </div>

                                {data.items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-2 -right-2 rounded-full border bg-background shadow-sm"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {errors.items && (
                            <div className="text-sm font-medium text-destructive">
                                {errors.items}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.get(
                                    route('equipment-procurements.index'),
                                )
                            }
                        >
                            {__('Cancel')}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {__('Submit Request')}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EquipmentProcurementCreate.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        {
            title: __('Procurements'),
            href: route('equipment-procurements.index'),
        },
        {
            title: __('New Request'),
            href: route('equipment-procurements.create'),
        },
    ],
};
