import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    Eye,
    Calendar,
    MapPin,
    Globe,
    Users,
    Megaphone,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __ } from '@/lib/i18n';
import { index, create, show, edit, destroy, publish } from '@/routes/events';
import type { Auth } from '@/types';

type Employee = {
    id: string;
    name: string;
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
    all: __('All'),
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

type PageProps = {
    auth: Auth;
    events: Event[];
    filters: {
        search: string;
    };
};

export default function EventsIndex({ events = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState('all');

    const hasRole = (name: string) => auth.roles.includes(name);
    const hasPermission = (module: string) =>
        hasRole('super-admin') ||
        auth.permissions.some(
            (p) => p === module || p.startsWith(`${module}.`),
        );

    const canManageEvents = hasPermission('event.manage');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        router.get(
            index.url(),
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm(__('Are you sure you want to delete this event?'))) {
            router.delete(destroy.url(id));
        }
    };

    const handlePublish = (id: number) => {
        if (
            confirm(
                __(
                    'Are you sure you want to publish this event? This will make it visible to participants.',
                ),
            )
        ) {
            router.post(
                publish.url(id),
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

    const getDeliveryModeBadge = (mode: string) => {
        switch (mode) {
            case 'offline':
                return (
                    <span className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                        <MapPin className="h-3.5 w-3.5" /> {__('Offline')}
                    </span>
                );
            case 'online':
                return (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <Globe className="h-3.5 w-3.5" /> {__('Online')}
                    </span>
                );
            case 'hybrid':
                return (
                    <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        <Globe className="h-3.5 w-3.5" /> {__('Hybrid')}
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesStatus =
            statusFilter === 'all' || event.status === statusFilter;

        return matchesStatus;
    });

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Events Dashboard')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Events')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage departmental academic events, seminars, workshops, and registrations.',
                        )}
                    </p>
                </div>
                {canManageEvents && (
                    <Link href={create.url()}>
                        <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700">
                            <Plus className="h-4 w-4" /> {__('Create Event')}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={handleSearchChange}
                        placeholder={__('Search events...')}
                        className="bg-white pl-9 dark:bg-zinc-900"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-500">
                        {__('Status:')}
                    </span>
                    <div className="flex overflow-hidden rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        {[
                            'all',
                            'draft',
                            'published',
                            'ongoing',
                            'completed',
                            'cancelled',
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`cursor-pointer px-4 py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                                    statusFilter === status
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                                }`}
                            >
                                {statusLabels[status] ?? status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <Megaphone className="mb-4 h-16 w-16 animate-pulse text-zinc-300 dark:text-zinc-700" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {__('No Events Found')}
                    </h3>
                    <p className="mt-1 max-w-md text-center text-sm text-zinc-500">
                        {__(
                            'Try adjusting your search query or status filter, or create a new event.',
                        )}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-300 hover:border-violet-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800"
                        >
                            <div className="relative flex h-44 items-center justify-center overflow-hidden border-b bg-gradient-to-br from-violet-100 to-indigo-100 dark:border-zinc-800 dark:from-zinc-800 dark:to-zinc-900">
                                {event.banner_image ? (
                                    <img
                                        src={event.banner_image}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 p-4 text-center">
                                        <Megaphone className="mb-2 h-12 w-12 text-violet-500/60" />
                                        <span className="rounded bg-violet-500/10 px-2 py-0.5 text-xs font-semibold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                                            {eventTypeLabels[
                                                event.event_type
                                            ] ?? event.event_type}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusColor(event.status)}`}
                                    >
                                        {statusLabels[event.status] ??
                                            event.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 left-3 rounded-md border bg-white/90 px-2.5 py-1 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/90">
                                    {getDeliveryModeBadge(event.delivery_mode)}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                                            {__('Code: :code', {
                                                code: event.slug,
                                            })}
                                        </span>
                                        {event.quota && (
                                            <span className="flex items-center gap-1 text-xs font-medium text-zinc-500">
                                                <Users className="h-3.5 w-3.5" />{' '}
                                                {__('Max :quota', {
                                                    quota: event.quota,
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="line-clamp-1 text-lg font-bold text-zinc-900 transition-colors duration-200 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                                        {event.title}
                                    </h3>
                                    <p className="line-clamp-2 min-h-[40px] text-sm text-zinc-600 dark:text-zinc-400">
                                        {event.description ||
                                            __('No description provided.')}
                                    </p>
                                </div>

                                <div className="space-y-3 border-t pt-4 text-xs text-zinc-500 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                                        <span>
                                            {event.start_date}{' '}
                                            {event.start_time
                                                ? `@ ${event.start_time}`
                                                : ''}
                                        </span>
                                    </div>

                                    {event.venue &&
                                        event.delivery_mode !== 'online' && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
                                                <span className="truncate">
                                                    {event.venue}
                                                </span>
                                            </div>
                                        )}

                                    {event.online_platform &&
                                        event.delivery_mode !== 'offline' && (
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 shrink-0 text-zinc-400" />
                                                <span className="truncate">
                                                    {event.online_platform}
                                                </span>
                                            </div>
                                        )}
                                </div>

                                <div className="mt-auto flex items-center justify-between gap-2 border-t pt-4 dark:border-zinc-800">
                                    <div className="flex items-center gap-1.5">
                                        <Link href={show.url(event.id)}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {canManageEvents && (
                                            <>
                                                <Link href={edit.url(event.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() =>
                                                        handleDelete(event.id)
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    {canManageEvents &&
                                        event.status === 'draft' && (
                                            <Button
                                                onClick={() =>
                                                    handlePublish(event.id)
                                                }
                                                size="sm"
                                                variant="outline"
                                                className="h-7 cursor-pointer border-emerald-600/30 bg-emerald-500/5 py-1 text-xs text-emerald-600 hover:bg-emerald-500/10"
                                            >
                                                {__('Publish')}
                                            </Button>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
