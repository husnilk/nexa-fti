import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Wrench,
    History,
    AlertCircle,
    Package,
    User,
    XCircle,
} from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { __, intlLocale } from '@/lib/i18n';
import type { Auth, EquipmentMaintenanceRequest } from '@/types';

type PageProps = {
    auth: Auth;
    maintenanceRequest: EquipmentMaintenanceRequest;
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'full',
    timeStyle: 'short',
});

const statusLabels: Record<string, string> = {
    open: __('Open'),
    in_progress: __('In Progress'),
    resolved: __('Resolved'),
    closed: __('Closed'),
    rejected: __('Rejected'),
    completed: __('Completed'),
    on_hold: __('On Hold'),
};

const priorityLabels: Record<string, string> = {
    low: __('Low'),
    medium: __('Medium'),
    high: __('High'),
    critical: __('Critical'),
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function EquipmentMaintenanceShow({
    maintenanceRequest,
}: PageProps) {
    const { auth } = usePage<PageProps>().props;

    const isOwner = maintenanceRequest.reported_by_id === auth.user.id;
    const hasEquipmentPermission =
        can(auth, 'equipment.manage') || can(auth, 'maintenance.manage');

    const activityForm = useForm({
        description: '',
        status: 'in_progress',
        cost: '',
    });

    function handleRespond(status: 'in_progress' | 'rejected') {
        router.post(
            respondRequest.url(maintenanceRequest.id),
            { status },
            { preserveScroll: true },
        );
    }

    function submitActivity(e: FormEvent) {
        e.preventDefault();
        activityForm.post(addActivityRequest.url(maintenanceRequest.id), {
            preserveScroll: true,
            onSuccess: () => activityForm.reset(),
        });
    }

    function handleVerify() {
        router.post(
            verifyRequest.url(maintenanceRequest.id),
            {},
            { preserveScroll: true },
        );
    }

    function getStatusBadgeVariant(status: string) {
        switch (status) {
            case 'in_progress':
                return 'secondary';
            case 'resolved':
                return 'outline';
            case 'closed':
                return 'default';
            case 'rejected':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    return (
        <>
            <Head title={__('Maintenance Request Detail')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={requestIndex()}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <Heading
                            title={__('Maintenance Request')}
                            description={__(
                                'Detailed view of the maintenance report and progress',
                            )}
                        />
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <AlertCircle className="size-5 text-primary" />
                                    {__('Issue Description')}
                                </CardTitle>
                                <Badge
                                    variant={getStatusBadgeVariant(
                                        maintenanceRequest.status,
                                    )}
                                    className="capitalize"
                                >
                                    {statusLabels[maintenanceRequest.status] ??
                                        maintenanceRequest.status.replace(
                                            '_',
                                            ' ',
                                        )}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                    {maintenanceRequest.problem_description}
                                </p>

                                {maintenanceRequest.photo && (
                                    <div className="mt-6 space-y-2">
                                        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            {__('Attachment')}
                                        </Label>
                                        <div className="max-w-md overflow-hidden rounded-lg border bg-muted/20">
                                            <img
                                                src={`/storage/${maintenanceRequest.photo}`}
                                                alt={__('Maintenance issue')}
                                                className="w-full object-contain"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        {__('Reported: :date', {
                                            date: dateFormatter.format(
                                                new Date(
                                                    maintenanceRequest.created_at,
                                                ),
                                            ),
                                        })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Badge
                                            variant="outline"
                                            className="h-5 px-1.5 py-0 text-[10px] capitalize"
                                        >
                                            {__('Priority: :priority', {
                                                priority:
                                                    priorityLabels[
                                                        maintenanceRequest
                                                            .priority
                                                    ] ??
                                                    maintenanceRequest.priority,
                                            })}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Response */}
                        {hasEquipmentPermission &&
                            maintenanceRequest.status === 'open' && (
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-semibold">
                                            {__('Admin Response')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex gap-4">
                                        <Button
                                            onClick={() =>
                                                handleRespond('in_progress')
                                            }
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="mr-2 size-4" />{' '}
                                            {__('Start Maintenance')}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleRespond('rejected')
                                            }
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <XCircle className="mr-2 size-4" />{' '}
                                            {__('Reject Request')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Add Activity */}
                        {hasEquipmentPermission &&
                            maintenanceRequest.status === 'in_progress' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                            <Wrench className="size-4" />{' '}
                                            {__('Add Maintenance Activity')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form
                                            onSubmit={submitActivity}
                                            className="grid gap-4"
                                        >
                                            <div className="grid gap-2">
                                                <Label htmlFor="description">
                                                    {__(
                                                        'Work Performed / Update',
                                                    )}
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={
                                                        activityForm.data
                                                            .description
                                                    }
                                                    onChange={(e) =>
                                                        activityForm.setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={__(
                                                        'Describe what has been done...',
                                                    )}
                                                    rows={3}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="cost">
                                                        {__('Cost (if any)')}
                                                    </Label>
                                                    <Input
                                                        id="cost"
                                                        type="number"
                                                        step="0.01"
                                                        value={
                                                            activityForm.data
                                                                .cost
                                                        }
                                                        onChange={(e) =>
                                                            activityForm.setData(
                                                                'cost',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="activity_status">
                                                        {__('New Status:')}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            activityForm.data
                                                                .status
                                                        }
                                                        onValueChange={(v) =>
                                                            activityForm.setData(
                                                                'status',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger id="activity_status">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="in_progress">
                                                                {__(
                                                                    'Still In Progress',
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="resolved">
                                                                {__(
                                                                    'Resolved / Fixed',
                                                                )}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        activityForm.processing
                                                    }
                                                >
                                                    {__('Update Progress')}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Verify */}
                        {isOwner &&
                            maintenanceRequest.status === 'resolved' && (
                                <Card className="border-green-600/20 bg-green-600/5">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-semibold">
                                            {__('Verify Maintenance')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-4 text-sm">
                                            {__(
                                                'The maintenance team has marked this issue as resolved. Please verify if the issue is fixed.',
                                            )}
                                        </p>
                                        <Button
                                            onClick={handleVerify}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="mr-2 size-4" />{' '}
                                            {__('Verify & Close Request')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Progress History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <History className="size-4" />{' '}
                                    {__('Progress History')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!maintenanceRequest.equipment_maintenance_activities ||
                                maintenanceRequest
                                    .equipment_maintenance_activities.length ===
                                    0 ? (
                                    <p className="py-4 text-center text-sm text-muted-foreground italic">
                                        {__('No activity logs yet.')}
                                    </p>
                                ) : (
                                    <div className="relative space-y-6 before:absolute before:top-2 before:left-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-muted">
                                        {maintenanceRequest.equipment_maintenance_activities.map(
                                            (activity) => (
                                                <div
                                                    key={activity.id}
                                                    className="relative pl-8"
                                                >
                                                    <div className="absolute top-1.5 left-0 size-4 rounded-full border-2 border-primary bg-background shadow-sm" />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold">
                                                                {activity.performed_by ||
                                                                    __('Staff')}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {dateFormatter.format(
                                                                    new Date(
                                                                        activity.activity_date,
                                                                    ),
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-foreground">
                                                            {
                                                                activity.description
                                                            }
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="w-fit text-[10px] uppercase"
                                                            >
                                                                {statusLabels[
                                                                    activity
                                                                        .status
                                                                ] ??
                                                                    activity.status}
                                                            </Badge>
                                                            {activity.cost >
                                                                0 && (
                                                                <span className="font-mono text-[10px] text-muted-foreground">
                                                                    {__(
                                                                        'Cost: $:amount',
                                                                        {
                                                                            amount: parseFloat(
                                                                                activity.cost as any,
                                                                            ).toLocaleString(
                                                                                intlLocale(),
                                                                            ),
                                                                        },
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Package className="size-4 text-primary" />
                                    {__('Equipment Details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Number')}
                                    </span>
                                    <span className="font-medium">
                                        {
                                            maintenanceRequest.equipment
                                                ?.equipment_number
                                        }
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Serial')}
                                    </span>
                                    <span className="font-mono text-xs">
                                        {maintenanceRequest.equipment
                                            ?.serial_number || '-'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Condition')}
                                    </span>
                                    <span className="capitalize">
                                        {maintenanceRequest.equipment
                                            ?.condition || __('Unknown')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <User className="size-4 text-primary" />
                                    {__('Requester')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Name')}
                                    </span>
                                    <span className="font-medium">
                                        {maintenanceRequest.reported_by_employee
                                            ?.name || __('Unknown')}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Email')}
                                    </span>
                                    <span className="max-w-[150px] truncate">
                                        {maintenanceRequest.reported_by_employee
                                            ?.email || '-'}
                                    </span>
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
        { title: __('Equipment'), href: '#' },
        { title: __('Equipment Maintenance'), href: requestIndex() },
        { title: __('Request Detail'), href: '#' },
    ],
};
