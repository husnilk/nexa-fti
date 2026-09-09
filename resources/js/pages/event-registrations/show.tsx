import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, Ticket, User, FileText, Check, ShieldAlert, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { index, edit } from '@/routes/event-registrations';

type UserType = {
    id: string;
    name: string;
    email: string;
};

type Event = {
    id: number;
    title: string;
    venue?: string;
    start_date: string;
    start_time?: string;
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
    user?: UserType;
    generatedBy?: Employee;
};

type PageProps = {
    eventRegistration: EventRegistration;
};

export default function ShowEventRegistration({ eventRegistration }: PageProps) {
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
        <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6">
            <Head title={`Participant - ${eventRegistration.user?.name || 'Details'}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-3">
                    <Link href={index.url({ event_id: eventRegistration.event_id })}>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                            Registration Details
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Review registration numbers, ticket details, and attendance status.
                        </p>
                    </div>
                </div>

                <Link href={edit.url(eventRegistration.id)}>
                    <Button variant="outline" className="cursor-pointer">
                        Edit Registration
                    </Button>
                </Link>
            </div>

            {/* Premium Virtual Ticket */}
            <div className="relative border dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm flex flex-col md:flex-row">
                {/* Left side: Ticket Info */}
                <div className="flex-1 p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded">
                                Event Ticket
                            </span>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white pt-1">
                                {eventRegistration.event?.title || 'Unknown Event'}
                            </h2>
                        </div>
                        <Badge variant="outline" className={`capitalize ${getStatusColor(eventRegistration.attendance_status)}`}>
                            {eventRegistration.attendance_status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <span className="text-xs text-muted-foreground block">Participant Name</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{eventRegistration.user?.name || 'Unknown'}</span>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground block">Registration No.</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono text-sm">{eventRegistration.registration_number}</span>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground block">Ticket No.</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono text-sm">{eventRegistration.ticket_number}</span>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground block">Certificate No.</span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono text-sm">{eventRegistration.certificate_number || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t dark:border-zinc-800 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {eventRegistration.event?.start_date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                <span>{new Date(eventRegistration.event.start_date).toLocaleDateString()} {eventRegistration.event.start_time ? `@ ${eventRegistration.event.start_time}` : ''}</span>
                            </div>
                        )}
                        {eventRegistration.event?.venue && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                <span>{eventRegistration.event.venue}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vertical Cut Separation (Ticket Stub look) */}
                <div className="hidden md:flex flex-col items-center justify-between py-4 select-none relative w-8">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 -mt-7 -ml-6"></div>
                    <div className="h-full border-r border-dashed border-zinc-200 dark:border-zinc-800"></div>
                    <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 -mb-7 -ml-6"></div>
                </div>

                {/* Right side: Virtual QR Code stub */}
                <div className="w-full md:w-56 bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800 gap-3 text-center">
                    <div className="w-32 h-32 bg-white dark:bg-zinc-800 p-2 rounded-2xl border dark:border-zinc-700 shadow-xs flex items-center justify-center">
                        {/* Virtual QR Placeholder */}
                        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-300 dark:text-zinc-700 p-2 relative">
                            <span className="text-[10px] font-mono text-zinc-500 break-all absolute bottom-1 text-center w-full px-1 truncate">
                                {eventRegistration.qr_code || eventRegistration.ticket_number}
                            </span>
                            <svg className="w-12 h-12 text-zinc-400 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Verification QR</span>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">{eventRegistration.registration_number}</p>
                    </div>
                </div>
            </div>

            {/* Additional Registration Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meta details */}
                <Card className="border dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-base">Metadata Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4" /> Registered At</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                {new Date(eventRegistration.registered_at).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800">
                            <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4" /> Issued At</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                {new Date(eventRegistration.issued_at).toLocaleString()}
                            </span>
                        </div>
                        {eventRegistration.generatedBy && (
                            <div className="flex justify-between items-center py-2 border-b dark:border-zinc-800">
                                <span className="text-muted-foreground flex items-center gap-1.5"><User className="w-4 h-4" /> Assisted By</span>
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {eventRegistration.generatedBy.name}
                                </span>
                            </div>
                        )}
                        {eventRegistration.file_path && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground flex items-center gap-1.5"><Award className="w-4 h-4" /> Cert. File Path</span>
                                <span className="font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all select-all">
                                    {eventRegistration.file_path}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Notes card */}
                <Card className="border dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" /> Registration Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {eventRegistration.notes || 'No notes available for this registration.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
