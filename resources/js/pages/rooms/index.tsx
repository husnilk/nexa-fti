import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X, Building2 } from 'lucide-react';
import { useState } from 'react';
import RoomController from '@/actions/App/Http/Controllers/RoomController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { __ } from '@/lib/i18n';
import { index as buildingsIndex } from '@/routes/buildings';
import {
    index as roomsIndex,
    create as roomCreate,
    edit as roomEdit,
    show as roomShow,
} from '@/routes/rooms';
import type { Auth } from '@/types';

type Room = {
    id: string;
    name: string;
    code: string;
    floor: string;
    capacity: number;
    is_public: boolean;
    building: { name: string };
    responsible_employee: { name: string };
    asset: { status: string };
};

type PageProps = {
    auth: Auth;
    rooms: Room[];
    filters: {
        search?: string;
    };
    [key: string]: any;
};

const statusLabels: Record<string, string> = {
    available: __('Available'),
    in_use: __('In Use'),
    maintenance: __('Maintenance'),
    retired: __('Retired'),
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function RoomsIndex({ rooms = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
    const [search, setSearch] = useState('');
    const [buildingFilter, setBuildingFilter] = useState('all');
    const [floorFilter, setFloorFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Extract unique values for filtering dropdowns
    const uniqueBuildings = Array.from(
        new Set(rooms.map((r) => r.building?.name).filter(Boolean)),
    );
    const uniqueFloors = Array.from(
        new Set(rooms.map((r) => r.floor).filter(Boolean)),
    ).sort();

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.name.toLowerCase().includes(search.toLowerCase()) ||
            room.code.toLowerCase().includes(search.toLowerCase()) ||
            (room.building?.name &&
                room.building.name
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
            (room.responsible_employee?.name &&
                room.responsible_employee.name
                    .toLowerCase()
                    .includes(search.toLowerCase()));

        const matchesBuilding =
            buildingFilter === 'all' || room.building?.name === buildingFilter;
        const matchesFloor =
            floorFilter === 'all' || room.floor === floorFilter;
        const matchesAvailability =
            availabilityFilter === 'all' ||
            (availabilityFilter === 'public' && room.is_public) ||
            (availabilityFilter === 'private' && !room.is_public);

        const matchesStatus =
            statusFilter === 'all' || room.asset?.status === statusFilter;

        return (
            matchesSearch &&
            matchesBuilding &&
            matchesFloor &&
            matchesAvailability &&
            matchesStatus
        );
    });

    const mayCreate = can(auth, 'room.manage');
    const mayUpdate = can(auth, 'room.manage');
    const mayDelete = can(auth, 'room.manage');

    function destroyRoom(): void {
        if (!deletingRoom) {
            return;
        }

        router.delete(RoomController.destroy.url(deletingRoom.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingRoom(null),
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Rooms')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Rooms')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage all university rooms, venues, classrooms, laboratories, and physical spaces.',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={buildingsIndex()}>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 font-medium"
                        >
                            <Building2 className="h-4 w-4" /> {__('Buildings')}
                        </Button>
                    </Link>
                    {mayCreate && (
                        <Link href={roomCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                                <Plus className="h-4 w-4" /> {__('Add Room')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search rooms...')}
                        className="bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <select
                        value={buildingFilter}
                        onChange={(e) => setBuildingFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Buildings')}</option>
                        {uniqueBuildings.map((buildingName) => (
                            <option key={buildingName} value={buildingName}>
                                {buildingName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={floorFilter}
                        onChange={(e) => setFloorFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Floors')}</option>
                        {uniqueFloors.map((floor) => (
                            <option key={floor} value={floor}>
                                {__('Floor :floor', { floor })}
                            </option>
                        ))}
                    </select>

                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Availability')}</option>
                        <option value="public">{__('Public')}</option>
                        <option value="private">{__('Private')}</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Statuses')}</option>
                        <option value="available">{__('Available')}</option>
                        <option value="in_use">{__('In Use')}</option>
                        <option value="maintenance">{__('Maintenance')}</option>
                        <option value="retired">{__('Retired')}</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="w-[120px] px-6 py-4">
                                    {__('Code')}
                                </th>
                                <th className="px-6 py-4">{__('Room Name')}</th>
                                <th className="px-6 py-4">
                                    {__('Building & Floor')}
                                </th>
                                <th className="w-[120px] px-6 py-4">
                                    {__('Capacity')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Responsible Person')}
                                </th>
                                <th className="w-[160px] px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="w-[150px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room) => (
                                    <tr
                                        key={room.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                                                {room.code}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {room.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                                    {room.building?.name || '-'}
                                                </span>
                                                {room.floor && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {__('Floor :floor', {
                                                            floor: room.floor,
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {__(':count people', {
                                                count: room.capacity,
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                            {room.responsible_employee?.name ||
                                                '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${room.asset?.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} ${room.asset?.status === 'in_use' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${room.asset?.status === 'maintenance' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400' : ''} ${room.asset?.status === 'retired' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400' : ''} `}
                                                >
                                                    {statusLabels[
                                                        room.asset?.status
                                                    ] ??
                                                        (
                                                            room.asset
                                                                ?.status || ''
                                                        ).replace('_', ' ')}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${room.is_public ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'} `}
                                                >
                                                    {room.is_public
                                                        ? __('Public')
                                                        : __('Private')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={roomShow.url(room.id)}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__(
                                                            'View Detail',
                                                        )}
                                                        className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayUpdate && (
                                                    <Link
                                                        href={roomEdit.url(
                                                            room.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title={__('Edit')}
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Delete')}
                                                        onClick={() =>
                                                            setDeletingRoom(
                                                                room,
                                                            )
                                                        }
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No rooms found matching the filters.',
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={deletingRoom !== null}
                onOpenChange={(open) => !open && setDeletingRoom(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Room')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__(
                            'Are you sure you want to delete room :name? This will also delete the associated asset records.',
                            { name: deletingRoom?.name ?? '' },
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingRoom(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyRoom}
                            className="cursor-pointer"
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

RoomsIndex.layout = {
    breadcrumbs: [
        { title: __('Assets'), href: '#' },
        { title: __('Rooms'), href: roomsIndex() },
    ],
};
