import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import RoomController from '@/actions/App/Http/Controllers/RoomController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { index as roomsIndex } from '@/routes/rooms';

type Building = { id: string; name: string };
type Employee = { id: string; name: string };
type Asset = {
    id: string;
    name: string;
    code: string;
    acquisition_type: string;
    acquisition_date: string;
    acquisition_cost: string;
    condition: string;
    status: string;
};
type Room = {
    id: string;
    name: string;
    code: string;
    floor: string;
    capacity: number;
    is_public: boolean;
    building_id: string;
    responsible_employee_id: string;
    asset: Asset;
};

type PageProps = {
    room: Room;
    buildings: Building[];
    employees: Employee[];
};

export default function RoomEdit({ room, buildings, employees }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        // Asset fields
        asset_name: room.asset.name,
        asset_code: room.asset.code,
        acquisition_type: room.asset.acquisition_type,
        acquisition_date: room.asset.acquisition_date.split('T')[0],
        acquisition_cost: room.asset.acquisition_cost || '',
        condition: room.asset.condition,
        status: room.asset.status,
        
        // Room fields
        building_id: room.building_id,
        name: room.name,
        code: room.code,
        floor: room.floor || '',
        capacity: room.capacity.toString(),
        is_public: room.is_public,
        responsible_employee_id: room.responsible_employee_id,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(RoomController.update.url(room.id));
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Edit Room" />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={roomsIndex()}>
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Edit Room
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Edit room: {room.name}
                    </p>
                </div>
            </div>

                <form onSubmit={submit} className="mx-auto w-full max-w-4xl grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardContent className="pt-6 grid gap-6">
                            <h3 className="text-lg font-semibold">Room Information</h3>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="building_id">Building</Label>
                                <Select value={data.building_id} onValueChange={(value) => setData('building_id', value)}>
                                    <SelectTrigger id="building_id">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {buildings.map((b) => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.building_id && <p className="text-sm text-destructive">{errors.building_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Room Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="code">Room Code</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                />
                                {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="floor">Floor</Label>
                                    <Input
                                        id="floor"
                                        value={data.floor}
                                        onChange={(e) => setData('floor', e.target.value)}
                                    />
                                    {errors.floor && <p className="text-sm text-destructive">{errors.floor}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="capacity">Capacity</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                    />
                                    {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="responsible_employee_id">Responsible Employee</Label>
                                <Select value={data.responsible_employee_id} onValueChange={(value) => setData('responsible_employee_id', value)}>
                                    <SelectTrigger id="responsible_employee_id">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.responsible_employee_id && <p className="text-sm text-destructive">{errors.responsible_employee_id}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_public"
                                    checked={data.is_public}
                                    onCheckedChange={(checked) => setData('is_public', checked)}
                                />
                                <Label htmlFor="is_public">Publicly Available</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 grid gap-6">
                            <h3 className="text-lg font-semibold">Asset Information</h3>

                            <div className="grid gap-2">
                                <Label htmlFor="asset_name">Asset Name</Label>
                                <Input
                                    id="asset_name"
                                    value={data.asset_name}
                                    onChange={(e) => setData('asset_name', e.target.value)}
                                />
                                {errors.asset_name && <p className="text-sm text-destructive">{errors.asset_name}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="asset_code">Asset Code</Label>
                                <Input
                                    id="asset_code"
                                    value={data.asset_code}
                                    onChange={(e) => setData('asset_code', e.target.value)}
                                />
                                {errors.asset_code && <p className="text-sm text-destructive">{errors.asset_code}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="acquisition_type">Acquisition Type</Label>
                                <Select value={data.acquisition_type} onValueChange={(value: any) => setData('acquisition_type', value)}>
                                    <SelectTrigger id="acquisition_type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="procurement">Procurement</SelectItem>
                                        <SelectItem value="grant">Grant</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.acquisition_type && <p className="text-sm text-destructive">{errors.acquisition_type}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="acquisition_date">Acquisition Date</Label>
                                    <Input
                                        id="acquisition_date"
                                        type="date"
                                        value={data.acquisition_date}
                                        onChange={(e) => setData('acquisition_date', e.target.value)}
                                    />
                                    {errors.acquisition_date && <p className="text-sm text-destructive">{errors.acquisition_date}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="acquisition_cost">Cost</Label>
                                    <Input
                                        id="acquisition_cost"
                                        type="number"
                                        value={data.acquisition_cost}
                                        onChange={(e) => setData('acquisition_cost', e.target.value)}
                                    />
                                    {errors.acquisition_cost && <p className="text-sm text-destructive">{errors.acquisition_cost}</p>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Select value={data.condition} onValueChange={(value: any) => setData('condition', value)}>
                                    <SelectTrigger id="condition">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="minor_damage">Minor Damage</SelectItem>
                                        <SelectItem value="major_damage">Major Damage</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.condition && <p className="text-sm text-destructive">{errors.condition}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="in_use">In Use</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                        <SelectItem value="retired">Retired</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="md:col-span-2 flex justify-end gap-3">
                        <Link href={roomsIndex()}>
                            <Button type="button" variant="outline" className="cursor-pointer">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md gap-2">
                            <Save className="h-4 w-4" /> Update Room & Asset
                        </Button>
                    </div>
                </form>
        </div>
    );
}

RoomEdit.layout = {
    breadcrumbs: [
        { title: 'Assets', href: '#' },
        { title: 'Rooms', href: roomsIndex() },
        { title: 'Edit Room', href: '#' },
    ],
};
