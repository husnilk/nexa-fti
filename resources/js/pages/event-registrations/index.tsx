import { Head, Link, router } from '@inertiajs/react';
import {
    Pencil,
    Trash2,
    Eye,
    UserPlus,
    ArrowLeft,
    Ticket,
    Calendar,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { __, intlLocale } from '@/lib/i18n';
import {
    index,
    create,
    show,
    edit,
    destroy,
} from '@/routes/event-registrations';
import { index as eventIndex } from '@/routes/events';

type User = {
    id: string;
    name: string;
    email: string;
};

type Event = {
    id: number;
    title: string;
};

type Employee = {
    id: string;
    name: string;
};

type EventRegistration = {
    id: number;
    event_id: number;
    user_id: string;
    registration_number: string;
    registered_at: string;
    attendance_status: 'registered' | 'attended' | 'no_show' | 'cancelled';
    notes?: string;
    ticket_number: string;
    qr_code?: string;
    issued_at: string;
    certificate_number: string;
    file_path?: string;
    generated_by?: string;
    generated_at?: string;
    event?: Event;
    user?: User;
    generatedBy?: Employee;
};

const attendanceStatusLabels: Record<string, string> = {
    registered: __('Registered'),
    attended: __('Attended'),
    no_show: __('No Show'),
    cancelled: __('Cancelled'),
};

type PageProps = {
    eventRegistrations: EventRegistration[];
    events: Event[];
    filters: {
        event_id: string | number;
    };
};

export default function EventRegistrationsIndex({
    eventRegistrations = [],
    events = [],
    filters,
}: PageProps) {
    const [selectedEventId, setSelectedEventId] = useState<string | number>(
        filters.event_id || '',
    );

    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedEventId(id);
        router.get(
            index.url(),
            { event_id: id },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        if (
            confirm(
                __(
                    'Are you sure you want to remove this participant registration?',
                ),
            )
        ) {
            router.delete(destroy.url(id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'registered':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
            case 'attended':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
            case 'no_show':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
            default:
                return 'bg-zinc-100 text-zinc-700';
        }
    };

    return (
        <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
            <Head title={__('Event Participants Management')} />

            <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-center md:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Link href={eventIndex.url()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            <Ticket className="h-6 w-6 text-violet-600 dark:text-violet-400" />{' '}
                            {__('Event Participants')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__(
                                'Manage users registration, attendance, tickets, and certificates.',
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedEventId}
                        onChange={handleEventChange}
                        className="flex h-9 max-w-xs rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                    >
                        <option value="">{__('All Events')}</option>
                        {events.map((event) => (
                            <option key={event.id} value={event.id}>
                                {event.title}
                            </option>
                        ))}
                    </select>

                    <Link
                        href={create.url(
                            selectedEventId
                                ? { event_id: selectedEventId }
                                : {},
                        )}
                    >
                        <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700">
                            <UserPlus className="h-4 w-4" />{' '}
                            {__('Register Participant')}
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border dark:border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg">
                        {__('Registered Participants')}
                    </CardTitle>
                    <CardDescription>
                        {__('Registrations found: :count', {
                            count: eventRegistrations.length,
                        })}
                        {selectedEventId &&
                            events.find(
                                (e) => e.id === Number(selectedEventId),
                            ) && (
                                <span>
                                    {' '}
                                    {__('for')}{' '}
                                    <span className="font-semibold">
                                        {
                                            events.find(
                                                (e) =>
                                                    e.id ===
                                                    Number(selectedEventId),
                                            )?.title
                                        }
                                    </span>
                                </span>
                            )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                    {eventRegistrations.length === 0 ? (
                        <div className="space-y-3 py-12 text-center">
                            <Ticket className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                            <h3 className="font-semibold text-zinc-900 dark:text-white">
                                {__('No registrations found')}
                            </h3>
                            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                                {__(
                                    'No participants have been registered yet. Click the button above to register a participant manually.',
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
                                <thead className="dark:bg-zinc-850 border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-700 uppercase dark:border-zinc-800 dark:text-zinc-300">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">
                                            {__('Participant')}
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            {__('Event')}
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            {__('Reg. Number')}
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            {__('Ticket & Cert.')}
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            {__('Status')}
                                        </th>
                                        <th className="px-6 py-4 text-right font-semibold">
                                            {__('Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {eventRegistrations.map((reg) => (
                                        <tr
                                            key={reg.id}
                                            className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-zinc-900 dark:text-white">
                                                    {reg.user?.name ||
                                                        __('Unknown User')}
                                                </div>
                                                <div className="mt-0.5 text-xs text-muted-foreground">
                                                    {reg.user?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-zinc-850 dark:text-zinc-250 max-w-xs truncate font-medium">
                                                    {reg.event?.title ||
                                                        __('Unknown Event')}
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />{' '}
                                                    {__('Registered: :date', {
                                                        date: new Date(
                                                            reg.registered_at,
                                                        ).toLocaleDateString(
                                                            intlLocale(),
                                                        ),
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">
                                                {reg.registration_number}
                                            </td>
                                            <td className="space-y-1 px-6 py-4">
                                                <div className="text-xs">
                                                    {__('Ticket:')}{' '}
                                                    <span className="font-mono">
                                                        {reg.ticket_number}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {__('Cert:')}{' '}
                                                    <span className="font-mono">
                                                        {reg.certificate_number}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize ${getStatusColor(reg.attendance_status)}`}
                                                >
                                                    {attendanceStatusLabels[
                                                        reg.attendance_status
                                                    ] ?? reg.attendance_status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={show.url(reg.id)}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer"
                                                            title={__(
                                                                'View Details',
                                                            )}
                                                        >
                                                            <Eye className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={edit.url(reg.id)}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer"
                                                            title={__(
                                                                'Edit Registration',
                                                            )}
                                                        >
                                                            <Pencil className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() =>
                                                            handleDelete(reg.id)
                                                        }
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:bg-rose-50/50 hover:text-rose-700"
                                                        title={__(
                                                            'Delete Participant',
                                                        )}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
