import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, FolderGit2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as modelIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/EquipmentModelController';
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
import { index as equipmentCategoryIndex } from '@/routes/equipment-categories';
import type { Auth, EquipmentCategory, EquipmentModel } from '@/types';

interface PageProps {
    auth: Auth;
    equipmentModels: EquipmentModel[];
    categories: EquipmentCategory[];
}

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function EquipmentModelIndex({ equipmentModels = [], categories = [] }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState(false);
    const [editingModel, setEditingModel] = useState<EquipmentModel | null>(null);
    const [deletingModel, setDeletingModel] = useState<EquipmentModel | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const mayManage = can(auth, 'equipment.manage');

    const createForm = useForm({
        equipment_category_id: '',
        manufacturer: '',
        brand: '',
        model_name: '',
        specification: '',
        default_useful_life: '',
    });

    const editForm = useForm({
        equipment_category_id: '',
        manufacturer: '',
        brand: '',
        model_name: '',
        specification: '',
        default_useful_life: '',
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

        if (!editingModel) {
return;
}

        editForm.patch(update.url(editingModel.id), {
            onSuccess: () => {
                setEditingModel(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingModel) {
return;
}

        router.delete(destroy.url(deletingModel.id), {
            onSuccess: () => setDeletingModel(null),
        });
    };

    const openEdit = (model: EquipmentModel) => {
        setEditingModel(model);
        editForm.setData({
            equipment_category_id: model.equipment_category_id.toString(),
            manufacturer: model.manufacturer,
            brand: model.brand,
            model_name: model.model_name,
            specification: model.specification || '',
            default_useful_life: model.default_useful_life?.toString() || '',
        });
    };

    const filteredModels = equipmentModels.filter((model) =>
        `${model.manufacturer} ${model.brand} ${model.model_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Equipment Models" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Equipment Models"
                        description="Manage models for equipment assets."
                    />
                    <div className="flex items-center gap-2">
                        {mayManage && (
                            <Link href={equipmentCategoryIndex()}>
                                <Button variant="outline" className="cursor-pointer gap-2">
                                    <FolderGit2 className="h-4 w-4" /> Categories
                                </Button>
                            </Link>
                        )}
                        <Button onClick={() => setIsCreating(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Model
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search models..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manufacturer</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Brand</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Model Name</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredModels.map((model) => (
                                <tr key={model.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">{model.equipment_category?.name || '-'}</td>
                                    <td className="p-4 align-middle">{model.manufacturer}</td>
                                    <td className="p-4 align-middle">{model.brand}</td>
                                    <td className="p-4 align-middle font-medium">{model.model_name}</td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(model)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingModel(model)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredModels.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No models found.</td>
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
                        <DialogTitle>Add New Model</DialogTitle>
                        <DialogDescription>Enter details for the new equipment model.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    onValueChange={(value) => createForm.setData('equipment_category_id', value)}
                                    value={createForm.data.equipment_category_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="manufacturer">Manufacturer</Label>
                                    <Input
                                        id="manufacturer"
                                        value={createForm.data.manufacturer}
                                        onChange={(e) => createForm.setData('manufacturer', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={createForm.data.brand}
                                        onChange={(e) => createForm.setData('brand', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="model_name">Model Name</Label>
                                <Input
                                    id="model_name"
                                    value={createForm.data.model_name}
                                    onChange={(e) => createForm.setData('model_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="useful_life">Default Useful Life (years)</Label>
                                <Input
                                    id="useful_life"
                                    type="number"
                                    value={createForm.data.default_useful_life}
                                    onChange={(e) => createForm.setData('default_useful_life', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="specification">Specification</Label>
                                <Textarea
                                    id="specification"
                                    value={createForm.data.specification}
                                    onChange={(e) => createForm.setData('specification', e.target.value)}
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
            <Dialog open={!!editingModel} onOpenChange={() => setEditingModel(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Model</DialogTitle>
                        <DialogDescription>Update the model details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select
                                    onValueChange={(value) => editForm.setData('equipment_category_id', value)}
                                    value={editForm.data.equipment_category_id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                                    <Input
                                        id="edit-manufacturer"
                                        value={editForm.data.manufacturer}
                                        onChange={(e) => editForm.setData('manufacturer', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-brand">Brand</Label>
                                    <Input
                                        id="edit-brand"
                                        value={editForm.data.brand}
                                        onChange={(e) => editForm.setData('brand', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-model_name">Model Name</Label>
                                <Input
                                    id="edit-model_name"
                                    value={editForm.data.model_name}
                                    onChange={(e) => editForm.setData('model_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-useful_life">Default Useful Life (years)</Label>
                                <Input
                                    id="edit-useful_life"
                                    type="number"
                                    value={editForm.data.default_useful_life}
                                    onChange={(e) => editForm.setData('default_useful_life', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-specification">Specification</Label>
                                <Textarea
                                    id="edit-specification"
                                    value={editForm.data.specification}
                                    onChange={(e) => editForm.setData('specification', e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingModel(null)}>Cancel</Button>
                            <Button type="submit" disabled={editForm.processing}>Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deletingModel} onOpenChange={() => setDeletingModel(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Model</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingModel?.model_name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingModel(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

EquipmentModelIndex.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Models', href: modelIndex() },
    ],
};
