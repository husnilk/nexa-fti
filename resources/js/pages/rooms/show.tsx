import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Users,
    Calendar,
    DollarSign,
    ShieldCheck,
    Activity,
    Pencil,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { __, intlLocale } from '@/lib/i18n';
import { index as roomsIndex, edit as roomEdit } from '@/routes/rooms';

type Asset = {
    id: string;
    name: string;
    code: string;
    type: string;
    acquisition_type: string;
    acquisition_date: string;
    acquisition_cost: number | null;
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
    building: { name: string; code: string };
    responsible_employee: { name: string };
    asset: Asset;
};

type PageProps = {
    room: Room;
};

const currencyFormatter = new Intl.NumberFormat(intlLocale(), {
    style: 'currency',
    currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
});

export default function RoomShow({ room }: PageProps) {
    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Room Detail: :name', { name: room.name })} />
            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
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
                            {room.name}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Room Code: :code', { code: room.code })}
                        </p>
                    </div>
                </div>
                <Link href={roomEdit.url(room.id)}>
                    <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                        <Pencil className="h-4 w-4" /> {__('Edit Room')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Room Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="size-5 text-primary" />
                            {__('Room Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Building')}
                            </span>
                            <div className="flex items-center gap-2 font-medium">
                                <Building2 className="size-4" />
                                {room.building.name} ({room.building.code})
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Floor')}
                            </span>
                            <span className="font-medium">
                                {room.floor || __('N/A')}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Capacity')}
                            </span>
                            <div className="flex items-center gap-2 font-medium">
                                <Users className="size-4" />
                                {__(':count people', { count: room.capacity })}
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Availability')}
                            </span>
                            <Badge
                                variant={
                                    room.is_public ? 'default' : 'secondary'
                                }
                            >
                                {room.is_public ? __('Public') : __('Private')}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Responsible Employee')}
                            </span>
                            <span className="font-medium">
                                {room.responsible_employee.name}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Asset Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="size-5 text-primary" />
                            {__('Asset Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Asset Name')}
                            </span>
                            <span className="font-medium">
                                {room.asset.name}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Asset Code')}
                            </span>
                            <code className="font-mono text-xs">
                                {room.asset.code}
                            </code>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Status')}
                            </span>
                            <Badge className="capitalize">
                                {room.asset.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Condition')}
                            </span>
                            <div className="flex items-center gap-2 font-medium capitalize">
                                <Activity className="size-4" />
                                {room.asset.condition.replace('_', ' ')}
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                                {__('Acquisition')}
                            </span>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="size-4" />
                                    {dateFormatter.format(
                                        new Date(room.asset.acquisition_date),
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <DollarSign className="size-3" />
                                    {room.asset.acquisition_cost
                                        ? currencyFormatter.format(
                                              room.asset.acquisition_cost,
                                          )
                                        : __('Cost N/A')}
                                    <Badge
                                        variant="outline"
                                        className="ml-2 h-4 px-1 text-[10px] capitalize"
                                    >
                                        {room.asset.acquisition_type}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

RoomShow.layout = {
    breadcrumbs: [
        { title: __('Assets'), href: '#' },
        { title: __('Rooms'), href: roomsIndex() },
        { title: __('Room Detail'), href: '#' },
    ],
};
