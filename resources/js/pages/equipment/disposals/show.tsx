import { Head, router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import {
    index as disposalIndex,
    edit,
} from '@/actions/App/Http/Controllers/EquipmentDisposalController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { __, intlLocale } from '@/lib/i18n';
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

const statusLabels: Record<string, string> = {
    draft: __('Draft'),
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    completed: __('Completed'),
};

const methodLabels: Record<string, string> = {
    sold: __('Sold'),
    donated: __('Donated'),
    scrapped: __('Scrapped'),
    lost: __('Lost'),
    mutation: __('Mutation'),
};

export default function EquipmentDisposalShow({
    equipmentDisposal,
}: PageProps) {
    const items = equipmentDisposal.equipment_disposal_items || [];

    const getProposedByName = () => {
        if (
            typeof equipmentDisposal.proposed_by === 'object' &&
            equipmentDisposal.proposed_by !== null
        ) {
            return (equipmentDisposal.proposed_by as any).name || __('Unknown');
        }

        return __('Unknown');
    };

    const getApprovedByName = () => {
        if (
            typeof equipmentDisposal.approved_by === 'object' &&
            equipmentDisposal.approved_by !== null
        ) {
            return (
                (equipmentDisposal.approved_by as any).name ||
                __('Not Approved')
            );
        }

        return __('Not Approved');
    };

    return (
        <>
            <Head
                title={__('Disposal :number', {
                    number: equipmentDisposal.disposal_number,
                })}
            />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={__('Disposal Detail: :number', {
                            number: equipmentDisposal.disposal_number,
                        })}
                        description={__(
                            'View details of this equipment disposal request.',
                        )}
                    />
                    {['draft', 'pending'].includes(
                        equipmentDisposal.status,
                    ) && (
                        <Button
                            onClick={() =>
                                router.get(edit.url(equipmentDisposal.id))
                            }
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            {__('Edit Request')}
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 rounded-lg border bg-card p-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <div>
                            <span className="block text-sm text-muted-foreground">
                                {__('Title')}
                            </span>
                            <span className="text-lg font-semibold">
                                {equipmentDisposal.title}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-sm text-muted-foreground">
                                    {__('Disposal Date')}
                                </span>
                                <span className="font-medium">
                                    {equipmentDisposal.disposal_date
                                        ? new Date(
                                              equipmentDisposal.disposal_date,
                                          ).toLocaleDateString(intlLocale())
                                        : '-'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm text-muted-foreground">
                                    {__('Disposal Method')}
                                </span>
                                <span className="font-medium capitalize">
                                    {methodLabels[
                                        equipmentDisposal.disposal_method
                                    ] || equipmentDisposal.disposal_method}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-sm text-muted-foreground">
                                {__('Status')}
                            </span>
                            <Badge
                                className={`${statusColors[equipmentDisposal.status]} mt-1 border-none text-white capitalize`}
                            >
                                {statusLabels[equipmentDisposal.status] ??
                                    equipmentDisposal.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="block text-sm text-muted-foreground">
                                {__('Proposed By')}
                            </span>
                            <span className="font-medium">
                                {getProposedByName()}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-sm text-muted-foreground">
                                    {__('Approved By')}
                                </span>
                                <span className="font-medium">
                                    {getApprovedByName()}
                                </span>
                            </div>
                            <div>
                                <span className="block text-sm text-muted-foreground">
                                    {__('Approved At')}
                                </span>
                                <span className="font-medium">
                                    {equipmentDisposal.approved_at
                                        ? new Date(
                                              equipmentDisposal.approved_at,
                                          ).toLocaleString(intlLocale())
                                        : __('N/A')}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-sm text-muted-foreground">
                                {__('Reason / Justification')}
                            </span>
                            <p className="mt-1 min-h-[50px] rounded border bg-muted/30 p-2 text-sm whitespace-pre-wrap">
                                {equipmentDisposal.reason ||
                                    __('No reason provided.')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                        {__('Items List (:count)', { count: items.length })}
                    </h3>
                    <div className="rounded-md border bg-card">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        {__('Equipment Number')}
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        {__('Model & Brand')}
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        {__('Serial Number')}
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        {__('Book Value')}
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        {__('Disposal Value')}
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        {__('Notes')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <td className="p-4 align-middle font-medium">
                                            {item.equipment?.equipment_number ||
                                                __('N/A')}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {item.equipment?.equipment_model
                                                ?.brand || ''}{' '}
                                            {item.equipment?.equipment_model
                                                ?.model_name || __('Unknown')}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {item.equipment?.serial_number ||
                                                __('N/A')}
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            {item.book_value
                                                ? `$${parseFloat(item.book_value).toFixed(2)}`
                                                : '-'}
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            {item.disposal_value
                                                ? `$${parseFloat(item.disposal_value).toFixed(2)}`
                                                : '-'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {item.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => router.get(disposalIndex())}
                    >
                        {__('Back to List')}
                    </Button>
                </div>
            </div>
        </>
    );
}

EquipmentDisposalShow.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Disposals'), href: disposalIndex() },
        { title: __('Detail'), href: '#' },
    ],
};
