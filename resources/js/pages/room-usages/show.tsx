import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, User, XCircle } from 'lucide-react';
import RoomUsageController from '@/actions/App/Http/Controllers/RoomUsageController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { index as roomUsagesIndex } from '@/routes/room-usages';
import type { Auth } from '@/types';

type RoomUsage = {
    id: string;
    room_id: string;
    user_id: string;
    start_time: string;
    end_time: string;
    purpose: string;
    status: string;
    room: { name: string; code: string; capacity: number };
    user: { name: string; email: string };
    approved_by?: { name: string };
};

type PageProps = {
    auth: Auth;
    roomUsage: RoomUsage;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

export default function RoomUsageShow({ roomUsage }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayApprove = can(auth, 'room');

    function approve() {
        router.post(RoomUsageController.approve.url(roomUsage.id), {}, { preserveScroll: true });
    }

    function reject() {
        router.post(RoomUsageController.reject.url(roomUsage.id), {}, { preserveScroll: true });
    }

    function getStatusBadgeVariant(status: string) {
        switch (status) {
            case 'approved': return 'default';
            case 'rejected': return 'destructive';
            case 'completed': return 'secondary';
            default: return 'outline';
        }
    }

    return (
        <>
            <Head title="Room Usage Detail" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={roomUsagesIndex()}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <Heading
                            title="Room Usage Proposal"
                            description="Detailed view of the room usage request"
                        />
                    </div>
                    {mayApprove && roomUsage.status === 'requested' && (
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={reject}>
                                <XCircle className="mr-2 size-4" /> Reject
                            </Button>
                            <Button className="bg-green-600 text-white hover:bg-green-700" onClick={approve}>
                                <CheckCircle className="mr-2 size-4" /> Approve
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="size-5 text-primary" />
                                Request Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                <Badge variant={getStatusBadgeVariant(roomUsage.status)} className="capitalize">
                                    {roomUsage.status}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-muted-foreground">Purpose</span>
                                <p className="text-sm">{roomUsage.purpose}</p>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Schedule</span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="size-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span>Start: {dateFormatter.format(new Date(roomUsage.start_time))}</span>
                                        <span>End: {dateFormatter.format(new Date(roomUsage.end_time))}</span>
                                    </div>
                                </div>
                            </div>
                            {roomUsage.approved_by && (
                                <>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Action By</span>
                                        <span className="text-sm font-medium">{roomUsage.approved_by.name}</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="size-5 text-primary" />
                                    Requester Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Name</span>
                                    <span className="font-medium">{roomUsage.user.name}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                                    <span className="text-sm">{roomUsage.user.email}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="size-5 text-primary" />
                                    Room Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Room</span>
                                    <span className="font-medium">{roomUsage.room.name}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Code</span>
                                    <code className="text-xs font-mono">{roomUsage.room.code}</code>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">Capacity</span>
                                    <span className="text-sm">{roomUsage.room.capacity} people</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

RoomUsageShow.layout = {
    breadcrumbs: [
        { title: 'Assets & Facilities', href: '#' },
        { title: 'Room Usages', href: roomUsagesIndex() },
        { title: 'Usage Detail', href: '#' },
    ],
};
