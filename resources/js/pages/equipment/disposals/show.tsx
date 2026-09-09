import { Head, router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import {
    index as disposalIndex,
    edit,
} from '@/actions/App/Http/Controllers/EquipmentDisposalController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Auth, EquipmentDisposal, EquipmentDisposalItem } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentDisposal: EquipmentDisposal & {
        proposed_by?: { name: string };
        approved_by?: { name: string };
        equipment_disposal_items?: (EquipmentDisposalItem & {
            equipment?: {
                equipment_number: string;
                serial_number: string;
                equipment_model?: {
                    brand: string;
                    model_name: string;
                };
            };
        })[];
    };
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-500',
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    completed: 'bg-blue-500',
};

const methodLabels: Record<string, string> = {
    sold: 'Sold',
    donated: 'Donated',
    scrapped: 'Scrapped',
    lost: 'Lost',
    mutation: 'Mutation',
};

export default function EquipmentDisposalShow({ equipmentDisposal }: PageProps) {
    const items = equipmentDisposal.equipment_disposal_items || [];

    const getProposedByName = () => {
        if (typeof equipmentDisposal.proposed_by === 'object' && equipmentDisposal.proposed_by !== null) {
            return (equipmentDisposal.proposed_by as any).name || 'Unknown';
        }

        return 'Unknown';
    };

    const getApprovedByName = () => {
        if (typeof equipmentDisposal.approved_by === 'object' && equipmentDisposal.approved_by !== null) {
            return (equipmentDisposal.approved_by as any).name || 'Not Approved';
        }

        return 'Not Approved';
    };

    return (
        <>
            <Head title={`Disposal ${equipmentDisposal.disposal_number}`} />

            <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Disposal Detail: ${equipmentDisposal.disposal_number}`}
                        description="View details of this equipment disposal request."
                    />
                    {['draft', 'pending'].includes(equipmentDisposal.status) && (
                        <Button onClick={() => router.get(edit.url(equipmentDisposal.id))}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Request
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 p-6 border rounded-lg bg-card md:grid-cols-2">
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-muted-foreground block">Title</span>
                            <span className="font-semibold text-lg">{equipmentDisposal.title}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-muted-foreground block">Disposal Date</span>
                                <span className="font-medium">{equipmentDisposal.disposal_date ? new Date(equipmentDisposal.disposal_date).toLocaleDateString() : '-'}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground block">Disposal Method</span>
                                <span className="font-medium capitalize">{methodLabels[equipmentDisposal.disposal_method] || equipmentDisposal.disposal_method}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground block">Status</span>
                            <Badge className={`${statusColors[equipmentDisposal.status]} text-white border-none capitalize mt-1`}>
                                {equipmentDisposal.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="text-sm text-muted-foreground block">Proposed By</span>
                            <span className="font-medium">{getProposedByName()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-muted-foreground block">Approved By</span>
                                <span className="font-medium">{getApprovedByName()}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground block">Approved At</span>
                                <span className="font-medium">
                                    {equipmentDisposal.approved_at ? new Date(equipmentDisposal.approved_at).toLocaleString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground block">Reason / Justification</span>
                            <p className="text-sm bg-muted/30 p-2 rounded border mt-1 min-h-[50px] whitespace-pre-wrap">
                                {equipmentDisposal.reason || 'No reason provided.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Items List ({items.length})</h3>
                    <div className="rounded-md border bg-card">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Equipment Number</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Model & Brand</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Serial Number</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Book Value</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Disposal Value</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{item.equipment?.equipment_number || 'N/A'}</td>
                                        <td className="p-4 align-middle">
                                            {item.equipment?.equipment_model?.brand || ''} {item.equipment?.equipment_model?.model_name || 'Unknown'}
                                        </td>
                                        <td className="p-4 align-middle">{item.equipment?.serial_number || 'N/A'}</td>
                                        <td className="p-4 align-middle text-right">
                                            {item.book_value ? `$${parseFloat(item.book_value).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            {item.disposal_value ? `$${parseFloat(item.disposal_value).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="p-4 align-middle">{item.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => router.get(disposalIndex())}>
                        Back to List
                    </Button>
                </div>
            </div>
        </>
    );
}

EquipmentDisposalShow.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Disposals', href: disposalIndex() },
        { title: 'Detail', href: '#' },
    ],
};
