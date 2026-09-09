import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, ArrowLeft, Calendar, Clock, MapPin, Globe, Users, Megaphone, Trash2, ShieldAlert, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    event: Event;
};

export default function ShowEvent({ event }: PageProps) {
    const { auth } = usePage<PageProps>().props;

    const hasRole = (name: string) => auth.roles.includes(name);
    const hasPermission = (module: string) =>
        hasRole('super-admin') ||
        auth.permissions.some((p) => p === module || p.startsWith(`${module}.`));

    const canManageEvents = hasPermission('event.manage');

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this event?')) {
            router.delete(destroy.url(event.id));
        }
    };

    const handlePublish = () => {
        if (confirm('Are you sure you want to publish this event? This will make it visible to participants.')) {
            router.post(publish.url(event.id), {}, {
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

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
            <Head title={`Event Cockpit - ${event.title}`} />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                    <Link href={index.url()}>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                {event.title}
                            </h1>
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border capitalize ${getStatusColor(event.status)}`}>
                                {event.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">Code / Slug: <span className="font-semibold">{event.slug}</span></p>
                    </div>
                </div>

                {canManageEvents && (
                    <div className="flex items-center gap-2">
                        {event.status === 'draft' && (
                            <Button
                                onClick={handlePublish}
                                className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <Check className="w-4 h-4" /> Publish Event
                            </Button>
                        )}
                        <Link href={registrationIndex.url({ event_id: event.id })}>
                            <Button variant="outline" className="cursor-pointer gap-2">
                                <Users className="w-4 h-4" /> Manage Participants
                            </Button>
                        </Link>
                        <Link href={edit.url(event.id)}>
                            <Button variant="outline" className="cursor-pointer gap-2">
                                <Pencil className="w-4 h-4" /> Edit
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            className="cursor-pointer gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                    </div>
                )}
            </div>

            {/* Banner Section */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border dark:border-zinc-800 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-zinc-850 dark:to-zinc-800 flex items-center justify-center">
                {event.banner_image ? (
                    <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 flex flex-col items-center justify-center p-4 text-center">
                        <Megaphone className="w-16 h-16 text-violet-500/60 mb-2" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-3 py-1 rounded">
                            {event.event_type}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Columns - Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Event Description</h2>
                        <p className="text-zinc-750 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {event.description || 'No description provided.'}
                        </p>
                    </div>

                    {event.objectives && (
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Objectives & Outcomes</h2>
                            <p className="text-zinc-750 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {event.objectives}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar info card */}
                <div className="space-y-6">
                    {/* Schedule */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                        <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-zinc-800">
                            <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Schedule Details
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-zinc-400">Start Date & Time</p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {event.start_date} {event.start_time ? `@ ${event.start_time}` : ''}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400">End Date & Time</p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {event.end_date} {event.end_time ? `@ ${event.end_time}` : ''}
                                </p>
                            </div>
                            {event.registration_deadline && (
                                <div className="pt-2 border-t dark:border-zinc-800">
                                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-rose-500" /> Registration Deadline
                                    </p>
                                    <p className="font-medium text-rose-650 dark:text-rose-400">
                                        {new Date(event.registration_deadline).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Venue & Delivery Mode */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                        <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-zinc-800">
                            <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Venue & Platform
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-zinc-400">Delivery Mode</p>
                                <p className="font-medium text-zinc-800 dark:text-zinc-200 capitalize">
                                    {event.delivery_mode}
                                </p>
                            </div>

                            {event.delivery_mode !== 'online' && event.venue && (
                                <div>
                                    <p className="text-xs text-zinc-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Physical Location</p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{event.venue}</p>
                                </div>
                            )}

                            {event.delivery_mode !== 'offline' && (
                                <>
                                    {event.online_platform && (
                                        <div>
                                            <p className="text-xs text-zinc-400">Platform</p>
                                            <p className="font-medium text-zinc-800 dark:text-zinc-200">{event.online_platform}</p>
                                        </div>
                                    )}
                                    {event.online_link && (
                                        <div>
                                            <p className="text-xs text-zinc-400">Meeting Link</p>
                                            <a
                                                href={event.online_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-violet-600 hover:text-violet-850 dark:text-violet-400 dark:hover:text-violet-300 break-all underline"
                                            >
                                                {event.online_link}
                                            </a>
                                        </div>
                                    )}
                                </>
                            )}

                            {event.quota && (
                                <div className="pt-2 border-t dark:border-zinc-800">
                                    <p className="text-xs text-zinc-400 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Capacity Limit</p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{event.quota} participants maximum</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organizer */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                        <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm border-b pb-2 dark:border-zinc-800">
                            <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Event Organizer
                        </h3>
                        <div className="space-y-3 text-sm">
                            {event.createdBy && (
                                <div>
                                    <p className="text-xs text-zinc-400">Name</p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{event.createdBy.name}</p>
                                    {event.createdBy.email && (
                                        <p className="text-xs text-zinc-500 mt-0.5">{event.createdBy.email}</p>
                                    )}
                                </div>
                            )}
                            {event.publishedBy && (
                                <div className="pt-2 border-t dark:border-zinc-800">
                                    <p className="text-xs text-zinc-400">Published By</p>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200">{event.publishedBy.name}</p>
                                    {event.published_at && (
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            On {new Date(event.published_at).toLocaleString()}
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
