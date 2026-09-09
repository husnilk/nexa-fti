import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, Search, Trash2, XCircle, Undo2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as distributionIndex,
    create,
    edit,
    destroy,
    accept,
    reject,
    returnMethod as returnAction,
} from '@/actions/App/Http/Controllers/EquipmentDistributionController';
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
import { Label } from '@/components/ui/label';
import type { Auth, EquipmentDistribution } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentDistributions: EquipmentDistribution[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    accepted: 'bg-green-600',
    rejected: 'bg-destructive',
    returned: 'bg-blue-500',
    lost: 'bg-gray-800',
    damaged: 'bg-orange-600',
};

export default function EquipmentDistributionIndex({ equipmentDistributions = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingDist, setDeletingDist] = useState<EquipmentDistribution | null>(null);
    const [rejectingDist, setRejectingDist] = useState<EquipmentDistribution | null>(null);
    const [rejectionNotes, setRejectionNotes] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = () => {
        if (!deletingDist) {
return;
}

        router.delete(destroy.url(deletingDist.id), {
            onSuccess: () => setDeletingDist(null),
        });
    };

    const handleAccept = (id: string) => {
        router.post(accept.url(id));
    };

    const handleReject = () => {
        if (!rejectingDist) {
return;
}

        router.post(reject.url(rejectingDist.id), { notes: rejectionNotes }, {
            onSuccess: () => {
                setRejectingDist(null);
                setRejectionNotes('');
            },
        });
    };

    const handleReturn = (id: string) => {
        if (!confirm('Are you sure you want to return this equipment?')) {
return;
}

        router.post(returnAction.url(id));
    };

    const filteredDistributions = equipmentDistributions.filter((d) =>
        `${d.equipment?.equipment_number} ${d.employee?.name} ${d.room?.name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Equipment Distributions" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Equipment Distributions"
                        description="Manage the assignment of equipment to rooms and employees."
                    />
                    <Button onClick={() => router.get(create.url())}>
                        <Plus className="mr-2 h-4 w-4" />
                        Distribute Equipment
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search distributions..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Equipment #</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assigned To</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDistributions.map((d) => {
                                const employeeId = auth.user.id;
                                const canManage = d.employee_id === employeeId || d.room?.responsible_employee_id === employeeId;

                                return (
                                    <tr key={d.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">
                                            {d.equipment?.equipment_number}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {d.room_id ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold">Room: {d.room?.name}</span>
                                                    <span className="text-xs text-muted-foreground">Responsible: {d.room?.responsible_employee?.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-bold">Employee: {d.employee?.name}</span>
                                                    <span className="text-xs text-muted-foreground">{d.employee?.emp_number}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">{new Date(d.assigned_date).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle">
                                            <Badge className={`${statusColors[d.status]} text-white border-none capitalize`}>
                                                {d.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            <div className="flex justify-end gap-2">
                                                {d.status === 'pending' && canManage && (
                                                    <>
                                                        <Button variant="outline" size="sm" className="h-8 text-green-600 hover:text-green-700" onClick={() => handleAccept(d.id)}>
                                                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Accept
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="h-8 text-destructive" onClick={() => setRejectingDist(d)}>
                                                            <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                                                        </Button>
                                                    </>
                                                )}

                                                {d.status === 'accepted' && canManage && (
                                                    <Button variant="outline" size="sm" className="h-8 text-blue-600 hover:text-blue-700" onClick={() => handleReturn(d.id)}>
                                                        <Undo2 className="mr-1 h-3.5 w-3.5" /> Return
                                                    </Button>
                                                )}

                                                {d.status === 'pending' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" onClick={() => router.get(edit.url(d.id))}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => setDeletingDist(d)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredDistributions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No distributions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Dialog */}
            <Dialog open={!!deletingDist} onOpenChange={() => setDeletingDist(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Distribution</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this distribution record?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingDist(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={!!rejectingDist} onOpenChange={() => setRejectingDist(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Equipment</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this equipment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Rejection Reason</Label>
                            <Input
                                id="reason"
                                value={rejectionNotes}
                                onChange={(e) => setRejectionNotes(e.target.value)}
                                placeholder="e.g., Damaged, not as specified..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectingDist(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={!rejectionNotes}>Reject Equipment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentDistributionIndex.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Distributions', href: distributionIndex.url() },
    ],
};
