import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import type { FormEvent } from 'react';
import { update } from '@/actions/App/Http/Controllers/EquipmentUsageController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index as usageIndex } from '@/routes/equipment-usages';
import type { Equipment, EquipmentUsage } from '@/types';

type PageProps = {
    equipmentUsage: EquipmentUsage;
    equipment: Equipment[];
};

export default function EquipmentUsageEdit({ equipmentUsage, equipment = [] }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        equipment_id: equipmentUsage.equipment_id || '',
        planned_start_date: equipmentUsage.planned_start_date
            ? new Date(equipmentUsage.planned_start_date).toISOString().slice(0, 16)
            : '',
        planned_return_date: equipmentUsage.planned_return_date
            ? new Date(equipmentUsage.planned_return_date).toISOString().slice(0, 16)
            : '',
        purpose: equipmentUsage.purpose || '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(update.url(equipmentUsage.id));
    }

    return (
        <>
            <Head title="Edit Loan Request" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={usageIndex()}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Heading
                        title="Edit Loan Request"
                        description="Modify your equipment loan request details"
                    />
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="equipment_id">Select Equipment</Label>
                                    <Select value={data.equipment_id} onValueChange={(value) => setData('equipment_id', value)}>
                                        <SelectTrigger id="equipment_id">
                                            <SelectValue placeholder="Choose available equipment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {equipment.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.equipment_number}
                                                    {item.equipment_model ? ` — ${item.equipment_model.model_name}` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.equipment_id && <p className="text-sm text-destructive">{errors.equipment_id}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="planned_start_date">Planned Start Date</Label>
                                        <Input
                                            id="planned_start_date"
                                            type="datetime-local"
                                            value={data.planned_start_date}
                                            onChange={(e) => setData('planned_start_date', e.target.value)}
                                        />
                                        {errors.planned_start_date && (
                                            <p className="text-sm text-destructive">{errors.planned_start_date}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="planned_return_date">Planned Return Date</Label>
                                        <Input
                                            id="planned_return_date"
                                            type="datetime-local"
                                            value={data.planned_return_date}
                                            onChange={(e) => setData('planned_return_date', e.target.value)}
                                        />
                                        {errors.planned_return_date && (
                                            <p className="text-sm text-destructive">{errors.planned_return_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="purpose">Purpose of Borrowing</Label>
                                    <Textarea
                                        id="purpose"
                                        value={data.purpose}
                                        onChange={(e) => setData('purpose', e.target.value)}
                                        placeholder="Describe why you need to borrow this equipment..."
                                        rows={4}
                                    />
                                    {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button asChild variant="outline">
                                        <Link href={usageIndex()}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Send /> Update Request
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

EquipmentUsageEdit.layout = {
    breadcrumbs: [
        { title: 'Assets & Facilities', href: '#' },
        { title: 'Equipment Loans', href: usageIndex() },
        { title: 'Edit Request', href: '#' },
    ],
};
