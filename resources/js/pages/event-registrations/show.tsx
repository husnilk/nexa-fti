import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    User,
    FileText,
    Clock,
    Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { __, intlLocale } from '@/lib/i18n';
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

const attendanceStatusLabels: Record<string, string> = {
    registered: __('Registered'),
    attended: __('Attended'),
    no_show: __('No Show'),
    cancelled: __('Cancelled'),
};

type PageProps = {
    eventRegistration: EventRegistration;
};

export default function ShowEventRegistration({
    eventRegistration,
}: PageProps) {
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
        <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
            <Head
                title={__('Participant - :name', {
                    name: eventRegistration.user?.name || __('Details'),
                })}
            />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Link
                        href={index.url({
                            event_id: eventRegistration.event_id,
                        })}
                    >
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
                            {__('Registration Details')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {__(
                                'Review registration numbers, ticket details, and attendance status.',
                            )}
                        </p>
                    </div>
                </div>

                <Link href={edit.url(eventRegistration.id)}>
                    <Button variant="outline" className="cursor-pointer">
                        {__('Edit Registration')}
                    </Button>
                </Link>
            </div>

            {/* Premium Virtual Ticket */}
            <div className="relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm md:flex-row dark:border-zinc-800 dark:bg-zinc-900">
                {/* Left side: Ticket Info */}
                <div className="flex-1 space-y-6 p-6 md:p-8">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <span className="rounded bg-violet-500/10 px-2.5 py-1 text-xs font-semibold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                                {__('Event Ticket')}
                            </span>
                            <h2 className="pt-1 text-xl font-bold text-zinc-900 dark:text-white">
                                {eventRegistration.event?.title ||
                                    __('Unknown Event')}
                            </h2>
                        </div>
                        <Badge
                            variant="outline"
                            className={`capitalize ${getStatusColor(eventRegistration.attendance_status)}`}
                        >
                            {attendanceStatusLabels[
                                eventRegistration.attendance_status
                            ] ?? eventRegistration.attendance_status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <span className="block text-xs text-muted-foreground">
                                {__('Participant Name')}
                            </span>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {eventRegistration.user?.name || __('Unknown')}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-muted-foreground">
                                {__('Registration No.')}
                            </span>
                            <span className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                {eventRegistration.registration_number}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-muted-foreground">
                                {__('Ticket No.')}
                            </span>
                            <span className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                {eventRegistration.ticket_number}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-muted-foreground">
                                {__('Certificate No.')}
                            </span>
                            <span className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                {eventRegistration.certificate_number ||
                                    __('N/A')}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                        {eventRegistration.event?.start_date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <span>
                                    {new Date(
                                        eventRegistration.event.start_date,
                                    ).toLocaleDateString(intlLocale())}{' '}
                                    {eventRegistration.event.start_time
                                        ? `@ ${eventRegistration.event.start_time}`
                                        : ''}
                                </span>
                            </div>
                        )}
                        {eventRegistration.event?.venue && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <span>{eventRegistration.event.venue}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vertical Cut Separation (Ticket Stub look) */}
                <div className="relative hidden w-8 flex-col items-center justify-between py-4 select-none md:flex">
                    <div className="-mt-7 -ml-6 h-6 w-6 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"></div>
                    <div className="h-full border-r border-dashed border-zinc-200 dark:border-zinc-800"></div>
                    <div className="-mb-7 -ml-6 h-6 w-6 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"></div>
                </div>

                {/* Right side: Virtual QR Code stub */}
                <div className="flex w-full flex-col items-center justify-center gap-3 border-t border-zinc-100 bg-zinc-50 p-6 text-center md:w-56 md:border-t-0 md:border-l md:p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex h-32 w-32 items-center justify-center rounded-2xl border bg-white p-2 shadow-xs dark:border-zinc-700 dark:bg-zinc-800">
                        {/* Virtual QR Placeholder */}
                        <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-zinc-100 p-2 text-zinc-300 dark:bg-zinc-900 dark:text-zinc-700">
                            <span className="absolute bottom-1 w-full truncate px-1 text-center font-mono text-[10px] break-all text-zinc-500">
                                {eventRegistration.qr_code ||
                                    eventRegistration.ticket_number}
                            </span>
                            <svg
                                className="h-12 w-12 text-zinc-400 dark:text-zinc-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                            {__('Verification QR')}
                        </span>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                            {eventRegistration.registration_number}
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Registration Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Meta details */}
                <Card className="border dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-base">
                            {__('Metadata Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center justify-between border-b py-2 dark:border-zinc-800">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-4 w-4" />{' '}
                                {__('Registered At')}
                            </span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                {new Date(
                                    eventRegistration.registered_at,
                                ).toLocaleString(intlLocale())}
                            </span>
                        </div>
                        <div className="flex items-center justify-between border-b py-2 dark:border-zinc-800">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-4 w-4" /> {__('Issued At')}
                            </span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                {new Date(
                                    eventRegistration.issued_at,
                                ).toLocaleString(intlLocale())}
                            </span>
                        </div>
                        {eventRegistration.generatedBy && (
                            <div className="flex items-center justify-between border-b py-2 dark:border-zinc-800">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <User className="h-4 w-4" />{' '}
                                    {__('Assisted By')}
                                </span>
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {eventRegistration.generatedBy.name}
                                </span>
                            </div>
                        )}
                        {eventRegistration.file_path && (
                            <div className="flex items-center justify-between py-2">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Award className="h-4 w-4" />{' '}
                                    {__('Cert. File Path')}
                                </span>
                                <span className="font-mono text-xs break-all text-zinc-800 select-all dark:text-zinc-200">
                                    {eventRegistration.file_path}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Notes card */}
                <Card className="border dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />{' '}
                            {__('Registration Notes')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                            {eventRegistration.notes ||
                                __('No notes available for this registration.')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
