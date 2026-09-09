import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X, MapPin, Building2, Shield } from 'lucide-react';
import { useState } from 'react';
import RoomController from '@/actions/App/Http/Controllers/RoomController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { index as buildingsIndex } from '@/routes/buildings';
import { index as roomsIndex, create as roomCreate, edit as roomEdit, show as roomShow } from '@/routes/rooms';
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

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
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
    const uniqueBuildings = Array.from(new Set(rooms.map((r) => r.building?.name).filter(Boolean)));
    const uniqueFloors = Array.from(new Set(rooms.map((r) => r.floor).filter(Boolean))).sort();

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch = 
            room.name.toLowerCase().includes(search.toLowerCase()) ||
            room.code.toLowerCase().includes(search.toLowerCase()) ||
            (room.building?.name && room.building.name.toLowerCase().includes(search.toLowerCase())) ||
            (room.responsible_employee?.name && room.responsible_employee.name.toLowerCase().includes(search.toLowerCase()));
            
        const matchesBuilding = buildingFilter === 'all' || room.building?.name === buildingFilter;
        const matchesFloor = floorFilter === 'all' || room.floor === floorFilter;
        const matchesAvailability = 
            availabilityFilter === 'all' || 
            (availabilityFilter === 'public' && room.is_public) || 
            (availabilityFilter === 'private' && !room.is_public);
            
        const matchesStatus = statusFilter === 'all' || room.asset?.status === statusFilter;

        return matchesSearch && matchesBuilding && matchesFloor && matchesAvailability && matchesStatus;
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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Rooms" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Rooms
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all university rooms, venues, classrooms, laboratories, and physical spaces.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={buildingsIndex()}>
                        <Button variant="outline" className="cursor-pointer gap-2 font-medium">
                            <Building2 className="h-4 w-4" /> Buildings
                        </Button>
                    </Link>
                    {mayCreate && (
                        <Link href={roomCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                                <Plus className="h-4 w-4" /> Add Room
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search rooms..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={buildingFilter}
                        onChange={(e) => setBuildingFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Buildings</option>
                        {uniqueBuildings.map((buildingName) => (
                            <option key={buildingName} value={buildingName}>
                                {buildingName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={floorFilter}
                        onChange={(e) => setFloorFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Floors</option>
                        {uniqueFloors.map((floor) => (
                            <option key={floor} value={floor}>
                                Floor {floor}
                            </option>
                        ))}
                    </select>

                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Availability</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="retired">Retired</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6 w-[120px]">Code</th>
                                <th className="py-4 px-6">Room Name</th>
                                <th className="py-4 px-6">Building & Floor</th>
                                <th className="py-4 px-6 w-[120px]">Capacity</th>
                                <th className="py-4 px-6">Responsible Person</th>
                                <th className="py-4 px-6 text-center w-[160px]">Status</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                                {room.code}
                                            </code>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {room.name}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                                                    {room.building?.name || '-'}
                                                </span>
                                                {room.floor && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Floor {room.floor}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                            {room.capacity} people
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                            {room.responsible_employee?.name || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                                                    ${room.asset?.status === 'available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400' : ''}
                                                    ${room.asset?.status === 'in_use' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400' : ''}
                                                    ${room.asset?.status === 'maintenance' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400' : ''}
                                                    ${room.asset?.status === 'retired' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400' : ''}
                                                `}>
                                                    {(room.asset?.status || '').replace('_', ' ')}
                                                </span>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium tracking-wide uppercase
                                                    ${room.is_public ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}
                                                `}>
                                                    {room.is_public ? 'Public' : 'Private'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={roomShow.url(room.id)}>
                                                    <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayUpdate && (
                                                    <Link href={roomEdit.url(room.id)}>
                                                        <Button variant="ghost" size="icon" title="Edit" className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Delete"
                                                        onClick={() => setDeletingRoom(room)}
                                                        className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
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
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No rooms found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={deletingRoom !== null} onOpenChange={(open) => !open && setDeletingRoom(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Room</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete room {deletingRoom?.name}? This will also delete the associated asset records.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setDeletingRoom(null)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroyRoom} className="cursor-pointer">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

RoomsIndex.layout = {
    breadcrumbs: [
        { title: 'Assets', href: '#' },
        { title: 'Rooms', href: roomsIndex() },
    ],
};
