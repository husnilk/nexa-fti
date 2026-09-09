import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as equipmentIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentController';
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
import type { Auth, Equipment, EquipmentModel } from '@/types';

interface PageProps {
    auth: Auth;
    equipment: Equipment[];
    equipmentModels: EquipmentModel[];
}

export default function EquipmentIndex({ equipment = [], equipmentModels = [] }: PageProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
    const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const createForm = useForm({
        equipment_model_id: '',
        equipment_number: '',
        serial_number: '',
        acquisition_date: '',
        acquisition_cost: '',
        condition: 'new',
        status: 'available',
        notes: '',
    });

    const editForm = useForm({
        equipment_model_id: '',
        equipment_number: '',
        serial_number: '',
        acquisition_date: '',
        acquisition_cost: '',
        condition: '',
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

        if (!editingEquipment) {
return;
}

        editForm.patch(update.url(editingEquipment.id), {
            onSuccess: () => {
                setEditingEquipment(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingEquipment) {
return;
}

        router.delete(destroy.url(deletingEquipment.id), {
            onSuccess: () => setDeletingEquipment(null),
        });
    };

    const openEdit = (item: Equipment) => {
        setEditingEquipment(item);
        editForm.setData({
            equipment_model_id: item.equipment_model_id.toString(),
            equipment_number: item.equipment_number,
            serial_number: item.serial_number || '',
            acquisition_date: item.acquisition_date,
            acquisition_cost: item.acquisition_cost,
            condition: item.condition,
            status: item.status,
            notes: item.notes || '',
        });
    };

    const filteredEquipment = equipment.filter((item) =>
        `${item.equipment_number} ${item.equipment_model?.model_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Equipment" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Equipment"
                        description="Manage individual equipment units."
                    />
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Equipment
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search equipment..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Model</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Serial Number</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Condition</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipment.map((item) => (
                                <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{item.equipment_number}</td>
                                    <td className="p-4 align-middle">{item.equipment_model?.model_name || '-'}</td>
                                    <td className="p-4 align-middle">{item.serial_number || '-'}</td>
                                    <td className="p-4 align-middle capitalize">{item.condition}</td>
                                    <td className="p-4 align-middle capitalize">{item.status}</td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingEquipment(item)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEquipment.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No equipment found.</td>
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
                        <DialogTitle>Add New Equipment</DialogTitle>
                        <DialogDescription>Enter details for the new equipment unit.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="model">Model</Label>
                                <Select
                                    onValueChange={(value) => createForm.setData('equipment_model_id', value)}
                                    value={createForm.data.equipment_model_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {equipmentModels.map((model) => (
                                            <SelectItem key={model.id} value={model.id.toString()}>
                                                {model.manufacturer} {model.brand} - {model.model_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="equipment_number">Equipment Number</Label>
                                    <Input
                                        id="equipment_number"
                                        value={createForm.data.equipment_number}
                                        onChange={(e) => createForm.setData('equipment_number', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="serial_number">Serial Number</Label>
                                    <Input
                                        id="serial_number"
                                        value={createForm.data.serial_number}
                                        onChange={(e) => createForm.setData('serial_number', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="acquisition_date">Acquisition Date</Label>
                                    <Input
                                        id="acquisition_date"
                                        type="date"
                                        value={createForm.data.acquisition_date}
                                        onChange={(e) => createForm.setData('acquisition_date', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="acquisition_cost">Acquisition Cost</Label>
                                    <Input
                                        id="acquisition_cost"
                                        type="number"
                                        step="0.01"
                                        value={createForm.data.acquisition_cost}
                                        onChange={(e) => createForm.setData('acquisition_cost', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="condition">Condition</Label>
                                    <Select
                                        onValueChange={(value) => createForm.setData('condition', value)}
                                        value={createForm.data.condition}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="fair">Fair</SelectItem>
                                            <SelectItem value="poor">Poor</SelectItem>
                                            <SelectItem value="broken">Broken</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="in_use">In Use</SelectItem>
                                            <SelectItem value="maintenance">In Maintenance</SelectItem>
                                            <SelectItem value="disposed">Disposed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={createForm.data.notes}
                                    onChange={(e) => createForm.setData('notes', e.target.value)}
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
            <Dialog open={!!editingEquipment} onOpenChange={() => setEditingEquipment(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Equipment</DialogTitle>
                        <DialogDescription>Update the equipment details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-model">Model</Label>
                                <Select
                                    onValueChange={(value) => editForm.setData('equipment_model_id', value)}
                                    value={editForm.data.equipment_model_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {equipmentModels.map((model) => (
                                            <SelectItem key={model.id} value={model.id.toString()}>
                                                {model.manufacturer} {model.brand} - {model.model_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-equipment_number">Equipment Number</Label>
                                    <Input
                                        id="edit-equipment_number"
                                        value={editForm.data.equipment_number}
                                        onChange={(e) => editForm.setData('equipment_number', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-serial_number">Serial Number</Label>
                                    <Input
                                        id="edit-serial_number"
                                        value={editForm.data.serial_number}
                                        onChange={(e) => editForm.setData('serial_number', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-condition">Condition</Label>
                                    <Select
                                        onValueChange={(value) => editForm.setData('condition', value)}
                                        value={editForm.data.condition}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="good">Good</SelectItem>
                                            <SelectItem value="fair">Fair</SelectItem>
                                            <SelectItem value="poor">Poor</SelectItem>
                                            <SelectItem value="broken">Broken</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="in_use">In Use</SelectItem>
                                            <SelectItem value="maintenance">In Maintenance</SelectItem>
                                            <SelectItem value="disposed">Disposed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-notes">Notes</Label>
                                <Textarea
                                    id="edit-notes"
                                    value={editForm.data.notes}
                                    onChange={(e) => editForm.setData('notes', e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingEquipment(null)}>Cancel</Button>
                            <Button type="submit" disabled={editForm.processing}>Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deletingEquipment} onOpenChange={() => setDeletingEquipment(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Equipment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingEquipment?.equipment_number}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingEquipment(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentIndex.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'List', href: equipmentIndex() },
    ],
};
