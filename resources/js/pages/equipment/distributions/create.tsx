import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    index as distributionIndex,
    store,
} from '@/actions/App/Http/Controllers/EquipmentDistributionController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, Employee, Equipment, Room } from '@/types';

interface PageProps {
    auth: Auth;
    equipment: Equipment[];
    employees: Employee[];
    rooms: Room[];
}

export default function EquipmentDistributionCreate({ equipment = [], employees = [], rooms = [] }: PageProps) {
    const [targetType, setTargetType] = useState<'room' | 'employee'>('room');

    const { data, setData, post, processing, errors } = useForm({
        equipment_id: '',
        employee_id: '',
        room_id: '',
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clean up data based on target type
        const submitData = { ...data };

        if (targetType === 'room') {
submitData.employee_id = '';
}

        if (targetType === 'employee') {
submitData.room_id = '';
}
        
        post(store.url());
    };

    return (
        <>
            <Head title="Distribute Equipment" />

            <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
                <Heading
                    title="Distribute Equipment"
                    description="Assign equipment to a specific room or employee."
                />

                <form onSubmit={handleSubmit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="equipment">Equipment to Distribute</Label>
                                <Select
                                    onValueChange={(val) => setData('equipment_id', val)}
                                    value={data.equipment_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select available equipment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {equipment.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                                {item.equipment_number} - {item.equipment_model?.model_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.equipment_id && <div className="text-sm text-destructive">{errors.equipment_id}</div>}
                            </div>

                            <div className="space-y-3">
                                <Label>Distribute To</Label>
                                <RadioGroup 
                                    defaultValue="room" 
                                    value={targetType} 
                                    onValueChange={(val) => setTargetType(val as any)}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="room" id="target-room" />
                                        <Label htmlFor="target-room" className="font-normal cursor-pointer">Room</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="employee" id="target-employee" />
                                        <Label htmlFor="target-employee" className="font-normal cursor-pointer">Employee / User</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {targetType === 'room' ? (
                                <div className="grid gap-2">
                                    <Label htmlFor="room">Target Room</Label>
                                    <Select
                                        onValueChange={(val) => setData('room_id', val)}
                                        value={data.room_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem key={room.id} value={room.id}>
                                                    {room.name} ({room.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.room_id && <div className="text-sm text-destructive">{errors.room_id}</div>}
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    <Label htmlFor="employee">Target Employee</Label>
                                    <Select
                                        onValueChange={(val) => setData('employee_id', val)}
                                        value={data.employee_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {emp.name} ({emp.emp_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employee_id && <div className="text-sm text-destructive">{errors.employee_id}</div>}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="assigned_date">Assignment Date</Label>
                                    <Input
                                        id="assigned_date"
                                        type="date"
                                        value={data.assigned_date}
                                        onChange={(e) => setData('assigned_date', e.target.value)}
                                        required
                                    />
                                    {errors.assigned_date && <div className="text-sm text-destructive">{errors.assigned_date}</div>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes / Instructions</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Optional notes for the recipient..."
                                />
                                {errors.notes && <div className="text-sm text-destructive">{errors.notes}</div>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.get(distributionIndex.url())}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Assign Equipment
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EquipmentDistributionCreate.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Distributions', href: distributionIndex.url() },
        { title: 'New Assignment', href: '#' },
    ],
};
