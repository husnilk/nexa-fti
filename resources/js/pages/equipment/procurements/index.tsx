import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
    XCircle,
    ClipboardCheck,
} from 'lucide-react';
import { useState } from 'react';
import {
    index as procurementIndex,
    create,
    show,
    edit,
    destroy,
    cancel,
} from '@/actions/App/Http/Controllers/EquipmentProcurementController';
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
import { __, intlLocale } from '@/lib/i18n';
import { index as equipmentReceiptsIndex } from '@/routes/equipment-receipts';
import type { Auth, EquipmentProcurement } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentProcurements: EquipmentProcurement[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-500',
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-orange-500',
};

const statusLabels: Record<string, string> = {
    draft: __('Draft'),
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    completed: __('Completed'),
    cancelled: __('Cancelled'),
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function EquipmentProcurementIndex({
    equipmentProcurements = [],
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingProcurement, setDeletingProcurement] =
        useState<EquipmentProcurement | null>(null);
    const [cancellingProcurement, setCancellingProcurement] =
        useState<EquipmentProcurement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const mayManage = can(auth, 'equipment.manage');

    const handleDelete = () => {
        if (!deletingProcurement) {
            return;
        }

        router.delete(destroy.url(deletingProcurement.id), {
            onSuccess: () => setDeletingProcurement(null),
        });
    };

    const handleCancel = () => {
        if (!cancellingProcurement) {
            return;
        }

        router.post(
            cancel.url(cancellingProcurement.id),
            {},
            {
                onSuccess: () => setCancellingProcurement(null),
            },
        );
    };

    const filteredProcurements = equipmentProcurements.filter((p) =>
        `${p.procurement_number} ${p.title}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title={__('Equipment Procurements')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={__('Equipment Procurements')}
                        description={__(
                            'Manage procurement requests for equipment assets.',
                        )}
                    />
                    <div className="flex items-center gap-2">
                        {mayManage && (
                            <Link href={equipmentReceiptsIndex()}>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer gap-2"
                                >
                                    <ClipboardCheck className="h-4 w-4" />{' '}
                                    {__('Receipts')}
                                </Button>
                            </Link>
                        )}
                        <Button onClick={() => router.get(create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {__('New Request')}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={__('Search requests...')}
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Number')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Title')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Date')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Items')}
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {__('Status')}
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProcurements.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {p.procurement_number}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {p.title}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {new Date(
                                            p.request_date,
                                        ).toLocaleDateString(intlLocale())}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {__(':count items', {
                                            count:
                                                p.equipment_procurement_items_count ??
                                                0,
                                        })}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge
                                            className={`${statusColors[p.status]} border-none text-white capitalize`}
                                        >
                                            {statusLabels[p.status] ?? p.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    router.get(show.url(p.id))
                                                }
                                            >
                                                <Eye className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            {['draft', 'pending'].includes(
                                                p.status,
                                            ) && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            router.get(
                                                                edit.url(p.id),
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setCancellingProcurement(
                                                                p,
                                                            )
                                                        }
                                                    >
                                                        <XCircle className="h-4 w-4 text-orange-500" />
                                                    </Button>
                                                    ...
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeletingProcurement(
                                                                p,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProcurements.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        {__('No procurement requests found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingProcurement}
                onOpenChange={() => setDeletingProcurement(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Delete Procurement Request')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Are you sure you want to delete request ":number"? This action cannot be undone.',
                                {
                                    number:
                                        deletingProcurement?.procurement_number ??
                                        '',
                                },
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingProcurement(null)}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Dialog */}
            <Dialog
                open={!!cancellingProcurement}
                onOpenChange={() => setCancellingProcurement(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {__('Cancel Procurement Request')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Are you sure you want to cancel request ":number"?',
                                {
                                    number:
                                        cancellingProcurement?.procurement_number ??
                                        '',
                                },
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancellingProcurement(null)}
                        >
                            {__('No, Keep it')}
                        </Button>
                        <Button
                            variant="default"
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={handleCancel}
                        >
                            {__('Yes, Cancel Request')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentProcurementIndex.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Procurements'), href: procurementIndex() },
    ],
};
