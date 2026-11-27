import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    MapPin,
    User,
    XCircle,
    Wrench,
    History,
    AlertCircle,
} from 'lucide-react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    index as maintenanceRequestsIndex,
    respond as respondRequest,
    addLog as addLogRequest,
    verify as verifyRequest,
} from '@/routes/room-maintenance-requests';
import type { Auth } from '@/types';

type MaintenanceLog = {
    id: string;
    log: string;
    logged_at: string;
    status: string;
    logged_by: { user: { name: string } };
};

type MaintenanceRequestFile = {
    id: string;
    file: string;
    description?: string;
};

type MaintenanceRequest = {
    id: string;
    room_id: string;
    reported_by_id: string;
    issue_description: string;
    status: string;
    reported_at: string;
    resolved_at?: string;
    room: { name: string; code: string; capacity: number };
    reported_by: { user: { name: string; email: string } };
    room_maintenance_request_logs: MaintenanceLog[];
    room_maintenance_request_files?: MaintenanceRequestFile[];
};

type PageProps = {
    auth: Auth;
    maintenanceRequest: MaintenanceRequest;
};

const dateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'full',
    timeStyle: 'short',
});

const statusLabels: Record<string, string> = {
    reported: __('Reported'),
    accepted: __('Accepted'),
    in_progress: __('In Progress'),
    resolved: __('Resolved'),
    verified: __('Verified'),
    rejected: __('Rejected'),
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function RoomMaintenanceShow({ maintenanceRequest }: PageProps) {
    const { auth } = usePage<PageProps>().props;

    const isOwner = maintenanceRequest.reported_by_id === auth.user.id;
    const hasRoomPermission =
        can(auth, 'room') ||
        can(auth, 'room.approval') ||
        can(auth, 'maintenance.manage');

    const logForm = useForm({
        log: '',
        status: 'in_progress',
    });

    function handleRespond(status: 'accepted' | 'rejected') {
        router.post(
            respondRequest.url(maintenanceRequest.id),
            { status },
            { preserveScroll: true },
        );
    }

    function submitLog(e: FormEvent) {
        e.preventDefault();
        logForm.post(addLogRequest.url(maintenanceRequest.id), {
            preserveScroll: true,
            onSuccess: () => logForm.reset(),
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
            case 'accepted':
                return 'default';
            case 'in_progress':
                return 'secondary';
            case 'resolved':
                return 'outline';
            case 'verified':
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
                            <Link href={maintenanceRequestsIndex()}>
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
                                    {maintenanceRequest.issue_description}
                                </p>
                                {maintenanceRequest.room_maintenance_request_files &&
                                    maintenanceRequest
                                        .room_maintenance_request_files.length >
                                        0 && (
                                        <div className="mt-6 space-y-2">
                                            <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                {__('Attachment')}
                                            </Label>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {maintenanceRequest.room_maintenance_request_files.map(
                                                    (file) => (
                                                        <div
                                                            key={file.id}
                                                            className="group relative overflow-hidden rounded-lg border bg-muted/20 transition hover:bg-muted/40"
                                                        >
                                                            <a
                                                                href={`/storage/${file.file}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block"
                                                            >
                                                                <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-black/5">
                                                                    <img
                                                                        src={`/storage/${file.file}`}
                                                                        alt={
                                                                            file.description ||
                                                                            __(
                                                                                'Maintenance request file',
                                                                            )
                                                                        }
                                                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                                    />
                                                                </div>
                                                                <div className="p-3">
                                                                    <p className="truncate text-xs font-medium text-foreground">
                                                                        {file.description ||
                                                                            __(
                                                                                'Photo of part',
                                                                            )}
                                                                    </p>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        {__('Reported: :date', {
                                            date: dateFormatter.format(
                                                new Date(
                                                    maintenanceRequest.reported_at,
                                                ),
                                            ),
                                        })}
                                    </div>
                                    {maintenanceRequest.resolved_at && (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="size-3 text-green-600" />
                                            {__('Resolved: :date', {
                                                date: dateFormatter.format(
                                                    new Date(
                                                        maintenanceRequest.resolved_at,
                                                    ),
                                                ),
                                            })}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions based on role and status */}
                        {hasRoomPermission &&
                            maintenanceRequest.status === 'reported' && (
                                <Card className="border-primary/20 bg-primary/5">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-semibold">
                                            {__('Admin Response')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex gap-4">
                                        <Button
                                            onClick={() =>
                                                handleRespond('accepted')
                                            }
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="mr-2 size-4" />{' '}
                                            {__('Accept Request')}
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

                        {hasRoomPermission &&
                            (maintenanceRequest.status === 'accepted' ||
                                maintenanceRequest.status ===
                                    'in_progress') && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                            <Wrench className="size-4" />{' '}
                                            {__('Add Maintenance Log')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form
                                            onSubmit={submitLog}
                                            className="grid gap-4"
                                        >
                                            <div className="grid gap-2">
                                                <Label htmlFor="log">
                                                    {__(
                                                        'Work Performed / Update',
                                                    )}
                                                </Label>
                                                <Textarea
                                                    id="log"
                                                    value={logForm.data.log}
                                                    onChange={(e) =>
                                                        logForm.setData(
                                                            'log',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={__(
                                                        'Describe what has been done...',
                                                    )}
                                                    rows={3}
                                                />
                                                {logForm.errors.log && (
                                                    <p className="text-sm text-destructive">
                                                        {logForm.errors.log}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="log_status">
                                                        {__('New Status:')}
                                                    </Label>
                                                    <Select
                                                        value={
                                                            logForm.data.status
                                                        }
                                                        onValueChange={(v) =>
                                                            logForm.setData(
                                                                'status',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="log_status"
                                                            className="w-[180px]"
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="in_progress">
                                                                {__(
                                                                    'In Progress',
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
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        logForm.processing
                                                    }
                                                >
                                                    {__('Update Progress')}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

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
                                            {__('Verify & Complete')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Log History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <History className="size-4" />{' '}
                                    {__('Progress History')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {maintenanceRequest
                                    .room_maintenance_request_logs.length ===
                                0 ? (
                                    <p className="py-4 text-center text-sm text-muted-foreground italic">
                                        {__('No progress logs yet.')}
                                    </p>
                                ) : (
                                    <div className="relative space-y-6 before:absolute before:top-2 before:left-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-muted">
                                        {maintenanceRequest.room_maintenance_request_logs.map(
                                            (log) => (
                                                <div
                                                    key={log.id}
                                                    className="relative pl-8"
                                                >
                                                    <div className="absolute top-1.5 left-0 size-4 rounded-full border-2 border-primary bg-background shadow-sm" />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold">
                                                                {
                                                                    log
                                                                        .logged_by
                                                                        .user
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {dateFormatter.format(
                                                                    new Date(
                                                                        log.logged_at,
                                                                    ),
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-foreground">
                                                            {log.log}
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className="mt-1 w-fit text-[10px] uppercase"
                                                        >
                                                            {statusLabels[
                                                                log.status
                                                            ] ?? log.status}
                                                        </Badge>
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
                                    <MapPin className="size-4 text-primary" />
                                    {__('Room Details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Name')}
                                    </span>
                                    <span className="font-medium">
                                        {maintenanceRequest.room.name}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Code')}
                                    </span>
                                    <code className="font-mono text-xs">
                                        {maintenanceRequest.room.code}
                                    </code>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Capacity')}
                                    </span>
                                    <span>
                                        {__(':count people', {
                                            count: maintenanceRequest.room
                                                .capacity,
                                        })}
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
                                        {
                                            maintenanceRequest.reported_by.user
                                                .name
                                        }
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {__('Email')}
                                    </span>
                                    <span className="max-w-[150px] truncate">
                                        {
                                            maintenanceRequest.reported_by.user
                                                .email
                                        }
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

RoomMaintenanceShow.layout = {
    breadcrumbs: [
        { title: __('Assets & Facilities'), href: '#' },
        { title: __('Room Maintenance'), href: maintenanceRequestsIndex() },
        { title: __('Request Detail'), href: '#' },
    ],
};
