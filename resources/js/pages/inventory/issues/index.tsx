import { Head, Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import {
    index as issueIndex,
} from '@/actions/App/Http/Controllers/Inventory/InventoryIssueController';
import Heading from '@/components/heading';
import { Input } from '@/components/ui/input';
import type { Auth, InventoryIssue } from '@/types';

interface PageProps {
    auth: Auth;
    issues: {
        data: InventoryIssue[];
        links: any[];
    };
}

export default function IssueIndex({ issues }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIssues = issues.data.filter(
        (iss) =>
            iss.issue_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            iss.issued_by?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Issues" />

            <div className="flex flex-col gap-4 p-4">
                <Heading
                    title="Inventory Issues"
                    description="History of items issued from warehouses."
                />

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search issues..."
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
                                    Warehouse
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Issued By
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map((iss) => (
                                <tr
                                    key={iss.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {iss.issue_number}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {iss.warehouse?.name}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {iss.issued_by?.name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {iss.issue_date}
                                    </td>
                                </tr>
                            ))}
                            {filteredIssues.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No issues found.
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

IssueIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: '#',
        },
        {
            title: 'Issues',
            href: issueIndex(),
        },
    ],
};
