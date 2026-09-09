import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, Trash2, X, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as requestIndex,
    create as requestCreate,
    show as requestShow,
    destroy as requestDestroy,
} from '@/actions/App/Http/Controllers/EquipmentMaintenanceRequestController';
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
import type { Auth, EquipmentMaintenanceRequest } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentMaintenanceRequests: EquipmentMaintenanceRequest[];
}

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function EquipmentMaintenanceIndex({ equipmentMaintenanceRequests = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');

    const filteredRequests = equipmentMaintenanceRequests.filter(req => 
        (req.equipment?.equipment_number || '').toLowerCase().includes(search.toLowerCase()) ||
        req.problem_description.toLowerCase().includes(search.toLowerCase()) ||
        (req.reported_by_employee?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const [deletingRequest, setDeletingRequest] = useState<EquipmentMaintenanceRequest | null>(null);

    function destroyRequest(): void {
        if (!deletingRequest) {
            return;
        }

        router.delete(requestDestroy.url(deletingRequest.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingRequest(null),
        });
    }

    function getStatusBadgeVariant(status: string) {
        switch (status) {
            case 'in_progress': return 'secondary';
            case 'resolved': return 'outline';
            case 'closed': return 'default';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case 'open': return <AlertCircle className="size-4" />;
            case 'in_progress': return <Clock className="size-4" />;
            case 'closed': return <CheckCircle2 className="size-4" />;
            default: return null;
        }
    }

    return (
        <>
            <Head title="Equipment Maintenance" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Equipment Maintenance"
                        description="Report and track equipment maintenance issues"
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
                        {can(auth, 'equipment.maintenance-request') && (
                            <Button asChild>
                                <Link href={requestCreate.url()}>
                                    <Plus /> Report Issue
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[900px] grid-cols-[180px_180px_1fr_150px_120px_100px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>Equipment</span>
                        <span>Reported By</span>
                        <span>Description</span>
                        <span>Date Reported</span>
                        <span>Status</span>
                        <span className="text-right">Actions</span>
                    </div>

                    {filteredRequests.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            No maintenance requests found.
                        </div>
                    ) : (
                        <div className="min-w-[900px] divide-y">
                            {filteredRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="grid grid-cols-[180px_180px_1fr_150px_120px_100px] items-center gap-4 px-4 py-3"
                                >
                                    <span className="font-medium truncate" title={req.equipment?.equipment_number}>
                                        {req.equipment?.equipment_number}
                                    </span>
                                    <span className="text-sm truncate">{req.reported_by_employee?.name || 'Unknown'}</span>
                                    <span className="text-sm truncate text-muted-foreground">{req.problem_description}</span>
                                    <span className="text-sm">{dateFormatter.format(new Date(req.created_at))}</span>
                                    <div>
                                        <Badge variant={getStatusBadgeVariant(req.status)} className="flex w-fit items-center gap-1 capitalize">
                                            {getStatusIcon(req.status)}
                                            {req.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <Button asChild variant="ghost" size="icon" title="View Detail">
                                            <Link href={requestShow.url(req.id)}>
                                                <Eye />
                                            </Link>
                                        </Button>
                                        
                                        {(req.status === 'open' && (req.reported_by_id === auth.user.id || can(auth, 'equipment.manage') || can(auth, 'maintenance.manage'))) && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                title="Delete Request"
                                                onClick={() => setDeletingRequest(req)}
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

            <Dialog open={deletingRequest !== null} onOpenChange={(open) => !open && setDeletingRequest(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Request</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete this maintenance request? This action cannot be undone.
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingRequest(null)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroyRequest}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentMaintenanceIndex.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Equipment Maintenance', href: requestIndex() },
    ],
};
