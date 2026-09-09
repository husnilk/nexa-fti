import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, CheckCircle, XCircle, Trash2, X, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import RoomUsageController from '@/actions/App/Http/Controllers/RoomUsageController';
import Heading from '@/components/heading';
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
import { useDebounce } from '@/hooks/use-debounce';
import { index as roomUsagesIndex, create as roomUsageCreate, show as roomUsageShow, report as roomUsagesReport } from '@/routes/room-usages';
import type { Auth } from '@/types';

type RoomUsage = {
    id: string;
    room_id: string;
    user_id: string;
    start_time: string;
    end_time: string;
    purpose: string;
    status: string;
    room: { name: string; code: string; building?: { name: string } };
    user: { name: string };
    approved_by?: { name: string };
};

type PageProps = {
    auth: Auth;
    roomUsages: RoomUsage[];
    filters: {
        search?: string;
    };
};

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function RoomUsagesIndex({ roomUsages, filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);

    const [deletingUsage, setDeletingUsage] = useState<RoomUsage | null>(null);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                roomUsagesIndex(),
                { search: debouncedSearch },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    }, [debouncedSearch, filters.search]);

    const mayApprove = can(auth, 'room.manage');
    const mayDelete = (usage: RoomUsage) => (usage.user_id === auth.user.id && can(auth, 'room.request')) || can(auth, 'room.manage');

    function approve(usage: RoomUsage) {
        router.post(RoomUsageController.approve.url(usage.id), {}, { preserveScroll: true });
    }

    function reject(usage: RoomUsage) {
        router.post(RoomUsageController.reject.url(usage.id), {}, { preserveScroll: true });
    }

    function destroyUsage(): void {
        if (!deletingUsage) {
return;
}

        router.delete(RoomUsageController.destroy.url(deletingUsage.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingUsage(null),
        });
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
            <Head title="Room Usages" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Room Usages"
                        description="Propose and manage room usage requests"
                    />
                    <div className="flex items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search requests..."
                                className="pr-10 pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        <Button asChild variant="outline">
                            <Link href={roomUsagesReport.url()}>
                                <Calendar /> Usage Report
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={roomUsageCreate()}>
                                <Plus /> Propose Usage
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[1000px] grid-cols-[150px_150px_150px_150px_1fr_100px_120px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>Requester</span>
                        <span>Room</span>
                        <span>Start Time</span>
                        <span>End Time</span>
                        <span>Purpose</span>
                        <span>Status</span>
                        <span className="text-right">Actions</span>
                    </div>

                    {roomUsages.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No room usage requests found.
                        </div>
                    ) : (
                        <div className="min-w-[1000px] divide-y">
                            {roomUsages.map((usage) => (
                                <div
                                    key={usage.id}
                                    className="grid grid-cols-[150px_150px_150px_150px_1fr_100px_120px] items-center gap-4 px-4 py-3"
                                >
                                    <span className="font-medium truncate">{usage.user.name}</span>
                                    <span className="text-sm truncate" title={`${usage.room.name} (${usage.room.code})`}>
                                        {usage.room.name}
                                    </span>
                                    <span className="text-sm">{dateFormatter.format(new Date(usage.start_time))}</span>
                                    <span className="text-sm">{dateFormatter.format(new Date(usage.end_time))}</span>
                                    <span className="text-sm truncate text-muted-foreground">{usage.purpose}</span>
                                    <div>
                                        <Badge variant={getStatusBadgeVariant(usage.status)} className="capitalize">
                                            {usage.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <Button asChild variant="ghost" size="icon" title="View Detail">
                                            <Link href={roomUsageShow.url(usage.id)}>
                                                <Eye />
                                            </Link>
                                        </Button>
                                        
                                        {mayApprove && usage.status === 'requested' && (
                                            <>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Approve"
                                                    onClick={() => approve(usage)}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/50"
                                                >
                                                    <CheckCircle />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Reject"
                                                    onClick={() => reject(usage)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50"
                                                >
                                                    <XCircle />
                                                </Button>
                                            </>
                                        )}

                                        {usage.status === 'requested' && mayDelete(usage) && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                title="Delete Proposal"
                                                onClick={() => setDeletingUsage(usage)}
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={deletingUsage !== null} onOpenChange={(open) => !open && setDeletingUsage(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Proposal</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete this room usage proposal? This action cannot be undone.
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingUsage(null)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroyUsage}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RoomUsagesIndex.layout = {
    breadcrumbs: [
        { title: 'Assets & Facilities', href: '#' },
        { title: 'Room Usages', href: roomUsagesIndex() },
    ],
};
