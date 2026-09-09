import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, MapPin, Users } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as roomUsagesIndex, report as roomUsagesReport } from '@/routes/room-usages';

type Room = { id: string; name: string; code: string; capacity: number };

type RoomUsage = {
    id: string;
    room_id: string;
    user_id: string;
    start_time: string;
    end_time: string;
    purpose: string;
    status: string;
    user: { name: string };
};

type PageProps = {
    rooms: Room[];
    selectedRoomId: string;
    usages: RoomUsage[];
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RoomUsageReport({ rooms, selectedRoomId, usages }: PageProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedUsage, setSelectedUsage] = useState<RoomUsage | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);

    const handleRoomChange = (roomId: string) => {
        router.get(
            roomUsagesReport.url({
                query: { room_id: roomId }
            }),
            {},
            { preserveState: true }
        );
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    // Calendar generation
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    const calendarCells: { date: Date; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        calendarCells.push({
            date: new Date(year, month - 1, prevTotalDays - i),
            isCurrentMonth: false
        });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
        calendarCells.push({
            date: new Date(year, month, i),
            isCurrentMonth: true
        });
    }

    // Next month padding to fill grid
    const remainingCells = 42 - calendarCells.length;

    for (let i = 1; i <= remainingCells; i++) {
        calendarCells.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false
        });
    }

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const getUsagesForDate = (date: Date) => {
        return usages.filter(usage => {
            const start = new Date(usage.start_time);
            const end = new Date(usage.end_time);
            
            // Set times to midnight to only compare dates
            const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
            const currentMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            return currentMidnight >= startMidnight && currentMidnight <= endMidnight;
        });
    };

    const formatTime = (timeStr: string) => {
        return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <Head title="Room Usage Report" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={roomUsagesIndex()}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <Heading
                            title="Room Usage Report"
                            description="Monthly calendar view of public room reservations"
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <MapPin className="size-4 text-primary" /> Select Room
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="room_select">Room</Label>
                                <Select value={selectedRoomId} onValueChange={handleRoomChange}>
                                    <SelectTrigger id="room_select">
                                        <SelectValue placeholder="Choose a room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.id} value={room.id}>
                                                {room.name} ({room.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedRoom && (
                                <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Code:</span>
                                        <span className="font-mono font-bold">{selectedRoom.code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Capacity:</span>
                                        <span className="flex items-center gap-1 font-bold">
                                            <Users className="size-3 text-muted-foreground" />
                                            {selectedRoom.capacity} people
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <CalendarIcon className="size-5 text-primary" />
                                {monthNames[month]} {year}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={prevMonth}>
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                                    Today
                                </Button>
                                <Button variant="outline" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-px bg-muted overflow-hidden rounded-lg border">
                                {dayNames.map(day => (
                                    <div key={day} className="bg-background py-2 text-center text-xs font-bold text-muted-foreground">
                                        {day}
                                    </div>
                                ))}

                                {calendarCells.map((cell, idx) => {
                                    const dateUsages = getUsagesForDate(cell.date);
                                    const isToday = isSameDay(cell.date, new Date());

                                    return (
                                        <div
                                            key={idx}
                                            className={`bg-background min-h-[100px] p-2 flex flex-col gap-1 border-t transition hover:bg-muted/10 ${
                                                !cell.isCurrentMonth ? 'text-muted-foreground/40 bg-muted/5' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-xs font-semibold rounded-full size-5 flex items-center justify-center ${
                                                    isToday ? 'bg-primary text-primary-foreground font-bold' : ''
                                                }`}>
                                                    {cell.date.getDate()}
                                                </span>
                                            </div>
                                            <div className="flex-1 overflow-y-auto space-y-1">
                                                {dateUsages.map(usage => (
                                                    <button
                                                        key={usage.id}
                                                        type="button"
                                                        onClick={() => setSelectedUsage(usage)}
                                                        className="w-full text-left truncate text-[10px] px-1.5 py-0.5 rounded bg-primary/10 border-l-2 border-primary text-primary font-medium hover:bg-primary/20 transition cursor-pointer"
                                                    >
                                                        {formatTime(usage.start_time)} {usage.user.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={selectedUsage !== null} onOpenChange={(open) => !open && setSelectedUsage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Info className="size-5 text-primary" /> Room Reservation Details
                        </DialogTitle>
                    </DialogHeader>
                    {selectedUsage && (
                        <div className="space-y-4 text-sm mt-2">
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="text-muted-foreground">Proposed By</span>
                                <span className="font-semibold">{selectedUsage.user.name}</span>
                                
                                <span className="text-muted-foreground">Room</span>
                                <span className="font-semibold">{selectedRoom?.name} ({selectedRoom?.code})</span>

                                <span className="text-muted-foreground">Start Time</span>
                                <span>{new Date(selectedUsage.start_time).toLocaleString()}</span>

                                <span className="text-muted-foreground">End Time</span>
                                <span>{new Date(selectedUsage.end_time).toLocaleString()}</span>

                                <span className="text-muted-foreground">Purpose</span>
                                <span className="whitespace-pre-wrap">{selectedUsage.purpose}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

RoomUsageReport.layout = {
    breadcrumbs: [
        { title: 'Assets & Facilities', href: '#' },
        { title: 'Room Usages', href: roomUsagesIndex() },
        { title: 'Usage Report', href: '#' },
    ],
};
