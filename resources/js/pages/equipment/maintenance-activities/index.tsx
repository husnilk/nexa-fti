import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as activityIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentMaintenanceActivityController';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, EquipmentMaintenanceActivity, EquipmentMaintenanceRequest } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentMaintenanceActivities: EquipmentMaintenanceActivity[];
    maintenanceRequests: EquipmentMaintenanceRequest[];
}

export default function EquipmentMaintenanceActivityIndex({
    equipmentMaintenanceActivities = [],
    maintenanceRequests = [],
}: PageProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingActivity, setEditingActivity] = useState<EquipmentMaintenanceActivity | null>(null);
    const [deletingActivity, setDeletingActivity] = useState<EquipmentMaintenanceActivity | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        equipment_maintenance_request_id: '',
        activity_date: '',
        description: '',
        cost: '',
        performed_by: '',
        status: 'completed',
        notes: '',
    });

    const editForm = useForm({
        equipment_maintenance_request_id: '',
        activity_date: '',
        description: '',
        cost: '',
        performed_by: '',
        status: '',
        notes: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store.url(), {
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingActivity) {
return;
}

        editForm.patch(update.url(editingActivity.id), {
            onSuccess: () => {
                setEditingActivity(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingActivity) {
return;
}

        router.delete(destroy.url(deletingActivity.id), {
            onSuccess: () => setDeletingActivity(null),
        });
    };

    const openEdit = (activity: EquipmentMaintenanceActivity) => {
        setEditingActivity(activity);
        editForm.setData({
            equipment_maintenance_request_id: activity.equipment_maintenance_request_id.toString(),
            activity_date: activity.activity_date.split('T')[0],
            description: activity.description,
            cost: activity.cost || '',
            performed_by: activity.performed_by,
            status: activity.status,
            notes: activity.notes || '',
        });
    };

    const filteredActivities = equipmentMaintenanceActivities.filter((activity) =>
        `${activity.description} ${activity.performed_by}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Maintenance Activities" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Maintenance Activities"
                        description="Track specific activities performed during maintenance."
                    />
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Activity
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search activities..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Equipment</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Performed By</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.map((activity) => (
                                <tr key={activity.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">{new Date(activity.activity_date).toLocaleDateString()}</td>
                                    <td className="p-4 align-middle">
                                        {activity.equipment_maintenance_request?.equipment?.equipment_number || '-'}
                                    </td>
                                    <td className="p-4 align-middle">{activity.description}</td>
                                    <td className="p-4 align-middle">{activity.performed_by}</td>
                                    <td className="p-4 align-middle capitalize">{activity.status}</td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(activity)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingActivity(activity)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredActivities.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No activities found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Maintenance Activity</DialogTitle>
                        <DialogDescription>Enter details for the maintenance activity performed.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="request">Maintenance Request</Label>
                                <Select
                                    onValueChange={(value) => createForm.setData('equipment_maintenance_request_id', value)}
                                    value={createForm.data.equipment_maintenance_request_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select request" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maintenanceRequests.map((req) => (
                                            <SelectItem key={req.id} value={req.id.toString()}>
                                                {req.equipment?.equipment_number} - {req.problem_description.substring(0, 30)}...
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="activity_date">Activity Date</Label>
                                    <Input
                                        id="activity_date"
                                        type="date"
                                        value={createForm.data.activity_date}
                                        onChange={(e) => createForm.setData('activity_date', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="cost">Cost</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        step="0.01"
                                        value={createForm.data.cost}
                                        onChange={(e) => createForm.setData('cost', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="performed_by">Performed By</Label>
                                <Input
                                    id="performed_by"
                                    value={createForm.data.performed_by}
                                    onChange={(e) => createForm.setData('performed_by', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    onValueChange={(value) => createForm.setData('status', value)}
                                    value={createForm.data.status}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                            <Button type="submit" disabled={createForm.processing}>Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Activity</DialogTitle>
                        <DialogDescription>Update the maintenance activity details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-request">Maintenance Request</Label>
                                <Select
                                    onValueChange={(value) => editForm.setData('equipment_maintenance_request_id', value)}
                                    value={editForm.data.equipment_maintenance_request_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select request" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maintenanceRequests.map((req) => (
                                            <SelectItem key={req.id} value={req.id.toString()}>
                                                {req.equipment?.equipment_number} - {req.problem_description.substring(0, 30)}...
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-activity_date">Activity Date</Label>
                                    <Input
                                        id="edit-activity_date"
                                        type="date"
                                        value={editForm.data.activity_date}
                                        onChange={(e) => editForm.setData('activity_date', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-cost">Cost</Label>
                                    <Input
                                        id="edit-cost"
                                        type="number"
                                        step="0.01"
                                        value={editForm.data.cost}
                                        onChange={(e) => editForm.setData('cost', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-performed_by">Performed By</Label>
                                <Input
                                    id="edit-performed_by"
                                    value={editForm.data.performed_by}
                                    onChange={(e) => editForm.setData('performed_by', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    onValueChange={(value) => editForm.setData('status', value)}
                                    value={editForm.data.status}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingActivity(null)}>Cancel</Button>
                            <Button type="submit" disabled={editForm.processing}>Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deletingActivity} onOpenChange={() => setDeletingActivity(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Activity</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this activity? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingActivity(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentMaintenanceActivityIndex.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Maintenance Activities', href: activityIndex() },
    ],
};
