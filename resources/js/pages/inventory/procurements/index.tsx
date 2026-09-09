import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import {
    index as procurementIndex,
} from '@/actions/App/Http/Controllers/Inventory/InventoryProcurementController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { index as receiptIndex } from '@/routes/inventory-receipts';
import type { Auth, InventoryProcurement, ProcurementStatus } from '@/types';

interface PageProps {
    auth: Auth;
    procurements: {
        data: InventoryProcurement[];
        links: any[];
    };
}

const statusColors: Record<ProcurementStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    submitted:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function ProcurementIndex({ procurements }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');

    const mayManage = can(auth, 'inventory.manage');

    const filteredProcurements = procurements.data.filter(
        (proc) =>
            proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proc.request_number.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Procurements" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Procurements"
                        description="Manage item procurement requests and approvals."
                    />
                    <div className="flex items-center gap-2">
                        {mayManage && (
                            <Link href={receiptIndex()}>
                                <Button variant="outline" className="cursor-pointer gap-2">
                                    <ClipboardCheck className="h-4 w-4" /> Receipts
                                </Button>
                            </Link>
                        )}
                        <Button asChild>
                            <Link href="/inventory/procurements/create">
                                <Plus className="mr-2 h-4 w-4" />
                                New Procurement
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search procurements..."
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
                                    Title
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Submitter
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="h-12 px-4 text-left text-right align-middle font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProcurements.map((proc) => (
                                <tr
                                    key={proc.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {proc.request_number}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {proc.title}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {proc.created_by?.name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge
                                            variant="outline"
                                            className={statusColors[proc.status]}
                                        >
                                            {proc.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/inventory/procurements/${proc.id}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProcurements.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No procurements found.
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

ProcurementIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Procurements',
            href: procurementIndex(),
        },
    ],
};
