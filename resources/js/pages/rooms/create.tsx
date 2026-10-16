import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import RoomController from '@/actions/App/Http/Controllers/RoomController';
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
import { Switch } from '@/components/ui/switch';
import { __ } from '@/lib/i18n';
import { index as roomsIndex } from '@/routes/rooms';

type Building = { id: string; name: string };
type Employee = { id: string; name: string };

type PageProps = {
    buildings: Building[];
    employees: Employee[];
};

export default function RoomCreate({ buildings, employees }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        // Asset fields
        asset_name: '',
        asset_code: '',
        acquisition_type: 'procurement',
        acquisition_date: '',
        acquisition_cost: '',
        condition: 'good',
        status: 'available',

        // Room fields
        building_id: '',
        name: '',
        code: '',
        floor: '',
        capacity: '',
        is_public: false,
        responsible_employee_id: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(RoomController.store.url());
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Add Room')} />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={roomsIndex()}>
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
                        {__('Add Room')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Create a new room and its corresponding asset record.',
                        )}
                    </p>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2"
            >
                <Card>
                    <CardContent className="grid gap-6 pt-6">
                        <h3 className="text-lg font-semibold">
                            {__('Room Information')}
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="building_id">
                                {__('Building')}
                            </Label>
                            <Select
                                value={data.building_id}
                                onValueChange={(value) =>
                                    setData('building_id', value)
                                }
                            >
                                <SelectTrigger id="building_id">
                                    <SelectValue
                                        placeholder={__('Select building')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {buildings.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.building_id && (
                                <p className="text-sm text-destructive">
                                    {errors.building_id}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">{__('Room Name')}</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder={__('e.g. Lab 101')}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="code">{__('Room Code')}</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData('code', e.target.value)
                                }
                                placeholder={__('e.g. R-101')}
                            />
                            {errors.code && (
                                <p className="text-sm text-destructive">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="floor">{__('Floor')}</Label>
                                <Input
                                    id="floor"
                                    value={data.floor}
                                    onChange={(e) =>
                                        setData('floor', e.target.value)
                                    }
                                    placeholder={__('e.g. 1st')}
                                />
                                {errors.floor && (
                                    <p className="text-sm text-destructive">
                                        {errors.floor}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="capacity">
                                    {__('Capacity')}
                                </Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={data.capacity}
                                    onChange={(e) =>
                                        setData('capacity', e.target.value)
                                    }
                                    placeholder="0"
                                />
                                {errors.capacity && (
                                    <p className="text-sm text-destructive">
                                        {errors.capacity}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="responsible_employee_id">
                                {__('Responsible Employee')}
                            </Label>
                            <Select
                                value={data.responsible_employee_id}
                                onValueChange={(value) =>
                                    setData('responsible_employee_id', value)
                                }
                            >
                                <SelectTrigger id="responsible_employee_id">
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
                            {errors.responsible_employee_id && (
                                <p className="text-sm text-destructive">
                                    {errors.responsible_employee_id}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                id="is_public"
                                checked={data.is_public}
                                onCheckedChange={(checked) =>
                                    setData('is_public', checked)
                                }
                            />
                            <Label htmlFor="is_public">
                                {__('Publicly Available')}
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="grid gap-6 pt-6">
                        <h3 className="text-lg font-semibold">
                            {__('Asset Information')}
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="asset_name">
                                {__('Asset Name')}
                            </Label>
                            <Input
                                id="asset_name"
                                value={data.asset_name}
                                onChange={(e) =>
                                    setData('asset_name', e.target.value)
                                }
                                placeholder={__('e.g. Room Lab 101 Asset')}
                            />
                            {errors.asset_name && (
                                <p className="text-sm text-destructive">
                                    {errors.asset_name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="asset_code">
                                {__('Asset Code')}
                            </Label>
                            <Input
                                id="asset_code"
                                value={data.asset_code}
                                onChange={(e) =>
                                    setData('asset_code', e.target.value)
                                }
                                placeholder={__('e.g. AST-R-101')}
                            />
                            {errors.asset_code && (
                                <p className="text-sm text-destructive">
                                    {errors.asset_code}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="acquisition_type">
                                {__('Acquisition Type')}
                            </Label>
                            <Select
                                value={data.acquisition_type}
                                onValueChange={(value: any) =>
                                    setData('acquisition_type', value)
                                }
                            >
                                <SelectTrigger id="acquisition_type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="procurement">
                                        {__('Procurement')}
                                    </SelectItem>
                                    <SelectItem value="grant">
                                        {__('Grant')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.acquisition_type && (
                                <p className="text-sm text-destructive">
                                    {errors.acquisition_type}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="acquisition_date">
                                    {__('Acquisition Date')}
                                </Label>
                                <Input
                                    id="acquisition_date"
                                    type="date"
                                    value={data.acquisition_date}
                                    onChange={(e) =>
                                        setData(
                                            'acquisition_date',
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.acquisition_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.acquisition_date}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="acquisition_cost">
                                    {__('Cost')}
                                </Label>
                                <Input
                                    id="acquisition_cost"
                                    type="number"
                                    value={data.acquisition_cost}
                                    onChange={(e) =>
                                        setData(
                                            'acquisition_cost',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="0.00"
                                />
                                {errors.acquisition_cost && (
                                    <p className="text-sm text-destructive">
                                        {errors.acquisition_cost}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="condition">{__('Condition')}</Label>
                            <Select
                                value={data.condition}
                                onValueChange={(value: any) =>
                                    setData('condition', value)
                                }
                            >
                                <SelectTrigger id="condition">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="good">
                                        {__('Good')}
                                    </SelectItem>
                                    <SelectItem value="minor_damage">
                                        {__('Minor Damage')}
                                    </SelectItem>
                                    <SelectItem value="major_damage">
                                        {__('Major Damage')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.condition && (
                                <p className="text-sm text-destructive">
                                    {errors.condition}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">{__('Status')}</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: any) =>
                                    setData('status', value)
                                }
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">
                                        {__('Available')}
                                    </SelectItem>
                                    <SelectItem value="in_use">
                                        {__('In Use')}
                                    </SelectItem>
                                    <SelectItem value="maintenance">
                                        {__('Maintenance')}
                                    </SelectItem>
                                    <SelectItem value="retired">
                                        {__('Retired')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 md:col-span-2">
                    <Link href={roomsIndex()}>
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
                        className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90"
                    >
                        <Save className="h-4 w-4" /> {__('Save Room & Asset')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

RoomCreate.layout = {
    breadcrumbs: [
        { title: __('Assets'), href: '#' },
        { title: __('Rooms'), href: roomsIndex() },
        { title: __('Add Room'), href: '#' },
    ],
};
