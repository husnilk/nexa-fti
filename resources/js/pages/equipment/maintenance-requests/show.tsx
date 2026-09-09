import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Wrench, History, AlertCircle, Package, User, XCircle } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    index as requestIndex,
    respond as respondRequest,
    addActivity as addActivityRequest,
    verify as verifyRequest,
} from '@/actions/App/Http/Controllers/EquipmentMaintenanceRequestController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, EquipmentMaintenanceRequest } from '@/types';

type PageProps = {
    auth: Auth;
    maintenanceRequest: EquipmentMaintenanceRequest;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'short',
});

function can(auth: Auth, ability: string): boolean {
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

export default function EquipmentMaintenanceShow({ maintenanceRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    
    const isOwner = maintenanceRequest.reported_by_id === auth.user.id;
    const hasEquipmentPermission = can(auth, 'equipment.manage') || can(auth, 'maintenance.manage');

    const activityForm = useForm({
        description: '',
        status: 'in_progress',
        cost: '',
    });

    function handleRespond(status: 'in_progress' | 'rejected') {
        router.post(respondRequest.url(maintenanceRequest.id), { status }, { preserveScroll: true });
    }

    function submitActivity(e: FormEvent) {
        e.preventDefault();
        activityForm.post(addActivityRequest.url(maintenanceRequest.id), {
            preserveScroll: true,
            onSuccess: () => activityForm.reset(),
        });
    }

    function handleVerify() {
        router.post(verifyRequest.url(maintenanceRequest.id), {}, { preserveScroll: true });
    }

    function getStatusBadgeVariant(status: string) {
        switch (status) {
            case 'in_progress': return 'secondary';
            case 'resolved': return 'outline';
            case 'closed': return 'default';
            case 'rejected': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <>
            <Head title="Maintenance Request Detail" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={requestIndex()}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <Heading
                            title="Maintenance Request"
                            description="Detailed view of the maintenance report and progress"
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <AlertCircle className="size-5 text-primary" />
                                    Issue Description
                                </CardTitle>
                                <Badge variant={getStatusBadgeVariant(maintenanceRequest.status)} className="capitalize">
                                    {maintenanceRequest.status.replace('_', ' ')}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{maintenanceRequest.problem_description}</p>
                                
                                {maintenanceRequest.photo && (
                                    <div className="mt-6 space-y-2">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attachment</Label>
                                        <div className="max-w-md overflow-hidden rounded-lg border bg-muted/20">
                                            <img 
                                                src={`/storage/${maintenanceRequest.photo}`} 
                                                alt="Maintenance issue" 
                                                className="w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        Reported: {dateFormatter.format(new Date(maintenanceRequest.created_at))}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="h-5 px-1.5 py-0 text-[10px] capitalize">
                                            Priority: {maintenanceRequest.priority}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Response */}
                        {hasEquipmentPermission && maintenanceRequest.status === 'open' && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold">Admin Response</CardTitle>
                                </CardHeader>
                                <CardContent className="flex gap-4">
                                    <Button onClick={() => handleRespond('in_progress')} className="flex-1 bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="mr-2 size-4" /> Start Maintenance
                                    </Button>
                                    <Button onClick={() => handleRespond('rejected')} variant="destructive" className="flex-1">
                                        <XCircle className="mr-2 size-4" /> Reject Request
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Add Activity */}
                        {hasEquipmentPermission && maintenanceRequest.status === 'in_progress' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <Wrench className="size-4" /> Add Maintenance Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submitActivity} className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Work Performed / Update</Label>
                                            <Textarea
                                                id="description"
                                                value={activityForm.data.description}
                                                onChange={(e) => activityForm.setData('description', e.target.value)}
                                                placeholder="Describe what has been done..."
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="cost">Cost (if any)</Label>
                                                <Input
                                                    id="cost"
                                                    type="number"
                                                    step="0.01"
                                                    value={activityForm.data.cost}
                                                    onChange={(e) => activityForm.setData('cost', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="activity_status">New Status:</Label>
                                                <Select value={activityForm.data.status} onValueChange={(v) => activityForm.setData('status', v)}>
                                                    <SelectTrigger id="activity_status">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="in_progress">Still In Progress</SelectItem>
                                                        <SelectItem value="resolved">Resolved / Fixed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={activityForm.processing}>
                                                Update Progress
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Verify */}
                        {isOwner && maintenanceRequest.status === 'resolved' && (
                            <Card className="border-green-600/20 bg-green-600/5">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold">Verify Maintenance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-4">The maintenance team has marked this issue as resolved. Please verify if the issue is fixed.</p>
                                    <Button onClick={handleVerify} className="w-full bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="mr-2 size-4" /> Verify & Close Request
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Progress History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <History className="size-4" /> Progress History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!maintenanceRequest.equipment_maintenance_activities || maintenanceRequest.equipment_maintenance_activities.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No activity logs yet.</p>
                                ) : (
                                    <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-muted">
                                        {maintenanceRequest.equipment_maintenance_activities.map((activity) => (
                                            <div key={activity.id} className="relative pl-8">
                                                <div className="absolute left-0 top-1.5 size-4 rounded-full border-2 border-primary bg-background shadow-sm" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold">{activity.performed_by || 'Staff'}</span>
                                                        <span className="text-xs text-muted-foreground">{dateFormatter.format(new Date(activity.activity_date))}</span>
                                                    </div>
                                                    <p className="text-sm text-foreground">{activity.description}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="w-fit text-[10px] uppercase">
                                                            {activity.status}
                                                        </Badge>
                                                        {activity.cost > 0 && (
                                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                                Cost: ${parseFloat(activity.cost as any).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-md">
                                    <Package className="size-4 text-primary" />
                                    Equipment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Number</span>
                                    <span className="font-medium">{maintenanceRequest.equipment?.equipment_number}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Serial</span>
                                    <span className="font-mono text-xs">{maintenanceRequest.equipment?.serial_number || '-'}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Condition</span>
                                    <span className="capitalize">{maintenanceRequest.equipment?.condition || 'Unknown'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-md">
                                    <User className="size-4 text-primary" />
                                    Requester
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name</span>
                                    <span className="font-medium">{maintenanceRequest.reported_by_employee?.name || 'Unknown'}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="truncate max-w-[150px]">{maintenanceRequest.reported_by_employee?.email || '-'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

EquipmentMaintenanceShow.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Equipment Maintenance', href: requestIndex() },
        { title: 'Request Detail', href: '#' },
    ],
};
