import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    index as overtimeIndex,
    destroy,
} from '@/actions/App/Http/Controllers/Hr/OvertimeRequestController';
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
import type { Auth, OvertimeRequest, OvertimeStatus } from '@/types';

interface PageProps {
    auth: Auth;
    overtimeRequests: {
        data: OvertimeRequest[];
        links: any[];
    };
}

const statusColors: Record<OvertimeStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function OvertimeRequestIndex({ overtimeRequests }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingRequest, setDeletingRequest] = useState<OvertimeRequest | null>(
        null,
    );

    const mayCreate = can(auth, 'overtime.manage');
    const mayDelete = can(auth, 'overtime.manage');

    const handleDelete = () => {
        if (!deletingRequest) {
return;
}

        router.delete(destroy.url(deletingRequest.id), {
            onSuccess: () => setDeletingRequest(null),
        });
    };

    const filteredRequests = overtimeRequests.data.filter(
        (req) =>
            req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.request_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            req.requester?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Head title="Overtime Requests" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Overtime Requests"
                        description="Manage employee overtime requests and approvals."
                    />
                    {mayCreate && (
                        <Button asChild>
                            <Link href="/overtime-requests/create">
                                <Plus className="mr-2 h-4 w-4" />
                                New Request
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search requests..."
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
                                    Request #
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Title
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Requester
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Date
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Members
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
                            {filteredRequests.map((req) => (
                                <tr
                                    key={req.id}
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    <td className="p-4 align-middle font-medium">
                                        {req.request_number}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {req.title}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {req.requester?.name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {req.request_date}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {req.members_count}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge
                                            variant="outline"
                                            className={statusColors[req.status]}
                                        >
                                            {req.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right align-middle">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`/overtime-requests/${req.id}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {mayDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeletingRequest(req)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No overtime requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingRequest}
                onOpenChange={() => setDeletingRequest(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Overtime Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "
                            {deletingRequest?.title}"? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingRequest(null)}
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

OvertimeRequestIndex.layout = {
    breadcrumbs: [
        {
            title: 'Overtime Requests',
            href: overtimeIndex(),
        },
    ],
};
