import { Head, Link, usePage, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { index as leaveTypeIndex, create as leaveTypeCreate, destroy as leaveTypeDestroy } from '@/actions/App/Http/Controllers/Hr/LeaveTypeController';
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
import type { Auth, LeaveType } from '@/types';

interface PageProps {
    auth: Auth;
    leaveTypes: LeaveType[];
}

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

export default function LeaveTypeIndex({ leaveTypes }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingType, setDeletingType] = useState<LeaveType | null>(null);

    const mayCreate = can(auth, 'leave.manage');
    const mayUpdate = can(auth, 'leave.manage');
    const mayDelete = can(auth, 'leave.manage');

    const filteredTypes = leaveTypes.filter(type => 
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = () => {
        if (!deletingType) {
return;
}

        router.delete(leaveTypeDestroy.url(deletingType.id), {
            onSuccess: () => setDeletingType(null),
        });
    };

    return (
        <>
            <Head title="Leave Types" />
            
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Leave Types" description="Manage different types of leave and their default quotas." />
                    {mayCreate && (
                        <Button asChild>
                            <Link href={leaveTypeCreate().url}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Leave Type
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search leave types..."
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
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Default Quota</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Attachment</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTypes.map((type) => (
                                <tr key={type.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{type.code}</td>
                                    <td className="p-4 align-middle">{type.name}</td>
                                    <td className="p-4 align-middle">{type.default_quota} days</td>
                                    <td className="p-4 align-middle">
                                        <Badge variant="secondary">
                                            {type.requires_attachment ? 'Required' : 'Not Required'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            {mayUpdate && (
                                                <Button variant="ghost" size="icon" asChild title="Edit">
                                                    <Link href={`/leave-types/${type.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {mayDelete && (
                                                <Button variant="ghost" size="icon" onClick={() => setDeletingType(type)} title="Delete">
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTypes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No leave types found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingType} onOpenChange={() => setDeletingType(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Leave Type</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingType?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingType(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

LeaveTypeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Leave Types',
            href: leaveTypeIndex(),
        },
    ],
};
