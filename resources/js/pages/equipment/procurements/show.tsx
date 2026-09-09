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

export default function EquipmentProcurementShow({ equipmentProcurement: p }: PageProps) {
    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this request?')) {
return;
}

        router.delete(destroy.url(p.id));
    };

    const handleCancel = () => {
        if (!confirm('Are you sure you want to cancel this request?')) {
return;
}

        router.post(cancel.url(p.id));
    };

    return (
        <>
            <Head title={`Procurement Details - ${p.procurement_number}`} />

            <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Procurement Request: ${p.procurement_number}`}
                        description="View details and items for this procurement request."
                    />
                    <div className="flex gap-2">
                        {p.status === 'approved' && (
                            <Button size="sm" onClick={() => router.get(route('equipment-receipts.create', { equipment_procurement_id: p.id }))}>
                                <Plus className="mr-2 h-4 w-4" />
                                Record Receipt
                            </Button>
                        )}
                        {['draft', 'pending'].includes(p.status) && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => router.get(route('equipment-procurements.edit', p.id))}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-orange-500 hover:text-orange-600" onClick={handleCancel}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>{p.title}</CardTitle>
                            <CardDescription>Requested on {new Date(p.request_date).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Description / Justification</h4>
                                <p className="mt-1 text-sm whitespace-pre-wrap">{p.description || 'No description provided.'}</p>
                            </div>

                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="p-3 text-left">Item / Model</th>
                                            <th className="p-3 text-center">Qty</th>
                                            <th className="p-3 text-right">Est. Unit Price</th>
                                            <th className="p-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {p.equipment_procurement_items?.map((item) => (
                                            <tr key={item.id} className="border-b last:border-0">
                                                <td className="p-3">
                                                    <div className="font-medium">{item.equipment_model?.model_name || item.name}</div>
                                                    <div className="text-xs text-muted-foreground">{item.equipment_model?.manufacturer} {item.equipment_model?.brand}</div>
                                                    {item.specification && <div className="text-xs mt-1 text-muted-foreground italic">{item.specification}</div>}
                                                </td>
                                                <td className="p-3 text-center">{item.quantity}</td>
                                                <td className="p-3 text-right">{item.estimated_unit_price ? `$${parseFloat(item.estimated_unit_price).toLocaleString()}` : '-'}</td>
                                                <td className="p-3 text-right font-medium">
                                                    {item.estimated_unit_price 
                                                        ? `$${(parseFloat(item.estimated_unit_price) * item.quantity).toLocaleString()}`
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status & Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Current Status</span>
                                    <Badge className={`${statusColors[p.status]} text-white border-none capitalize`}>
                                        {p.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Requested By</span>
                                    <span className="text-sm font-medium">{p.requested_by_employee?.name || 'Unknown'}</span>
                                </div>
                                {p.approved_at && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Approved At</span>
                                        <span className="text-sm font-medium">{new Date(p.approved_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Approval History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {p.equipment_procurement_approvals && p.equipment_procurement_approvals.length > 0 ? (
                                    <div className="space-y-4">
                                        {p.equipment_procurement_approvals.map((approval) => (
                                            <div key={approval.id} className="flex gap-3 border-l-2 pl-4 pb-4 last:pb-0">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold capitalize">{approval.status}</span>
                                                        <span className="text-xs text-muted-foreground">by {approval.approver?.name}</span>
                                                    </div>
                                                    {approval.notes && <p className="text-xs text-muted-foreground">{approval.notes}</p>}
                                                    <div className="text-[10px] text-muted-foreground">{approval.approved_at ? new Date(approval.approved_at).toLocaleString() : 'Pending'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No approval records yet.</p>
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
        { title: 'Equipment', href: '#' },
        { title: 'Procurements', href: route('equipment-procurements.index') },
        { title: 'Details', href: '#' },
    ],
};
