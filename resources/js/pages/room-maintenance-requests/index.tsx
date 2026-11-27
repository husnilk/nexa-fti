import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    Plus,
    Search,
    Trash2,
    X,
    AlertCircle,
    Clock,
    CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
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
import { __, intlLocale } from '@/lib/i18n';
import {
    index as maintenanceRequestsIndex,
    create as maintenanceRequestCreate,
    show as maintenanceRequestShow,
    destroy as maintenanceRequestDestroy,
} from '@/routes/room-maintenance-requests';
import type { Auth } from '@/types';

type MaintenanceRequest = {
    id: string;
    room_id: string;
    reported_by_id: string;
    issue_description: string;
    status: string;
    reported_at: string;
    resolved_at?: string;
    room: { name: string; code: string };
    reported_by: { user: { name: string } };
};

type PageProps = {
    auth: Auth;
    requests: MaintenanceRequest[];
};

const statusLabels: Record<string, string> = {
    reported: __('Reported'),
    accepted: __('Accepted'),
    in_progress: __('In Progress'),
    resolved: __('Resolved'),
    verified: __('Verified'),
    rejected: __('Rejected'),
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function RoomMaintenanceIndex({ requests }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');

    const filteredRequests = requests.filter(
        (req) =>
            req.room.name.toLowerCase().includes(search.toLowerCase()) ||
            req.room.code.toLowerCase().includes(search.toLowerCase()) ||
            req.issue_description.toLowerCase().includes(search.toLowerCase()),
    );

    const [deletingRequest, setDeletingRequest] =
        useState<MaintenanceRequest | null>(null);

    function destroyRequest(): void {
        if (!deletingRequest) {
            return;
        }

        router.delete(maintenanceRequestDestroy.url(deletingRequest.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingRequest(null),
        });
    }

    function getStatusBadgeVariant(status: string) {
        switch (status) {
            case 'accepted':
                return 'default';
            case 'in_progress':
                return 'secondary';
            case 'resolved':
                return 'outline';
            case 'verified':
                return 'default';
            case 'rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case 'reported':
                return <AlertCircle className="size-4" />;
            case 'in_progress':
                return <Clock className="size-4" />;
            case 'verified':
                return <CheckCircle2 className="size-4" />;
            default:
                return null;
        }
    }

    return (
        <>
            <Head title={__('Room Maintenance')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={__('Room Maintenance')}
                        description={__(
                            'Report and track room maintenance issues',
                        )}
                    />
                    <div className="flex items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={__('Search requests...')}
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
                        <Button asChild>
                            <Link href={maintenanceRequestCreate()}>
                                <Plus /> {__('Report Issue')}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[900px] grid-cols-[150px_150px_1fr_150px_120px_100px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>{__('Room')}</span>
                        <span>{__('Reported By')}</span>
                        <span>{__('Description')}</span>
                        <span>{__('Date Reported')}</span>
                        <span>{__('Status')}</span>
                        <span className="text-right">{__('Actions')}</span>
                    </div>

                    {filteredRequests.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            {__('No maintenance requests found.')}
                        </div>
                    ) : (
                        <div className="min-w-[900px] divide-y">
                            {filteredRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="grid grid-cols-[150px_150px_1fr_150px_120px_100px] items-center gap-4 px-4 py-3"
                                >
                                    <span
                                        className="truncate font-medium"
                                        title={`${req.room.name} (${req.room.code})`}
                                    >
                                        {req.room.name}
                                    </span>
                                    <span className="truncate text-sm">
                                        {req.reported_by.user.name}
                                    </span>
                                    <span className="truncate text-sm text-muted-foreground">
                                        {req.issue_description}
                                    </span>
                                    <span className="text-sm">
                                        {dateFormatter.format(
                                            new Date(req.reported_at),
                                        )}
                                    </span>
                                    <div>
                                        <Badge
                                            variant={getStatusBadgeVariant(
                                                req.status,
                                            )}
                                            className="flex w-fit items-center gap-1 capitalize"
                                        >
                                            {getStatusIcon(req.status)}
                                            {statusLabels[req.status] ??
                                                req.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            title={__('View Detail')}
                                        >
                                            <Link
                                                href={maintenanceRequestShow.url(
                                                    req.id,
                                                )}
                                            >
                                                <Eye />
                                            </Link>
                                        </Button>

                                        {req.status === 'reported' &&
                                            (req.reported_by_id ===
                                                auth.user.id ||
                                                can(auth, 'room') ||
                                                can(auth, 'room.approval') ||
                                                can(
                                                    auth,
                                                    'maintenance.manage',
                                                )) && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    title={__('Delete Request')}
                                                    onClick={() =>
                                                        setDeletingRequest(req)
                                                    }
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

            <Dialog
                open={deletingRequest !== null}
                onOpenChange={(open) => !open && setDeletingRequest(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Request')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__(
                            'Are you sure you want to delete this maintenance request? This action cannot be undone.',
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingRequest(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyRequest}
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

RoomMaintenanceIndex.layout = {
    breadcrumbs: [
        { title: __('Assets & Facilities'), href: '#' },
        { title: __('Room Maintenance'), href: maintenanceRequestsIndex() },
    ],
};
