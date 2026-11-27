import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react';
import { show as procurementShow } from '@/actions/App/Http/Controllers/EquipmentProcurementController';
import {
    index as receiptIndex,
    edit,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentReceiptController';
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
import type { Auth, EquipmentReceipt } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentReceipt: EquipmentReceipt;
}

export default function EquipmentReceiptShow({
    equipmentReceipt: r,
}: PageProps) {
    const handleDelete = () => {
        if (!confirm(__('Are you sure you want to delete this receipt?'))) {
            return;
        }

        router.delete(destroy.url(r.id));
    };

    return (
        <>
            <Head
                title={__('Receipt Details - :number', {
                    number: r.receipt_number,
                })}
            />

            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={__('Equipment Receipt: :number', {
                            number: r.receipt_number,
                        })}
                        description={__(
                            'View details and items received in this batch.',
                        )}
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get(edit.url(r.id))}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            {__('Edit')}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {__('Delete')}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>{__('Received Items')}</CardTitle>
                            <CardDescription>
                                {__('Items arriving from procurement :number', {
                                    number:
                                        r.equipment_procurement
                                            ?.procurement_number ?? '',
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                            <th className="p-3 text-center">
                                                {__('Status')}
                                            </th>
                                            <th className="p-3 text-right">
                                                {__('Unit Price')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {r.equipment_receipt_items?.map(
                                            (item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="p-3">
                                                        <div className="font-medium">
                                                            {item
                                                                .equipment_procurement_item
                                                                ?.equipment_model
                                                                ?.model_name ||
                                                                item
                                                                    .equipment_procurement_item
                                                                    ?.name}
                                                        </div>
                                                        {item.status ===
                                                            'rejected' &&
                                                            item.rejection_reason && (
                                                                <div className="mt-1 text-xs font-medium text-destructive italic">
                                                                    {__(
                                                                        'Reason: :reason',
                                                                        {
                                                                            reason: item.rejection_reason,
                                                                        },
                                                                    )}
                                                                </div>
                                                            )}
                                                    </td>
                                                    <td className="p-3 text-center font-bold">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <div className="flex justify-center">
                                                            {item.status ===
                                                            'accepted' ? (
                                                                <Badge className="border-none bg-green-600 capitalize">
                                                                    <CheckCircle2 className="mr-1 h-3 w-3" />{' '}
                                                                    {__(
                                                                        'Accepted',
                                                                    )}
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="destructive"
                                                                    className="capitalize"
                                                                >
                                                                    <XCircle className="mr-1 h-3 w-3" />{' '}
                                                                    {__(
                                                                        'Rejected',
                                                                    )}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        {item.unit_price
                                                            ? `$${parseFloat(item.unit_price).toLocaleString(intlLocale())}`
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
                                    {__('Receipt Info')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Arrival Date')}
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            r.receipt_date,
                                        ).toLocaleDateString(intlLocale())}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Supplier')}
                                    </span>
                                    <span className="font-medium">
                                        {r.supplier_name || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Invoice / Delivery #')}
                                    </span>
                                    <span className="font-medium">
                                        {r.invoice_number || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Received By')}
                                    </span>
                                    <span className="font-medium">
                                        {r.received_by_employee?.name ||
                                            __('Unknown')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {__('Linked Procurement')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="font-bold">
                                    {
                                        r.equipment_procurement
                                            ?.procurement_number
                                    }
                                </div>
                                <div className="text-muted-foreground">
                                    {r.equipment_procurement?.title}
                                </div>
                                <Button
                                    variant="link"
                                    className="h-auto p-0"
                                    onClick={() =>
                                        router.get(
                                            procurementShow.url(
                                                r.equipment_procurement_id,
                                            ),
                                        )
                                    }
                                >
                                    {__('View Full Procurement')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

EquipmentReceiptShow.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Receipts'), href: receiptIndex.url() },
        { title: __('Details'), href: '#' },
    ],
};
