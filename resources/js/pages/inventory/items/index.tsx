import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    FolderGit2,
    Image as ImageIcon,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import {
    index as itemIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/Inventory/ItemController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index as categoryIndex } from '@/routes/inventory-categories';
import type { Auth, Item, ItemCategory } from '@/types';

interface PageProps extends Record<string, unknown> {
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

    // Variants input state
    const [createVariantInput, setCreateVariantInput] = useState('');
    const [editVariantInput, setEditVariantInput] = useState('');

    // Image preview state
    const [createPreviewUrl, setCreatePreviewUrl] = useState<string | null>(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

    const mayManage = can(auth, 'inventory.manage');

    const createForm = useForm<{
        item_category_id: string;
        name: string;
        code: string;
        unit: string;
        minimal_quantity: number;
        description: string;
        picture: File | null;
        variants: string[];
    }>({
        item_category_id: '',
        name: '',
        code: '',
        unit: '',
        minimal_quantity: 0,
        description: '',
        picture: null,
        variants: [],
    });

    const editForm = useForm<{
        _method: string;
        item_category_id: string;
        name: string;
        code: string;
        unit: string;
        minimal_quantity: number;
        description: string;
        picture: File | null;
        remove_picture: boolean;
        variants: string[];
    }>({
        _method: 'PUT',
        item_category_id: '',
        name: '',
        code: '',
        unit: '',
        minimal_quantity: 0,
        description: '',
        picture: null,
        remove_picture: false,
        variants: [],
    });

    const handleCreateVariantAdd = () => {
        const trimmed = createVariantInput.trim();

        if (trimmed && !createForm.data.variants.includes(trimmed)) {
            createForm.setData('variants', [...createForm.data.variants, trimmed]);
            setCreateVariantInput('');
        }
    };

    const handleCreateVariantRemove = (indexToRemove: number) => {
        createForm.setData(
            'variants',
            createForm.data.variants.filter((_, idx) => idx !== indexToRemove),
        );
    };

    const handleEditVariantAdd = () => {
        const trimmed = editVariantInput.trim();

        if (trimmed && !editForm.data.variants.includes(trimmed)) {
            editForm.setData('variants', [...editForm.data.variants, trimmed]);
            setEditVariantInput('');
        }
    };

    const handleEditVariantRemove = (indexToRemove: number) => {
        editForm.setData(
            'variants',
            editForm.data.variants.filter((_, idx) => idx !== indexToRemove),
        );
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store.url(), {
            forceFormData: true,
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
                setCreatePreviewUrl(null);
                setCreateVariantInput('');
            },
        });
    };

    const openEdit = (item: Item) => {
        setEditingItem(item);
        setEditPreviewUrl(null);
        setEditVariantInput('');
        editForm.setData({
            _method: 'PUT',
            item_category_id: item.item_category_id ? item.item_category_id.toString() : '',
            name: item.name,
            code: item.code,
            unit: item.unit,
            minimal_quantity: item.minimal_quantity,
            description: item.description || '',
            picture: null,
            remove_picture: false,
            variants: item.variants ? item.variants.map((v) => v.name) : [],
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingItem) {
            return;
        }

        editForm.post(update.url(editingItem.id), {
            forceFormData: true,
            onSuccess: () => {
                setEditingItem(null);
                editForm.reset();
                setEditPreviewUrl(null);
                setEditVariantInput('');
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

    const closeCreate = () => {
        setIsCreating(false);
        createForm.reset();
        createForm.clearErrors();
        setCreatePreviewUrl(null);
        setCreateVariantInput('');
    };

    const closeEdit = () => {
        setEditingItem(null);
        editForm.reset();
        editForm.clearErrors();
        setEditPreviewUrl(null);
        setEditVariantInput('');
    };

    const filteredItems = items.filter((item) => {
        const term = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(term);
        const matchesCode = item.code.toLowerCase().includes(term);
        const matchesCategory = item.item_category?.name?.toLowerCase().includes(term);
        const matchesVariant = item.variants?.some((v) =>
            v.name.toLowerCase().includes(term),
        );

        return matchesName || matchesCode || matchesCategory || matchesVariant;
    });

    return (
        <>
            <Head title="Inventory Items" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Inventory Items"
                        description="Manage items, pictures, variants, and stock levels."
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
                            placeholder="Search by code, name, category, or variant..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 w-16 px-4 text-center align-middle font-medium text-muted-foreground">
                                    Picture
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Code
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Variants
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Category
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Unit
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Min. Qty
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => {
                                const pictureSrc =
                                    item.picture_url ||
                                    (item.picture ? `/storage/${item.picture}` : null);

                                return (
                                    <tr
                                        key={item.id}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <td className="p-3 text-center align-middle">
                                            {pictureSrc ? (
                                                <img
                                                    src={pictureSrc}
                                                    alt={item.name}
                                                    className="h-11 w-11 rounded-md object-cover border mx-auto shadow-xs"
                                                />
                                            ) : (
                                                <div className="flex h-11 w-11 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground mx-auto">
                                                    <Package className="h-5 w-5 opacity-50" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle font-mono text-xs font-semibold">
                                            {item.code}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="font-medium text-foreground">
                                                {item.name}
                                            </div>
                                            {item.description && (
                                                <div className="text-xs text-muted-foreground truncate max-w-xs">
                                                    {item.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {item.variants && item.variants.length > 0 ? (
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {item.variants.map((v) => (
                                                        <Badge
                                                            key={v.id || v.name}
                                                            variant="secondary"
                                                            className="text-[11px] font-normal"
                                                        >
                                                            {v.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {item.item_category?.name || '—'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {item.unit}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {item.minimal_quantity}
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
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
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
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription>
                            Enter details for the new inventory item, upload a picture, and add variants if applicable.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            {/* Picture Upload */}
                            <div className="grid gap-2">
                                <Label htmlFor="picture">Item Picture</Label>
                                <div className="flex items-center gap-4">
                                    {createPreviewUrl ? (
                                        <div className="relative group shrink-0">
                                            <img
                                                src={createPreviewUrl}
                                                alt="Preview"
                                                className="h-16 w-16 rounded-md object-cover border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    createForm.setData('picture', null);
                                                    setCreatePreviewUrl(null);
                                                }}
                                                className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive text-destructive-foreground p-0.5 shadow-xs hover:bg-destructive/90"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-dashed text-muted-foreground bg-muted/30">
                                            <ImageIcon className="h-6 w-6 opacity-60" />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            id="picture"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/gif"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                createForm.setData('picture', file);

                                                if (file) {
                                                    setCreatePreviewUrl(URL.createObjectURL(file));
                                                } else {
                                                    setCreatePreviewUrl(null);
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Optional. PNG, JPG, or WEBP up to 2MB.
                                        </p>
                                        <InputError message={createForm.errors.picture} />
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={createForm.data.item_category_id}
                                    onValueChange={(val) =>
                                        createForm.setData('item_category_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={cat.id.toString()}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={createForm.errors.item_category_id} />
                            </div>

                            {/* Code and Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g. ITM-001"
                                        value={createForm.data.code}
                                        onChange={(e) =>
                                            createForm.setData('code', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={createForm.errors.code} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Item name"
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData('name', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={createForm.errors.name} />
                                </div>
                            </div>

                            {/* Unit and Min Quantity */}
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
                                    <InputError message={createForm.errors.unit} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="minimal_quantity">
                                        Min. Quantity
                                    </Label>
                                    <Input
                                        id="minimal_quantity"
                                        type="number"
                                        min="0"
                                        value={createForm.data.minimal_quantity}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'minimal_quantity',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={createForm.errors.minimal_quantity} />
                                </div>
                            </div>

                            {/* Variants Management */}
                            <div className="grid gap-2">
                                <Label>Variants</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="e.g. Black, White, Blue, XL..."
                                        value={createVariantInput}
                                        onChange={(e) => setCreateVariantInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleCreateVariantAdd();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCreateVariantAdd}
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Optional. Some items may not have variants. Type a variant name and press Enter or click Add.
                                </p>
                                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-md border bg-muted/20">
                                    {createForm.data.variants.map((variant, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="gap-1 pl-2.5 pr-1 py-1 text-xs"
                                        >
                                            {variant}
                                            <button
                                                type="button"
                                                onClick={() => handleCreateVariantRemove(idx)}
                                                className="cursor-pointer rounded-full hover:bg-muted p-0.5 text-muted-foreground hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {createForm.data.variants.length === 0 && (
                                        <span className="text-xs text-muted-foreground self-center italic">
                                            No variants added.
                                        </span>
                                    )}
                                </div>
                                <InputError message={createForm.errors.variants} />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Optional notes or description..."
                                    rows={3}
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={createForm.errors.description} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeCreate}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing ? 'Saving...' : 'Save Item'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingItem}
                onOpenChange={(open) => !open && closeEdit()}
            >
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>
                            Update the item details, replace or remove picture, and update variants.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            {/* Picture Upload / Preview in Edit */}
                            <div className="grid gap-2">
                                <Label htmlFor="edit-picture">Item Picture</Label>
                                <div className="flex items-center gap-4">
                                    {editPreviewUrl ? (
                                        <div className="relative group shrink-0">
                                            <img
                                                src={editPreviewUrl}
                                                alt="New preview"
                                                className="h-16 w-16 rounded-md object-cover border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    editForm.setData('picture', null);
                                                    setEditPreviewUrl(null);
                                                }}
                                                className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive text-destructive-foreground p-0.5 shadow-xs hover:bg-destructive/90"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : editingItem && editingItem.picture && !editForm.data.remove_picture ? (
                                        <div className="relative group shrink-0">
                                            <img
                                                src={
                                                    editingItem.picture_url ||
                                                    `/storage/${editingItem.picture}`
                                                }
                                                alt={editingItem.name}
                                                className="h-16 w-16 rounded-md object-cover border"
                                            />
                                            <button
                                                type="button"
                                                title="Remove current picture"
                                                onClick={() => {
                                                    editForm.setData('remove_picture', true);
                                                }}
                                                className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive text-destructive-foreground p-0.5 shadow-xs hover:bg-destructive/90"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-dashed text-muted-foreground bg-muted/30">
                                            <ImageIcon className="h-6 w-6 opacity-60" />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            id="edit-picture"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp,image/gif"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                editForm.setData('picture', file);
                                                editForm.setData('remove_picture', false);

                                                if (file) {
                                                    setEditPreviewUrl(URL.createObjectURL(file));
                                                } else {
                                                    setEditPreviewUrl(null);
                                                }
                                            }}
                                        />
                                        {editForm.data.remove_picture && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                Current picture will be removed upon update.
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Optional. PNG, JPG, or WEBP up to 2MB.
                                        </p>
                                        <InputError message={editForm.errors.picture} />
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
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
                                            <SelectItem
                                                key={cat.id}
                                                value={cat.id.toString()}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={editForm.errors.item_category_id} />
                            </div>

                            {/* Code and Name */}
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
                                    <InputError message={editForm.errors.code} />
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
                                    <InputError message={editForm.errors.name} />
                                </div>
                            </div>

                            {/* Unit and Min Quantity */}
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
                                    <InputError message={editForm.errors.unit} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-minimal_quantity">
                                        Min. Quantity
                                    </Label>
                                    <Input
                                        id="edit-minimal_quantity"
                                        type="number"
                                        min="0"
                                        value={editForm.data.minimal_quantity}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'minimal_quantity',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={editForm.errors.minimal_quantity} />
                                </div>
                            </div>

                            {/* Variants Management in Edit */}
                            <div className="grid gap-2">
                                <Label>Variants</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="e.g. Black, White, Blue, XL..."
                                        value={editVariantInput}
                                        onChange={(e) => setEditVariantInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleEditVariantAdd();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleEditVariantAdd}
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Add, remove, or modify variants for this item.
                                </p>
                                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-md border bg-muted/20">
                                    {editForm.data.variants.map((variant, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="gap-1 pl-2.5 pr-1 py-1 text-xs"
                                        >
                                            {variant}
                                            <button
                                                type="button"
                                                onClick={() => handleEditVariantRemove(idx)}
                                                className="cursor-pointer rounded-full hover:bg-muted p-0.5 text-muted-foreground hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {editForm.data.variants.length === 0 && (
                                        <span className="text-xs text-muted-foreground self-center italic">
                                            No variants configured.
                                        </span>
                                    )}
                                </div>
                                <InputError message={editForm.errors.variants} />
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    rows={3}
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={editForm.errors.description} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeEdit}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Updating...' : 'Update Item'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingItem}
                onOpenChange={(open) => !open && setDeletingItem(null)}
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
