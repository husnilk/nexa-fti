import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Package,
    Undo2,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
    approve,
    reject,
} from '@/actions/App/Http/Controllers/EquipmentUsageApprovalController';
import { returnMethod as returnAction } from '@/actions/App/Http/Controllers/EquipmentUsageController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { __, intlLocale } from '@/lib/i18n';
import { index as equipmentUsagesIndex } from '@/routes/equipment-usages';
import type { Auth, EquipmentUsage } from '@/types';

type PageProps = {
    auth: Auth;
    equipmentUsage: EquipmentUsage;
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'full',
    timeStyle: 'short',
});

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

export default function EquipmentUsageShow({ equipmentUsage: u }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = can(auth, 'equipment.manage');
    const isBorrower = u.borrower_id === auth.user.id;

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionNotes, setRejectionNotes] = useState('');

    function handleApprove() {
        router.post(approve.url(u.id), {}, { preserveScroll: true });
    }

    function handleReject() {
        router.post(
            reject.url(u.id),
            { notes: rejectionNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectDialogOpen(false);
                    setRejectionNotes('');
                },
            },
        );
    }

    function handleReturn() {
        router.post(returnAction.url(u.id), {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title={__('Loan Request Detail')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={equipmentUsagesIndex()}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <Heading
                            title={__('Loan Request Detail')}
                            description={__(
                                'View the status and details of this equipment loan request',
                            )}
                        />
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && u.status === 'requested' && (
                            <>
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => setRejectDialogOpen(true)}
                                >
                                    <XCircle className="mr-2 size-4" />{' '}
                                    {__('Reject')}
                                </Button>
                                <Button
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    onClick={handleApprove}
                                >
                                    <CheckCircle2 className="mr-2 size-4" />{' '}
                                    {__('Approve')}
                                </Button>
                            </>
                        )}
                        {(u.status === 'approved' || u.status === 'borrowed') &&
                            (isBorrower || isAdmin) && (
                                <Button
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={handleReturn}
                                >
                                    <Undo2 className="mr-2 size-4" />{' '}
                                    {__('Return Equipment')}
                                </Button>
                            )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="size-5 text-primary" />
                                {__('Request Details')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Status')}
                                </span>
                                <Badge
                                    variant={getStatusBadgeVariant(u.status)}
                                    className="capitalize"
                                >
                                    {statusLabels[u.status] ?? u.status}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Purpose')}
                                </span>
                                <p className="text-sm whitespace-pre-wrap">
                                    {u.purpose}
                                </p>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {__('Planned Period')}
                                </span>
                                <div className="flex items-start gap-2 text-sm">
                                    <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span>
                                            {__('Start: :date', {
                                                date: dateFormatter.format(
                                                    new Date(
                                                        u.planned_start_date,
                                                    ),
                                                ),
                                            })}
                                        </span>
                                        <span>
                                            {__('Return: :date', {
                                                date: dateFormatter.format(
                                                    new Date(
                                                        u.planned_return_date,
                                                    ),
                                                ),
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {u.actual_start_date && (
                                <>
                                    <Separator />
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {__('Actual Period')}
                                        </span>
                                        <div className="flex items-start gap-2 text-sm">
                                            <Clock className="mt-0.5 size-4 shrink-0 text-green-600" />
                                            <div className="flex flex-col">
                                                <span>
                                                    {__('Started: :date', {
                                                        date: dateFormatter.format(
                                                            new Date(
                                                                u.actual_start_date,
                                                            ),
                                                        ),
                                                    })}
                                                </span>
                                                {u.actual_return_date && (
                                                    <span>
                                                        {__('Returned: :date', {
                                                            date: dateFormatter.format(
                                                                new Date(
                                                                    u.actual_return_date,
                                                                ),
                                                            ),
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {u.approved_by && (
                                <>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {__('Action By')}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {u.approved_by?.name}
                                        </span>
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
                                    {__('Borrower Information')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Name')}
                                    </span>
                                    <span className="font-medium">
                                        {u.borrower?.name}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Email')}
                                    </span>
                                    <span className="text-sm">
                                        {u.borrower?.email}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="size-5 text-primary" />
                                    {__('Equipment Information')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Equipment No.')}
                                    </span>
                                    <span className="font-medium">
                                        {u.equipment?.equipment_number}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Model')}
                                    </span>
                                    <span className="text-sm">
                                        {
                                            u.equipment?.equipment_model
                                                ?.model_name
                                        }
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {__('Condition')}
                                    </span>
                                    <span className="text-sm capitalize">
                                        {u.equipment?.condition}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {u.equipment_usage_approvals &&
                            u.equipment_usage_approvals.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            {__('Approval History')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {u.equipment_usage_approvals.map(
                                                (approval) => (
                                                    <div
                                                        key={approval.id}
                                                        className="flex gap-3 border-l-2 pb-4 pl-4 last:pb-0"
                                                    >
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold capitalize">
                                                                    {statusLabels[
                                                                        approval
                                                                            .status
                                                                    ] ??
                                                                        approval.status}
                                                                </span>
                                                                <span className="text-xs text-nowrap text-muted-foreground">
                                                                    {__(
                                                                        'by :name',
                                                                        {
                                                                            name:
                                                                                approval
                                                                                    .approver
                                                                                    ?.name ??
                                                                                '',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {approval.notes && (
                                                                <p className="text-xs text-muted-foreground italic">
                                                                    "
                                                                    {
                                                                        approval.notes
                                                                    }
                                                                    "
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                </div>
            </div>

            <Dialog
                open={rejectDialogOpen}
                onOpenChange={(open) => !open && setRejectDialogOpen(false)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Reject Loan Request')}</DialogTitle>
                        <DialogDescription>
                            {__(
                                'Please provide a reason for rejecting this equipment loan request.',
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reject-notes">
                                {__('Rejection Reason')}
                            </Label>
                            <Input
                                id="reject-notes"
                                value={rejectionNotes}
                                onChange={(e) =>
                                    setRejectionNotes(e.target.value)
                                }
                                placeholder={__(
                                    'e.g., Equipment already reserved for that period...',
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRejectDialogOpen(false)}
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

EquipmentUsageShow.layout = {
    breadcrumbs: [
        { title: __('Assets & Facilities'), href: '#' },
        { title: __('Equipment Loans'), href: equipmentUsagesIndex() },
        { title: __('Request Detail'), href: '#' },
    ],
};
