import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, Search, Building2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { stock as inventoryStockIndex } from '@/routes/inventory';
import { index as warehouseIndex } from '@/routes/inventory-warehouses';
import type { Auth, Inventory, Item, Warehouse } from '@/types';

interface PageProps {
    auth: Auth;
    inventories: Inventory[];
    items: Item[];
    warehouses: Warehouse[];
}

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function StockIndex({
    inventories,
    warehouses,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('all');

    const mayManage = can(auth, 'inventory.manage');

    const filteredStock = inventories.filter((inv) => {
        const matchesSearch =
            inv.item?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.item?.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesWarehouse =
            warehouseFilter === 'all' || inv.warehouse_id.toString() === warehouseFilter;

        return matchesSearch && matchesWarehouse;
    });

    return (
        <>
            <Head title="Stock Overview" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Stock Overview"
                        description="Real-time inventory levels across all warehouses."
                    />
                    {mayManage && (
                        <Link href={warehouseIndex()}>
                            <Button variant="outline" className="cursor-pointer gap-2">
                                <Building2 className="h-4 w-4" /> Warehouses
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search items..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-64">
                        <Select
                            value={warehouseFilter}
                            onValueChange={setWarehouseFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Warehouses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Warehouses</SelectItem>
                                {warehouses.map((wh) => (
                                    <SelectItem key={wh.id} value={wh.id}>
                                        {wh.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Item Code
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Item Name
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Warehouse
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">
                                    Quantity
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStock.map((inv) => {
                                const isLowStock =
                                    inv.item && inv.quantity <= inv.item.minimal_quantity;

                                return (
                                    <tr
                                        key={inv.id}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <td className="p-4 align-middle font-medium">
                                            {inv.item?.code}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {inv.item?.name}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {inv.warehouse?.name}
                                        </td>
                                        <td className="p-4 align-middle text-right font-semibold">
                                            {inv.quantity} {inv.item?.unit}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {isLowStock ? (
                                                <Badge
                                                    variant="destructive"
                                                    className="flex w-fit items-center gap-1"
                                                >
                                                    <AlertCircle className="h-3 w-3" />
                                                    Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Healthy
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredStock.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No stock records found.
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

StockIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Stock Overview',
            href: inventoryStockIndex().url,
        },
    ],
};
