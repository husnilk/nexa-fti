import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Pencil,
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Globe,
    Users,
    Megaphone,
    Trash2,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { __, intlLocale } from '@/lib/i18n';
import { index as registrationIndex } from '@/routes/event-registrations';
import { index, edit, destroy, publish } from '@/routes/events';
import type { Auth } from '@/types';

type Employee = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
};

type Event = {
    id: number;
    title: string;
    slug: string;
    description?: string;
    objectives?: string;
    event_type:
        | 'seminar'
        | 'workshop'
        | 'training'
        | 'conference'
        | 'webinar'
        | 'other';
    delivery_mode: 'offline' | 'online' | 'hybrid';
    start_date: string;
    end_date: string;
    start_time?: string;
    end_time?: string;
    venue?: string;
    online_platform?: string;
    online_link?: string;
    quota?: number;
    registration_deadline?: string;
    cover_image?: string;
    banner_image?: string;
    status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
    created_by: string;
    published_by?: string;
    published_at?: string;
    createdBy?: Employee;
    publishedBy?: Employee;
};

const statusLabels: Record<string, string> = {
    draft: __('Draft'),
    published: __('Published'),
    ongoing: __('Ongoing'),
    completed: __('Completed'),
    cancelled: __('Cancelled'),
};

const eventTypeLabels: Record<string, string> = {
    seminar: __('Seminar'),
    workshop: __('Workshop'),
    training: __('Training'),
    conference: __('Conference'),
    webinar: __('Webinar'),
    other: __('Other'),
};

const deliveryModeLabels: Record<string, string> = {
    offline: __('Offline'),
    online: __('Online'),
    hybrid: __('Hybrid'),
};

type PageProps = {
    auth: Auth;
    event: Event;
};

export default function ShowEvent({ event }: PageProps) {
    const { auth } = usePage<PageProps>().props;

    const hasRole = (name: string) => auth.roles.includes(name);
    const hasPermission = (module: string) =>
        hasRole('super-admin') ||
        auth.permissions.some(
            (p) => p === module || p.startsWith(`${module}.`),
        );

    const canManageEvents = hasPermission('event.manage');

    const handleDelete = () => {
        if (confirm(__('Are you sure you want to delete this event?'))) {
            router.delete(destroy.url(event.id));
        }
    };

    const handlePublish = () => {
        if (
            confirm(
                __(
                    'Are you sure you want to publish this event? This will make it visible to participants.',
                ),
            )
        ) {
            router.post(
                publish.url(event.id),
                {},
                {
                    onSuccess: () => alert(__('Event published successfully!')),
                },
            );
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
            case 'published':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
            case 'ongoing':
                return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800';
            case 'completed':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
            default:
                return 'bg-zinc-100 text-zinc-700';
        }
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head
                title={__('Event Cockpit - :title', { title: event.title })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Link href={index.url()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                {event.title}
                            </h1>
                            <span
                                className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(event.status)}`}
                            >
                                {statusLabels[event.status] ?? event.status}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__('Code / Slug:')}{' '}
                            <span className="font-semibold">{event.slug}</span>
                        </p>
                    </div>
                </div>

                {canManageEvents && (
                    <div className="flex items-center gap-2">
                        {event.status === 'draft' && (
                            <Button
                                onClick={handlePublish}
                                className="cursor-pointer gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <Check className="h-4 w-4" />{' '}
                                {__('Publish Event')}
                            </Button>
                        )}
                        <Link
                            href={registrationIndex.url({ event_id: event.id })}
                        >
                            <Button
                                variant="outline"
                                className="cursor-pointer gap-2"
                            >
                                <Users className="h-4 w-4" />{' '}
                                {__('Manage Participants')}
                            </Button>
                        </Link>
                        <Link href={edit.url(event.id)}>
                            <Button
                                variant="outline"
                                className="cursor-pointer gap-2"
                            >
                                <Pencil className="h-4 w-4" /> {__('Edit')}
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            className="cursor-pointer gap-2"
                        >
                            <Trash2 className="h-4 w-4" /> {__('Delete')}
                        </Button>
                    </div>
                )}
            </div>

            {/* Banner Section */}
            <div className="dark:from-zinc-850 relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-100 to-indigo-100 dark:border-zinc-800 dark:to-zinc-800">
                {event.banner_image ? (
                    <img
                        src={event.banner_image}
                        alt={event.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 p-4 text-center">
                        <Megaphone className="mb-2 h-16 w-16 text-violet-500/60" />
                        <span className="rounded bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                            {eventTypeLabels[event.event_type] ??
                                event.event_type}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left Columns - Details */}
                <div className="space-y-6 md:col-span-2">
                    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <h2 className="border-b pb-2 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                            {__('Event Description')}
                        </h2>
                        <p className="text-zinc-750 leading-relaxed whitespace-pre-wrap dark:text-zinc-300">
                            {event.description ||
                                __('No description provided.')}
                        </p>
                    </div>

                    {event.objectives && (
                        <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="border-b pb-2 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                                {__('Objectives & Outcomes')}
                            </h2>
                            <p className="text-zinc-750 leading-relaxed whitespace-pre-wrap dark:text-zinc-300">
                                {event.objectives}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar info card */}
                <div className="space-y-6">
                    {/* Schedule */}
                    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                            <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />{' '}
                            {__('Schedule Details')}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-zinc-400">
                                    {__('Start Date & Time')}
                                </p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {event.start_date}{' '}
                                    {event.start_time
                                        ? `@ ${event.start_time}`
                                        : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400">
                                    {__('End Date & Time')}
                                </p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {event.end_date}{' '}
                                    {event.end_time
                                        ? `@ ${event.end_time}`
                                        : ''}
                                </p>
                            </div>
                            {event.registration_deadline && (
                                <div className="border-t pt-2 dark:border-zinc-800">
                                    <p className="flex items-center gap-1 text-xs text-zinc-400">
                                        <Clock className="h-3.5 w-3.5 text-rose-500" />{' '}
                                        {__('Registration Deadline')}
                                    </p>
                                    <p className="text-rose-650 font-medium dark:text-rose-400">
                                        {new Date(
                                            event.registration_deadline,
                                        ).toLocaleString(intlLocale())}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Venue & Delivery Mode */}
                    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                            <Globe className="h-4 w-4 text-violet-600 dark:text-violet-400" />{' '}
                            {__('Venue & Platform')}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-zinc-400">
                                    {__('Delivery Mode')}
                                </p>
                                <p className="font-medium text-zinc-800 capitalize dark:text-zinc-200">
                                    {deliveryModeLabels[event.delivery_mode] ??
                                        event.delivery_mode}
                                </p>
                            </div>

                            {event.delivery_mode !== 'online' &&
                                event.venue && (
                                    <div>
                                        <p className="flex items-center gap-1 text-xs text-zinc-400">
                                            <MapPin className="h-3.5 w-3.5" />{' '}
                                            {__('Physical Location')}
                                        </p>
                                        <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                            {event.venue}
                                        </p>
                                    </div>
                                )}

                            {event.delivery_mode !== 'offline' && (
                                <>
                                    {event.online_platform && (
                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                {__('Platform')}
                                            </p>
                                            <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                                {event.online_platform}
                                            </p>
                                        </div>
                                    )}
                                    {event.online_link && (
                                        <div>
                                            <p className="text-xs text-zinc-400">
                                                {__('Meeting Link')}
                                            </p>
                                            <a
                                                href={event.online_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-violet-850 font-medium break-all text-violet-600 underline dark:text-violet-400 dark:hover:text-violet-300"
                                            >
                                                {event.online_link}
                                            </a>
                                        </div>
                                    )}
                                </>
                            )}

                            {event.quota && (
                                <div className="border-t pt-2 dark:border-zinc-800">
                                    <p className="flex items-center gap-1 text-xs text-zinc-400">
                                        <Users className="h-3.5 w-3.5" />{' '}
                                        {__('Capacity Limit')}
                                    </p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {__(':quota participants maximum', {
                                            quota: event.quota,
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organizer */}
                    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
                            <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />{' '}
                            {__('Event Organizer')}
                        </h3>
                        <div className="space-y-3 text-sm">
                            {event.createdBy && (
                                <div>
                                    <p className="text-xs text-zinc-400">
                                        {__('Name')}
                                    </p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {event.createdBy.name}
                                    </p>
                                    {event.createdBy.email && (
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            {event.createdBy.email}
                                        </p>
                                    )}
                                </div>
                            )}
                            {event.publishedBy && (
                                <div className="border-t pt-2 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-400">
                                        {__('Published By')}
                                    </p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                        {event.publishedBy.name}
                                    </p>
                                    {event.published_at && (
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            {__('On :date', {
                                                date: new Date(
                                                    event.published_at,
                                                ).toLocaleString(intlLocale()),
                                            })}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
