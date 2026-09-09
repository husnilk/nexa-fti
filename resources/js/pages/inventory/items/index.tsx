import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, FolderGit2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as itemIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/Inventory/ItemController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as categoryIndex } from '@/routes/inventory-categories';
import type { Auth, Item, ItemCategory } from '@/types';

interface PageProps {
    auth: Auth;
    items: Item[];
    categories: ItemCategory[];
}

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function ItemIndex({ items, categories }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [deletingItem, setDeletingItem] = useState<Item | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const mayManage = can(auth, 'inventory.manage');

    const createForm = useForm({
        item_category_id: '',
        name: '',
        code: '',
        unit: '',
        minimal_quantity: 0,
        description: '',
    });

    const editForm = useForm({
        item_category_id: '',
        name: '',
        code: '',
        unit: '',
        minimal_quantity: 0,
        description: '',
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

        if (!editingItem) {
return;
}

        editForm.patch(update.url(editingItem.id), {
            onSuccess: () => {
                setEditingItem(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingItem) {
return;
}

        router.delete(destroy.url(deletingItem.id), {
            onSuccess: () => setDeletingItem(null),
        });
    };

    const openEdit = (item: Item) => {
        setEditingItem(item);
        editForm.setData({
            item_category_id: item.item_category_id.toString(),
            name: item.name,
            code: item.code,
            unit: item.unit,
            minimal_quantity: item.minimal_quantity,
            description: item.description || '',
        });
    };

    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Inventory Items" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Inventory Items"
                        description="Manage items and stock levels."
                    />
                    <div className="flex items-center gap-2">
                        {mayManage && (
                            <Link href={categoryIndex()}>
                                <Button variant="outline" className="cursor-pointer gap-2">
                                    <FolderGit2 className="h-4 w-4" /> Categories
                                </Button>
                            </Link>
                        )}
                        <Button onClick={() => setIsCreating(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search items..."
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
                                    Code
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Category
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Unit
                                </th>
                                <th className="h-12 px-4 text-left text-right align-middle font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {item.code}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {item.name}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {item.item_category?.name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {item.unit}
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(item)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeletingItem(item)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription>
                            Enter details for the new inventory item.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    onValueChange={(val) =>
                                        createForm.setData('item_category_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        value={createForm.data.code}
                                        onChange={(e) =>
                                            createForm.setData('code', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData('name', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        value={createForm.data.unit}
                                        onChange={(e) =>
                                            createForm.setData('unit', e.target.value)
                                        }
                                        required
                                        placeholder="pcs, box, etc."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="minimal_quantity">
                                        Min. Quantity
                                    </Label>
                                    <Input
                                        id="minimal_quantity"
                                        type="number"
                                        value={createForm.data.minimal_quantity}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'minimal_quantity',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingItem}
                onOpenChange={() => setEditingItem(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>
                            Update the item details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select
                                    value={editForm.data.item_category_id}
                                    onValueChange={(val) =>
                                        editForm.setData('item_category_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-code">Code</Label>
                                    <Input
                                        id="edit-code"
                                        value={editForm.data.code}
                                        onChange={(e) =>
                                            editForm.setData('code', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData('name', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-unit">Unit</Label>
                                    <Input
                                        id="edit-unit"
                                        value={editForm.data.unit}
                                        onChange={(e) =>
                                            editForm.setData('unit', e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-minimal_quantity">
                                        Min. Quantity
                                    </Label>
                                    <Input
                                        id="edit-minimal_quantity"
                                        type="number"
                                        value={editForm.data.minimal_quantity}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'minimal_quantity',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Input
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingItem(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingItem}
                onOpenChange={() => setDeletingItem(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingItem?.name}"?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingItem(null)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

ItemIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Items',
            href: itemIndex(),
        },
    ],
};
