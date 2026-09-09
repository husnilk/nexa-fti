import { Head, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as disposalIndex,
    create,
    show,
    edit,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentDisposalController';
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
import type { Auth, EquipmentDisposal } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentDisposals: EquipmentDisposal[];
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

export default function EquipmentDisposalIndex({ equipmentDisposals = [] }: PageProps) {
    const [deletingDisposal, setDeletingDisposal] = useState<EquipmentDisposal | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = () => {
        if (!deletingDisposal) {
return;
}

        router.delete(destroy.url(deletingDisposal.id), {
            onSuccess: () => setDeletingDisposal(null),
        });
    };

    const filteredDisposals = equipmentDisposals.filter((d) =>
        `${d.disposal_number} ${d.title}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Equipment Disposals" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Equipment Disposals"
                        description="Manage and track disposal requests for equipment assets."
                    />
                    <Button onClick={() => router.get(create.url())}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search disposals..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Number</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Method</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Items</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDisposals.map((d) => (
                                <tr key={d.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{d.disposal_number}</td>
                                    <td className="p-4 align-middle">{d.title}</td>
                                    <td className="p-4 align-middle">{d.disposal_date ? new Date(d.disposal_date).toLocaleDateString() : '-'}</td>
                                    <td className="p-4 align-middle capitalize">{methodLabels[d.disposal_method] || d.disposal_method}</td>
                                    <td className="p-4 align-middle">{d.equipment_disposal_items_count} items</td>
                                    <td className="p-4 align-middle">
                                        <Badge className={`${statusColors[d.status]} text-white border-none capitalize`}>
                                            {d.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => router.get(show.url(d.id))}>
                                                <Eye className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            {['draft', 'pending'].includes(d.status) && (
                                                <>
                                                    <Button variant="ghost" size="icon" onClick={() => router.get(edit.url(d.id))}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeletingDisposal(d)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDisposals.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">No equipment disposal requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete/Cancel Dialog */}
            <Dialog open={!!deletingDisposal} onOpenChange={() => setDeletingDisposal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel/Delete Disposal Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel and delete request "{deletingDisposal?.disposal_number}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingDisposal(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentDisposalIndex.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Disposals', href: disposalIndex() },
    ],
};
