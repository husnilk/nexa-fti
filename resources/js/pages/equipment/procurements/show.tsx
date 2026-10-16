import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, XCircle } from 'lucide-react';
import {
    destroy,
    cancel,
} from '@/actions/App/Http/Controllers/EquipmentProcurementController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { __, intlLocale } from '@/lib/i18n';
import type { Auth, EquipmentProcurement } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentProcurement: EquipmentProcurement;
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

export default function EquipmentProcurementShow({
    equipmentProcurement: p,
}: PageProps) {
    const handleDelete = () => {
        if (!confirm(__('Are you sure you want to delete this request?'))) {
            return;
        }

        router.delete(destroy.url(p.id));
    };

    const handleCancel = () => {
        if (!confirm(__('Are you sure you want to cancel this request?'))) {
            return;
        }

        router.post(cancel.url(p.id));
    };

    return (
        <>
            <Head
                title={__('Procurement Details - :number', {
                    number: p.procurement_number,
                })}
            />

            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={__('Procurement Request: :number', {
                            number: p.procurement_number,
                        })}
                        description={__(
                            'View details and items for this procurement request.',
                        )}
                    />
                    <div className="flex gap-2">
                        {p.status === 'approved' && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    router.get(
                                        route('equipment-receipts.create', {
                                            equipment_procurement_id: p.id,
                                        }),
                                    )
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {__('Record Receipt')}
                            </Button>
                        )}
                        {['draft', 'pending'].includes(p.status) && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            route(
                                                'equipment-procurements.edit',
                                                p.id,
                                            ),
                                        )
                                    }
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {__('Edit')}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-orange-500 hover:text-orange-600"
                                    onClick={handleCancel}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {__('Delete')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>{p.title}</CardTitle>
                            <CardDescription>
                                {__('Requested on :date', {
                                    date: new Date(
                                        p.request_date,
                                    ).toLocaleDateString(intlLocale()),
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    {__('Description / Justification')}
                                </h4>
                                <p className="mt-1 text-sm whitespace-pre-wrap">
                                    {p.description ||
                                        __('No description provided.')}
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-md border">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="p-3 text-left">
                                                {__('Item / Model')}
                                            </th>
                                            <th className="p-3 text-center">
                                                {__('Qty')}
                                            </th>
                                            <th className="p-3 text-right">
                                                {__('Est. Unit Price')}
                                            </th>
                                            <th className="p-3 text-right">
                                                {__('Total')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {p.equipment_procurement_items?.map(
                                            (item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="p-3">
                                                        <div className="font-medium">
                                                            {item
                                                                .equipment_model
                                                                ?.model_name ||
                                                                item.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                item
                                                                    .equipment_model
                                                                    ?.manufacturer
                                                            }{' '}
                                                            {
                                                                item
                                                                    .equipment_model
                                                                    ?.brand
                                                            }
                                                        </div>
                                                        {item.specification && (
                                                            <div className="mt-1 text-xs text-muted-foreground italic">
                                                                {
                                                                    item.specification
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {item.estimated_unit_price
                                                            ? `$${parseFloat(item.estimated_unit_price).toLocaleString(intlLocale())}`
                                                            : '-'}
                                                    </td>
                                                    <td className="p-3 text-right font-medium">
                                                        {item.estimated_unit_price
                                                            ? `$${(parseFloat(item.estimated_unit_price) * item.quantity).toLocaleString(intlLocale())}`
                                                            : '-'}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {__('Status & Info')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {__('Current Status')}
                                    </span>
                                    <Badge
                                        className={`${statusColors[p.status]} border-none text-white capitalize`}
                                    >
                                        {statusLabels[p.status] ?? p.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {__('Requested By')}
                                    </span>
                                    <span className="text-sm font-medium">
                                        {p.requested_by_employee?.name ||
                                            __('Unknown')}
                                    </span>
                                </div>
                                {p.approved_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {__('Approved At')}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {new Date(
                                                p.approved_at,
                                            ).toLocaleDateString(intlLocale())}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {__('Approval History')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {p.equipment_procurement_approvals &&
                                p.equipment_procurement_approvals.length > 0 ? (
                                    <div className="space-y-4">
                                        {p.equipment_procurement_approvals.map(
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
                                                            <span className="text-xs text-muted-foreground">
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
                                                            <p className="text-xs text-muted-foreground">
                                                                {approval.notes}
                                                            </p>
                                                        )}
                                                        <div className="text-[10px] text-muted-foreground">
                                                            {approval.approved_at
                                                                ? new Date(
                                                                      approval.approved_at,
                                                                  ).toLocaleString(
                                                                      intlLocale(),
                                                                  )
                                                                : __('Pending')}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-4 text-center text-sm text-muted-foreground">
                                        {__('No approval records yet.')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

EquipmentProcurementShow.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        {
            title: __('Procurements'),
            href: route('equipment-procurements.index'),
        },
        { title: __('Details'), href: '#' },
    ],
};
