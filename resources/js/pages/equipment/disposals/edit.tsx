import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import {
    update,
    index as disposalIndex,
} from '@/actions/App/Http/Controllers/EquipmentDisposalController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, Employee, Equipment, EquipmentDisposal, EquipmentDisposalItem } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentDisposal: EquipmentDisposal & {
        equipment_disposal_items?: EquipmentDisposalItem[];
    };
    equipment: Equipment[];
    employees: Employee[];
}

export default function EquipmentDisposalEdit({ equipmentDisposal, equipment = [], employees = [] }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        disposal_number: equipmentDisposal.disposal_number,
        disposal_date: equipmentDisposal.disposal_date ? equipmentDisposal.disposal_date.split('T')[0] : '',
        title: equipmentDisposal.title,
        reason: equipmentDisposal.reason || '',
        disposal_method: equipmentDisposal.disposal_method,
        status: equipmentDisposal.status,
        proposed_by_id: equipmentDisposal.proposed_by_id || '',
        items: equipmentDisposal.equipment_disposal_items?.map(item => ({
            id: item.id,
            equipment_id: item.equipment_id,
            book_value: item.book_value || '',
            disposal_value: item.disposal_value || '',
            notes: item.notes || '',
        })) || [
            { id: undefined, equipment_id: '', book_value: '', disposal_value: '', notes: '' }
        ]
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            { id: undefined, equipment_id: '', book_value: '', disposal_value: '', notes: '' }
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

        // Auto-fill book_value if equipment_id is changed
        if (field === 'equipment_id') {
            const selectedEquipment = equipment.find(e => e.id === value);

            if (selectedEquipment) {
                newItems[index].book_value = selectedEquipment.residual_value || selectedEquipment.acquisition_cost || '0';
            }
        }

        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(update.url(equipmentDisposal.id));
    };

    return (
        <>
            <Head title={`Edit Disposal ${equipmentDisposal.disposal_number}`} />

            <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
                <Heading
                    title={`Edit Disposal Request: ${equipmentDisposal.disposal_number}`}
                    description="Update the disposal request and equipment items list."
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-4 p-4 border rounded-lg bg-card">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="disposal_number">Disposal Number</Label>
                                <Input
                                    id="disposal_number"
                                    value={data.disposal_number}
                                    onChange={(e) => setData('disposal_number', e.target.value)}
                                    required
                                />
                                {errors.disposal_number && <div className="text-sm text-destructive">{errors.disposal_number}</div>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="disposal_date">Disposal Date</Label>
                                <Input
                                    id="disposal_date"
                                    type="date"
                                    value={data.disposal_date}
                                    onChange={(e) => setData('disposal_date', e.target.value)}
                                    required
                                />
                                {errors.disposal_date && <div className="text-sm text-destructive">{errors.disposal_date}</div>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Request Title / Topic</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && <div className="text-sm text-destructive">{errors.title}</div>}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="disposal_method">Disposal Method</Label>
                                <Select
                                    onValueChange={(val) => setData('disposal_method', val)}
                                    value={data.disposal_method}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sold">Sold</SelectItem>
                                        <SelectItem value="donated">Donated</SelectItem>
                                        <SelectItem value="scrapped">Scrapped</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
                                        <SelectItem value="mutation">Mutation</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.disposal_method && <div className="text-sm text-destructive">{errors.disposal_method}</div>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    onValueChange={(val) => setData('status', val)}
                                    value={data.status}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <div className="text-sm text-destructive">{errors.status}</div>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="proposed_by_id">Proposed By</Label>
                                <Select
                                    onValueChange={(val) => setData('proposed_by_id', val)}
                                    value={data.proposed_by_id}
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
                                {errors.proposed_by_id && <div className="text-sm text-destructive">{errors.proposed_by_id}</div>}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason / Justification</Label>
                            <Textarea
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                            />
                            {errors.reason && <div className="text-sm text-destructive">{errors.reason}</div>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Equipments to Dispose</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Equipment
                            </Button>
                        </div>

                        {data.items.map((item, index) => (
                            <div key={index} className="relative grid gap-4 p-4 border rounded-lg bg-muted/30">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Equipment Asset</Label>
                                        <Select
                                            onValueChange={(val) => updateItem(index, 'equipment_id', val)}
                                            value={item.equipment_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select equipment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {equipment.map((eq) => (
                                                    <SelectItem key={eq.id} value={eq.id}>
                                                        {eq.equipment_number} ({eq.equipment_model?.brand} {eq.equipment_model?.model_name})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors[`items.${index}.equipment_id` as keyof typeof errors] && (
                                            <div className="text-sm text-destructive">{errors[`items.${index}.equipment_id` as keyof typeof errors]}</div>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Book Value</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.book_value}
                                            onChange={(e) => updateItem(index, 'book_value', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors[`items.${index}.book_value` as keyof typeof errors] && (
                                            <div className="text-sm text-destructive">{errors[`items.${index}.book_value` as keyof typeof errors]}</div>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Disposal Value</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.disposal_value}
                                            onChange={(e) => updateItem(index, 'disposal_value', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors[`items.${index}.disposal_value` as keyof typeof errors] && (
                                            <div className="text-sm text-destructive">{errors[`items.${index}.disposal_value` as keyof typeof errors]}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Notes (Condition, details)</Label>
                                    <Input
                                        value={item.notes}
                                        onChange={(e) => updateItem(index, 'notes', e.target.value)}
                                    />
                                    {errors[`items.${index}.notes` as keyof typeof errors] && (
                                        <div className="text-sm text-destructive">{errors[`items.${index}.notes` as keyof typeof errors]}</div>
                                    )}
                                </div>

                                {data.items.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-2 -right-2 bg-background border shadow-sm rounded-full"
                                        onClick={() => removeItem(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {errors.items && <div className="text-sm text-destructive font-medium">{errors.items}</div>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.get(disposalIndex())}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Update Request
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EquipmentDisposalEdit.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Disposals', href: disposalIndex() },
        { title: 'Edit Request', href: '#' },
    ],
};
