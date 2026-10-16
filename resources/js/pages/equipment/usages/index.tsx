import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    Plus,
    Search,
    Trash2,
    Undo2,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
    approve,
    reject,
} from '@/actions/App/Http/Controllers/EquipmentUsageApprovalController';
import {
    create,
    destroy,
    index as usageIndex,
    returnMethod as returnAction,
    show,
} from '@/actions/App/Http/Controllers/EquipmentUsageController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';
import { __, intlLocale } from '@/lib/i18n';
import type { Auth, EquipmentUsage } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentUsages: EquipmentUsage[];
    isAdmin: boolean;
}

const statusLabels: Record<string, string> = {
    requested: __('Requested'),
    approved: __('Approved'),
    borrowed: __('Borrowed'),
    rejected: __('Rejected'),
    returned: __('Returned'),
    cancelled: __('Cancelled'),
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

function getStatusBadgeVariant(
    status: string,
): 'default' | 'destructive' | 'secondary' | 'outline' {
    switch (status) {
        case 'approved':
        case 'borrowed':
            return 'default';
        case 'rejected':
            return 'destructive';
        case 'returned':
            return 'secondary';
        default:
            return 'outline';
    }
}

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export default function EquipmentUsageIndex({
    equipmentUsages = [],
    isAdmin,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const [deletingUsage, setDeletingUsage] = useState<EquipmentUsage | null>(
        null,
    );
    const [rejectingUsage, setRejectingUsage] = useState<EquipmentUsage | null>(
        null,
    );
    const [rejectionNotes, setRejectionNotes] = useState('');

    const mayBorrow = can(auth, 'equipment.borrow');

    const filteredUsages = equipmentUsages.filter((u) =>
        `${u.equipment?.equipment_number} ${u.borrower?.name} ${u.purpose}`
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
    );

    const handleApprove = (id: string) => {
        router.post(approve.url(id), {}, { preserveScroll: true });
    };

    const handleReject = () => {
        if (!rejectingUsage) {
            return;
        }

        router.post(
            reject.url(rejectingUsage.id),
            { notes: rejectionNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectingUsage(null);
                    setRejectionNotes('');
                },
            },
        );
    };

    const handleDelete = () => {
        if (!deletingUsage) {
            return;
        }

        router.delete(destroy.url(deletingUsage.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingUsage(null),
        });
    };

    const handleReturn = (id: string) => {
        router.post(returnAction.url(id), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={__('Equipment Loan Requests')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title={__('Equipment Loan Requests')}
                        description={__(
                            'Request and monitor equipment borrowing',
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
                        {mayBorrow && (
                            <Button asChild>
                                <Link href={create.url()}>
                                    <Plus /> {__('Request Loan')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="grid min-w-[900px] grid-cols-[160px_160px_160px_160px_1fr_100px_120px] gap-4 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
                        <span>{__('Borrower')}</span>
                        <span>{__('Equipment')}</span>
                        <span>{__('Planned Start')}</span>
                        <span>{__('Planned Return')}</span>
                        <span>{__('Purpose')}</span>
                        <span>{__('Status')}</span>
                        <span className="text-right">{__('Actions')}</span>
                    </div>

                    {filteredUsages.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                            {__('No loan requests found.')}
                        </div>
                    ) : (
                        <div className="min-w-[900px] divide-y">
                            {filteredUsages.map((u) => (
                                <div
                                    key={u.id}
                                    className="grid grid-cols-[160px_160px_160px_160px_1fr_100px_120px] items-center gap-4 px-4 py-3"
                                >
                                    <span className="truncate font-medium">
                                        {u.borrower?.name}
                                    </span>
                                    <div className="truncate text-sm">
                                        <div className="font-medium">
                                            {u.equipment?.equipment_number}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {
                                                u.equipment?.equipment_model
                                                    ?.model_name
                                            }
                                        </div>
                                    </div>
                                    <span className="text-sm">
                                        {dateFormatter.format(
                                            new Date(u.planned_start_date),
                                        )}
                                    </span>
                                    <span className="text-sm">
                                        {dateFormatter.format(
                                            new Date(u.planned_return_date),
                                        )}
                                    </span>
                                    <span className="truncate text-sm text-muted-foreground">
                                        {u.purpose}
                                    </span>
                                    <div>
                                        <Badge
                                            variant={getStatusBadgeVariant(
                                                u.status,
                                            )}
                                            className="capitalize"
                                        >
                                            {statusLabels[u.status] ?? u.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            title={__('View Detail')}
                                        >
                                            <Link href={show.url(u.id)}>
                                                <Eye />
                                            </Link>
                                        </Button>

                                        {isAdmin &&
                                            u.status === 'requested' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Approve')}
                                                        onClick={() =>
                                                            handleApprove(u.id)
                                                        }
                                                        className="text-green-600 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/50"
                                                    >
                                                        <CheckCircle2 />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__('Reject')}
                                                        onClick={() =>
                                                            setRejectingUsage(u)
                                                        }
                                                        className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50"
                                                    >
                                                        <XCircle />
                                                    </Button>
                                                </>
                                            )}

                                        {(u.status === 'approved' ||
                                            u.status === 'borrowed') &&
                                            (u.borrower_id === auth.user.id ||
                                                isAdmin) && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title={__(
                                                        'Return Equipment',
                                                    )}
                                                    onClick={() =>
                                                        handleReturn(u.id)
                                                    }
                                                    className="text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/50"
                                                >
                                                    <Undo2 />
                                                </Button>
                                            )}

                                        {u.status === 'requested' &&
                                            (u.borrower_id === auth.user.id ||
                                                isAdmin) && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    title={__('Cancel Request')}
                                                    onClick={() =>
                                                        setDeletingUsage(u)
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

            {/* Delete Dialog */}
            <Dialog
                open={deletingUsage !== null}
                onOpenChange={(open) => !open && setDeletingUsage(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Cancel Loan Request')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Are you sure you want to cancel this equipment loan request? This action cannot be undone.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingUsage(null)}
                        >
                            {__('Keep Request')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            {__('Cancel Request')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={rejectingUsage !== null}
                onOpenChange={(open) => !open && setRejectingUsage(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Reject Loan Request')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Please provide a reason for rejecting this request.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rejection-reason">
                                {__('Rejection Reason')}
                            </Label>
                            <Input
                                id="rejection-reason"
                                value={rejectionNotes}
                                onChange={(e) =>
                                    setRejectionNotes(e.target.value)
                                }
                                placeholder={__(
                                    'e.g., Equipment already booked for that period...',
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRejectingUsage(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectionNotes}
                        >
                            {__('Reject Request')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentUsageIndex.layout = {
    breadcrumbs: [
        { title: __('Assets & Facilities'), href: '#' },
        { title: __('Equipment Loans'), href: usageIndex.url() },
    ],
};
