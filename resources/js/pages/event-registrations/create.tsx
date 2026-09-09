import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Ticket } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index } from '@/routes/event-registrations';

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

type PageProps = {
    events: Event[];
    users: User[];
    employees: Employee[];
    selected_event_id?: number | null;
};

const generateRandomString = (prefix: string, length: number = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${prefix}-${result}`;
};

export default function CreateEventRegistration({ events = [], users = [], employees = [], selected_event_id }: PageProps) {
    const defaultRegNumber = generateRandomString('REG', 8);
    const defaultTicketNumber = generateRandomString('TCK', 8);
    const defaultCertNumber = generateRandomString('CERT', 8);
    const defaultDate = new Date().toISOString().slice(0, 16);

    const { data, setData, post, processing, errors } = useForm({
        event_id: selected_event_id || '',
        user_id: '',
        registration_number: defaultRegNumber,
        registered_at: defaultDate,
        attendance_status: 'registered' as const,
        notes: '',
        ticket_number: defaultTicketNumber,
        qr_code: '',
        issued_at: defaultDate,
        certificate_number: defaultCertNumber,
        file_path: '',
        generated_by: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(index.url());
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
            <Head title="Register Participant" />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={index.url(data.event_id ? { event_id: data.event_id } : {})}>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-violet-600 dark:text-violet-400" /> Register Participant
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Register a user for an event and issue tickets/certificates.
                    </p>
                </div>
            </div>

            <Card className="border dark:border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg">Participant Registration Details</CardTitle>
                    <CardDescription>Enter the registration information below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Event Select */}
                            <div className="space-y-2">
                                <Label htmlFor="event_id">Event *</Label>
                                <select
                                    id="event_id"
                                    value={data.event_id}
                                    onChange={(e) => setData('event_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                    required
                                >
                                    <option value="">Select Event</option>
                                    {events.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            {e.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.event_id && <p className="text-xs text-rose-600 mt-1">{errors.event_id}</p>}
                            </div>

                            {/* User Select */}
                            <div className="space-y-2">
                                <Label htmlFor="user_id">Participant User *</Label>
                                <select
                                    id="user_id"
                                    value={data.user_id}
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.user_id && <p className="text-xs text-rose-600 mt-1">{errors.user_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Reg Number */}
                            <div className="space-y-2">
                                <Label htmlFor="registration_number">Registration Number *</Label>
                                <Input
                                    id="registration_number"
                                    value={data.registration_number}
                                    onChange={(e) => setData('registration_number', e.target.value)}
                                    placeholder="e.g. REG-12345"
                                    required
                                />
                                {errors.registration_number && <p className="text-xs text-rose-600 mt-1">{errors.registration_number}</p>}
                            </div>

                            {/* Registered At */}
                            <div className="space-y-2">
                                <Label htmlFor="registered_at">Registered Date & Time *</Label>
                                <Input
                                    id="registered_at"
                                    type="datetime-local"
                                    value={data.registered_at}
                                    onChange={(e) => setData('registered_at', e.target.value)}
                                    required
                                />
                                {errors.registered_at && <p className="text-xs text-rose-600 mt-1">{errors.registered_at}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Ticket Number */}
                            <div className="space-y-2">
                                <Label htmlFor="ticket_number">Ticket Number *</Label>
                                <Input
                                    id="ticket_number"
                                    value={data.ticket_number}
                                    onChange={(e) => setData('ticket_number', e.target.value)}
                                    placeholder="e.g. TCK-12345"
                                    required
                                />
                                {errors.ticket_number && <p className="text-xs text-rose-600 mt-1">{errors.ticket_number}</p>}
                            </div>

                            {/* Certificate Number */}
                            <div className="space-y-2">
                                <Label htmlFor="certificate_number">Certificate Number *</Label>
                                <Input
                                    id="certificate_number"
                                    value={data.certificate_number}
                                    onChange={(e) => setData('certificate_number', e.target.value)}
                                    placeholder="e.g. CERT-12345"
                                    required
                                />
                                {errors.certificate_number && <p className="text-xs text-rose-600 mt-1">{errors.certificate_number}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Attendance Status */}
                            <div className="space-y-2">
                                <Label htmlFor="attendance_status">Attendance Status *</Label>
                                <select
                                    id="attendance_status"
                                    value={data.attendance_status}
                                    onChange={(e) => setData('attendance_status', e.target.value as any)}
                                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                                    required
                                >
                                    <option value="registered">Registered</option>
                                    <option value="attended">Attended</option>
                                    <option value="no_show">No Show</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {errors.attendance_status && <p className="text-xs text-rose-600 mt-1">{errors.attendance_status}</p>}
                            </div>

                            {/* Issued At */}
                            <div className="space-y-2">
                                <Label htmlFor="issued_at">Issued Date & Time *</Label>
                                <Input
                                    id="issued_at"
                                    type="datetime-local"
                                    value={data.issued_at}
                                    onChange={(e) => setData('issued_at', e.target.value)}
                                    required
                                />
                                {errors.issued_at && <p className="text-xs text-rose-600 mt-1">{errors.issued_at}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* QR Code */}
                            <div className="space-y-2">
                                <Label htmlFor="qr_code">QR Code (Optional)</Label>
                                <Input
                                    id="qr_code"
                                    value={data.qr_code}
                                    onChange={(e) => setData('qr_code', e.target.value)}
                                    placeholder="e.g. qr-data-string"
                                />
                                {errors.qr_code && <p className="text-xs text-rose-600 mt-1">{errors.qr_code}</p>}
                            </div>

                            {/* File Path */}
                            <div className="space-y-2">
                                <Label htmlFor="file_path">Certificate File Path (Optional)</Label>
                                <Input
                                    id="file_path"
                                    value={data.file_path}
                                    onChange={(e) => setData('file_path', e.target.value)}
                                    placeholder="e.g. certificates/cert.pdf"
                                />
                                {errors.file_path && <p className="text-xs text-rose-600 mt-1">{errors.file_path}</p>}
                            </div>
                        </div>

                        {/* Generated By Select */}
                        <div className="space-y-2">
                            <Label htmlFor="generated_by">Generated By Employee (Optional)</Label>
                            <select
                                id="generated_by"
                                value={data.generated_by}
                                onChange={(e) => setData('generated_by', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                            {errors.generated_by && <p className="text-xs text-rose-600 mt-1">{errors.generated_by}</p>}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Additional notes about this participant registration..."
                                rows={3}
                            />
                            {errors.notes && <p className="text-xs text-rose-600 mt-1">{errors.notes}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={index.url(data.event_id ? { event_id: data.event_id } : {})}>
                                <Button variant="outline" type="button" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 gap-2"
                            >
                                <Check className="w-4 h-4" /> Save Registration
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
