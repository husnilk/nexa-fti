import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Eye, UserPlus, FileText, ArrowLeft, Ticket, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { index, create, show, edit, destroy } from '@/routes/event-registrations';
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

type PageProps = {
    eventRegistrations: EventRegistration[];
    events: Event[];
    filters: {
        event_id: string | number;
    };
};

export default function EventRegistrationsIndex({ eventRegistrations = [], events = [], filters }: PageProps) {
    const [selectedEventId, setSelectedEventId] = useState<string | number>(filters.event_id || '');

    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedEventId(id);
        router.get(index.url(), { event_id: id }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this participant registration?')) {
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
        <div className="container mx-auto py-8 px-4 max-w-6xl space-y-6">
            <Head title="Event Participants Management" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                    <Link href={eventIndex.url()}>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-violet-600 dark:text-violet-400" /> Event Participants
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage users registration, attendance, tickets, and certificates.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedEventId}
                        onChange={handleEventChange}
                        className="flex h-9 rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300 max-w-xs"
                    >
                        <option value="">All Events</option>
                        {events.map((event) => (
                            <option key={event.id} value={event.id}>
                                {event.title}
                            </option>
                        ))}
                    </select>

                    <Link href={create.url(selectedEventId ? { event_id: selectedEventId } : {})}>
                        <Button className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 gap-2">
                            <UserPlus className="w-4 h-4" /> Register Participant
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border dark:border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg">Registered Participants</CardTitle>
                    <CardDescription>
                        {eventRegistrations.length} registrations found
                        {selectedEventId && events.find(e => e.id === Number(selectedEventId)) && (
                            <span> for <span className="font-semibold">{events.find(e => e.id === Number(selectedEventId))?.title}</span></span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6 sm:pt-0">
                    {eventRegistrations.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <Ticket className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
                            <h3 className="font-semibold text-zinc-900 dark:text-white">No registrations found</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                No participants have been registered yet. Click the button above to register a participant manually.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
                                <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Participant</th>
                                        <th className="px-6 py-4 font-semibold">Event</th>
                                        <th className="px-6 py-4 font-semibold">Reg. Number</th>
                                        <th className="px-6 py-4 font-semibold">Ticket & Cert.</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {eventRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-zinc-900 dark:text-white">
                                                    {reg.user?.name || 'Unknown User'}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {reg.user?.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-zinc-850 dark:text-zinc-250 truncate max-w-xs">
                                                    {reg.event?.title || 'Unknown Event'}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" /> Registered: {new Date(reg.registered_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">
                                                {reg.registration_number}
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div className="text-xs">
                                                    Ticket: <span className="font-mono">{reg.ticket_number}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Cert: <span className="font-mono">{reg.certificate_number}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`capitalize ${getStatusColor(reg.attendance_status)}`}>
                                                    {reg.attendance_status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={show.url(reg.id)}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" title="View Details">
                                                            <Eye className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={edit.url(reg.id)}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" title="Edit Registration">
                                                            <Pencil className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() => handleDelete(reg.id)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-rose-600 hover:bg-rose-50/50 hover:text-rose-700"
                                                        title="Delete Participant"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
