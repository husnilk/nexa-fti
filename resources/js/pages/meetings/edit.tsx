import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import { index, update } from '@/routes/meetings';

type Employee = {
    id: string;
    name: string;
};

type Room = {
    id: number;
    name: string;
};

type Committee = {
    id: string;
    title: string;
};

type Meeting = {
    id: string;
    committee_id?: string;
    title: string;
    agenda?: string;
    meeting_type: 'offline' | 'online' | 'hybrid';
    meeting_date: string;
    start_time: string;
    end_time: string;
    room_id?: number;
    online_platform?: string;
    online_link?: string;
    organizer_id?: string;
    chairman_id?: string;
    status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
    is_confidential: boolean;
    organizer_id_id: string;
    chairman_id_id: string;
};

type PageProps = {
    meeting: Meeting;
    employees: Employee[];
    rooms: Room[];
    committees: Committee[];
};

export default function EditMeeting({
    meeting,
    employees = [],
    rooms = [],
    committees = [],
}: PageProps) {
    const formattedDate = meeting.meeting_date
        ? new Date(meeting.meeting_date).toISOString().split('T')[0]
        : '';

    const { data, setData, put, processing, errors } = useForm({
        committee_id: meeting.committee_id || '',
        title: meeting.title || '',
        agenda: meeting.agenda || '',
        meeting_type: meeting.meeting_type || 'offline',
        meeting_date: formattedDate,
        start_time: meeting.start_time || '',
        end_time: meeting.end_time || '',
        room_id: meeting.room_id || '',
        online_platform: meeting.online_platform || '',
        online_link: meeting.online_link || '',
        organizer_id: meeting.organizer_id || '',
        organizer_id_id: meeting.organizer_id_id || '',
        chairman_id: meeting.chairman_id || '',
        chairman_id_id: meeting.chairman_id_id || '',
        status: meeting.status || 'draft',
        is_confidential: !!meeting.is_confidential,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(update.url(meeting.id));
    };

    const handleSelectEmployee = (
        field: 'organizer' | 'chairman',
        value: string,
    ) => {
        if (field === 'organizer') {
            setData((prev) => ({
                ...prev,
                organizer_id: value,
                organizer_id_id: value,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                chairman_id: value,
                chairman_id_id: value,
            }));
        }
    };

    return (
        <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8">
            <Head title={__('Edit Meeting')} />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
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
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Edit Meeting')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Update meeting details, scheduled time, or platform links.',
                        )}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
                <div className="grid gap-2">
                    <Label htmlFor="title">{__('Title *')}</Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder={__('Meeting Title')}
                        required
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="agenda">{__('Agenda')}</Label>
                    <Textarea
                        id="agenda"
                        value={data.agenda}
                        onChange={(e) => setData('agenda', e.target.value)}
                        placeholder={__('Topics to discuss...')}
                        rows={3}
                    />
                    {errors.agenda && (
                        <p className="text-sm text-destructive">
                            {errors.agenda}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="committee_id">{__('Committee')}</Label>
                        <select
                            id="committee_id"
                            value={data.committee_id}
                            onChange={(e) =>
                                setData('committee_id', e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="">{__('No Committee')}</option>
                            {committees.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                        {errors.committee_id && (
                            <p className="text-sm text-destructive">
                                {errors.committee_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="meeting_type">
                            {__('Meeting Type *')}
                        </Label>
                        <select
                            id="meeting_type"
                            value={data.meeting_type}
                            onChange={(e) =>
                                setData('meeting_type', e.target.value as any)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="offline">
                                {__('Offline (In-Person)')}
                            </option>
                            <option value="online">{__('Online')}</option>
                            <option value="hybrid">{__('Hybrid')}</option>
                        </select>
                        {errors.meeting_type && (
                            <p className="text-sm text-destructive">
                                {errors.meeting_type}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="meeting_date">{__('Date *')}</Label>
                        <Input
                            id="meeting_date"
                            type="date"
                            value={data.meeting_date}
                            onChange={(e) =>
                                setData('meeting_date', e.target.value)
                            }
                            required
                        />
                        {errors.meeting_date && (
                            <p className="text-sm text-destructive">
                                {errors.meeting_date}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="start_time">{__('Start Time *')}</Label>
                        <Input
                            id="start_time"
                            type="time"
                            value={data.start_time}
                            onChange={(e) =>
                                setData('start_time', e.target.value)
                            }
                            required
                        />
                        {errors.start_time && (
                            <p className="text-sm text-destructive">
                                {errors.start_time}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="end_time">{__('End Time *')}</Label>
                        <Input
                            id="end_time"
                            type="time"
                            value={data.end_time}
                            onChange={(e) =>
                                setData('end_time', e.target.value)
                            }
                            required
                        />
                        {errors.end_time && (
                            <p className="text-sm text-destructive">
                                {errors.end_time}
                            </p>
                        )}
                    </div>
                </div>

                {(data.meeting_type === 'offline' ||
                    data.meeting_type === 'hybrid') && (
                    <div className="grid gap-2">
                        <Label htmlFor="room_id">{__('Room *')}</Label>
                        <select
                            id="room_id"
                            value={data.room_id}
                            onChange={(e) => setData('room_id', e.target.value)}
                            required={data.meeting_type === 'offline'}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="">{__('Select Room')}</option>
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                        {errors.room_id && (
                            <p className="text-sm text-destructive">
                                {errors.room_id}
                            </p>
                        )}
                    </div>
                )}

                {(data.meeting_type === 'online' ||
                    data.meeting_type === 'hybrid') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="online_platform">
                                {__('Online Platform')}
                            </Label>
                            <Input
                                id="online_platform"
                                value={data.online_platform}
                                onChange={(e) =>
                                    setData('online_platform', e.target.value)
                                }
                                placeholder={__('e.g. Zoom, Google Meet')}
                            />
                            {errors.online_platform && (
                                <p className="text-sm text-destructive">
                                    {errors.online_platform}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="online_link">
                                {__('Online Link')}
                            </Label>
                            <Input
                                id="online_link"
                                value={data.online_link}
                                onChange={(e) =>
                                    setData('online_link', e.target.value)
                                }
                                placeholder="https://..."
                            />
                            {errors.online_link && (
                                <p className="text-sm text-destructive">
                                    {errors.online_link}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="organizer_id_id">
                            {__('Organizer *')}
                        </Label>
                        <select
                            id="organizer_id_id"
                            value={data.organizer_id_id}
                            onChange={(e) =>
                                handleSelectEmployee(
                                    'organizer',
                                    e.target.value,
                                )
                            }
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="">{__('Select Organizer')}</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                        {errors.organizer_id_id && (
                            <p className="text-sm text-destructive">
                                {errors.organizer_id_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="chairman_id_id">
                            {__('Chairman *')}
                        </Label>
                        <select
                            id="chairman_id_id"
                            value={data.chairman_id_id}
                            onChange={(e) =>
                                handleSelectEmployee('chairman', e.target.value)
                            }
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="">{__('Select Chairman')}</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                        {errors.chairman_id_id && (
                            <p className="text-sm text-destructive">
                                {errors.chairman_id_id}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="status">{__('Status *')}</Label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) =>
                                setData('status', e.target.value as any)
                            }
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800"
                        >
                            <option value="draft">{__('Draft')}</option>
                            <option value="scheduled">{__('Scheduled')}</option>
                            <option value="completed">{__('Completed')}</option>
                            <option value="cancelled">{__('Cancelled')}</option>
                        </select>
                        {errors.status && (
                            <p className="text-sm text-destructive">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pt-8">
                        <input
                            id="is_confidential"
                            type="checkbox"
                            checked={data.is_confidential}
                            onChange={(e) =>
                                setData('is_confidential', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                            htmlFor="is_confidential"
                            className="cursor-pointer"
                        >
                            {__('This meeting is confidential')}
                        </Label>
                        {errors.is_confidential && (
                            <p className="text-sm text-destructive">
                                {errors.is_confidential}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4 dark:border-zinc-800">
                    <Link href={index.url()}>
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                    >
                        <Save className="h-4 w-4" /> {__('Update Meeting')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
