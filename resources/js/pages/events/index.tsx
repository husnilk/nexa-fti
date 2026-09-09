import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Eye, Calendar, Clock, MapPin, Globe, Users, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    event_type: 'seminar' | 'workshop' | 'training' | 'conference' | 'webinar' | 'other';
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
        auth.permissions.some((p) => p === module || p.startsWith(`${module}.`));

    const canManageEvents = hasPermission('event.manage');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        router.get(index.url(), { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(destroy.url(id));
        }
    };

    const handlePublish = (id: number) => {
        if (confirm('Are you sure you want to publish this event? This will make it visible to participants.')) {
            router.post(publish.url(id), {}, {
                onSuccess: () => alert('Event published successfully!'),
            });
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
                    <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> Offline
                    </span>
                );
            case 'online':
                return (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        <Globe className="w-3.5 h-3.5" /> Online
                    </span>
                );
            case 'hybrid':
                return (
                    <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        <Globe className="w-3.5 h-3.5" /> Hybrid
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

        return matchesStatus;
    });

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Events Dashboard" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Events
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage departmental academic events, seminars, workshops, and registrations.</p>
                </div>
                {canManageEvents && (
                    <Link href={create.url()}>
                        <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                            <Plus className="h-4 w-4" /> Create Event
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search events..."
                        className="pl-9 bg-white dark:bg-zinc-900"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500 font-medium">Status:</span>
                    <div className="flex rounded-lg border dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                        {['all', 'draft', 'published', 'ongoing', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-xs font-semibold capitalize transition-all duration-200 cursor-pointer ${
                                    statusFilter === status
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border rounded-2xl bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-xs">
                    <Megaphone className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No Events Found</h3>
                    <p className="text-zinc-500 text-sm mt-1 max-w-md text-center">
                        Try adjusting your search query or status filter, or create a new event.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group flex flex-col justify-between overflow-hidden bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-800"
                        >
                            <div className="relative h-44 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden border-b dark:border-zinc-800">
                                {event.banner_image ? (
                                    <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 flex flex-col items-center justify-center p-4 text-center">
                                        <Megaphone className="w-12 h-12 text-violet-500/60 mb-2" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                                            {event.event_type}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border capitalize ${getStatusColor(event.status)}`}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xs px-2.5 py-1 rounded-md border dark:border-zinc-800">
                                    {getDeliveryModeBadge(event.delivery_mode)}
                                </div>
                            </div>

                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Code: {event.slug}</span>
                                        {event.quota && (
                                            <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                                                <Users className="w-3.5 h-3.5" /> Max {event.quota}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 min-h-[40px]">
                                        {event.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="border-t pt-4 dark:border-zinc-800 space-y-3 text-xs text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                                        <span>
                                            {event.start_date} {event.start_time ? `@ ${event.start_time}` : ''}
                                        </span>
                                    </div>
                                    
                                    {event.venue && event.delivery_mode !== 'online' && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                                            <span className="truncate">{event.venue}</span>
                                        </div>
                                    )}

                                    {event.online_platform && event.delivery_mode !== 'offline' && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                                            <span className="truncate">{event.online_platform}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4 mt-auto dark:border-zinc-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <Link href={show.url(event.id)}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {canManageEvents && (
                                            <>
                                                <Link href={edit.url(event.id)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDelete(event.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300 cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    {canManageEvents && event.status === 'draft' && (
                                        <Button
                                            onClick={() => handlePublish(event.id)}
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer border-emerald-600/30 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 text-xs py-1 h-7"
                                        >
                                            Publish
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
