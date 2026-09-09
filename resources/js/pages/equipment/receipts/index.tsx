import { Head, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as receiptIndex,
    create,
    show,
    edit,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentReceiptController';
import Heading from '@/components/heading';
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
import type { Auth, EquipmentReceipt } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentReceipts: EquipmentReceipt[];
}

export default function EquipmentReceiptIndex({ equipmentReceipts = [] }: PageProps) {
    const [deletingReceipt, setDeletingReceipt] = useState<EquipmentReceipt | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = () => {
        if (!deletingReceipt) {
return;
}

        router.delete(destroy.url(deletingReceipt.id), {
            onSuccess: () => setDeletingReceipt(null),
        });
    };

    const filteredReceipts = equipmentReceipts.filter((r) =>
        `${r.receipt_number} ${r.equipment_procurement?.procurement_number} ${r.supplier_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Equipment Receipts" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Equipment Receipts"
                        description="Track arrival of items from procurement requests."
                    />
                    <Button onClick={() => router.get(create.url())}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Receipt
                    </Button>
                </div>

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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Receipt #</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Procurement</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Supplier</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Items</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((r) => (
                                <tr key={r.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{r.receipt_number}</td>
                                    <td className="p-4 align-middle text-muted-foreground">{r.equipment_procurement?.procurement_number || '-'}</td>
                                    <td className="p-4 align-middle">{new Date(r.receipt_date).toLocaleDateString()}</td>
                                    <td className="p-4 align-middle">{r.supplier_name || '-'}</td>
                                    <td className="p-4 align-middle">{r.equipment_receipt_items_count} items</td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => router.get(show.url(r.id))}>
                                                <Eye className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => router.get(edit.url(r.id))}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingReceipt(r)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredReceipts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No receipts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Dialog */}
            <Dialog open={!!deletingReceipt} onOpenChange={() => setDeletingReceipt(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Receipt</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete receipt "{deletingReceipt?.receipt_number}"? This will not delete the procurement.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingReceipt(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentReceiptIndex.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Receipts', href: receiptIndex() },
    ],
};
