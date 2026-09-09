import { Head, Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import {
    index as receiptIndex,
} from '@/actions/App/Http/Controllers/Inventory/InventoryReceiptController';
import Heading from '@/components/heading';
import { Input } from '@/components/ui/input';
import type { Auth, InventoryReceipt } from '@/types';

interface PageProps {
    auth: Auth;
    receipts: {
        data: InventoryReceipt[];
        links: any[];
    };
}

export default function ReceiptIndex({ receipts }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReceipts = receipts.data.filter(
        (rec) =>
            rec.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.received_by?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Receipts" />

            <div className="flex flex-col gap-4 p-4">
                <Heading
                    title="Inventory Receipts"
                    description="History of items received into warehouses."
                />

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search receipts..."
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
                                    Number
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Warehouse
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Received By
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((rec) => (
                                <tr
                                    key={rec.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {rec.receipt_number}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {rec.warehouse?.name}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {rec.received_by?.name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {rec.receipt_date}
                                    </td>
                                </tr>
                            ))}
                            {filteredReceipts.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No receipts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

ReceiptIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Receipts',
            href: receiptIndex(),
        },
    ],
};
