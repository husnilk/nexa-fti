import { Head, Link, router } from '@inertiajs/react';
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    Eye,
    Calendar,
    Clock,
    MapPin,
    Globe,
    Shield,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { __, intlLocale } from '@/lib/i18n';
import { create, show, edit, destroy } from '@/routes/meetings';

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
    committee?: Committee;
    organizer?: Employee;
    chairman?: Employee;
    room?: Room;
};

const STATUS_LABELS: Record<Meeting['status'], string> = {
    draft: __('Draft'),
    scheduled: __('Scheduled'),
    completed: __('Completed'),
    cancelled: __('Cancelled'),
};

type PageProps = {
    meetings: Meeting[];
    employees: Employee[];
    rooms: Room[];
    committees: Committee[];
};

export default function MeetingsIndex({
    meetings = [],
    employees = [],
    rooms = [],
    committees = [],
}: PageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredMeetings = meetings.filter((meeting) => {
        const matchesSearch =
            meeting.title.toLowerCase().includes(search.toLowerCase()) ||
            (meeting.agenda &&
                meeting.agenda.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus =
            statusFilter === 'all' || meeting.status === statusFilter;
        const matchesType =
            typeFilter === 'all' || meeting.meeting_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleDelete = (id: string) => {
        if (confirm(__('Are you sure you want to delete this meeting?'))) {
            router.delete(destroy.url(id));
        }
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Meetings Dashboard')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Meetings')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage departmental meetings, participants, minutes, action items, and refreshments.',
                        )}
                    </p>
                </div>
                <Link href={create.url()}>
                    <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700">
                        <Plus className="h-4 w-4" /> {__('Create Meeting')}
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={__('Search meetings...')}
                        className="bg-white pl-9 dark:bg-zinc-900"
                    />
                </div>

                <div className="flex w-full flex-wrap gap-3 md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Statuses')}</option>
                        <option value="draft">{__('Draft')}</option>
                        <option value="scheduled">{__('Scheduled')}</option>
                        <option value="completed">{__('Completed')}</option>
                        <option value="cancelled">{__('Cancelled')}</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <option value="all">{__('All Types')}</option>
                        <option value="offline">{__('Offline')}</option>
                        <option value="online">{__('Online')}</option>
                        <option value="hybrid">{__('Hybrid')}</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="px-6 py-4">
                                    {__('Meeting Info')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Date & Time')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Location / Link')}
                                </th>
                                <th className="px-6 py-4">
                                    {__('Organizer / Chairman')}
                                </th>
                                <th className="px-6 py-4 text-center">
                                    {__('Status')}
                                </th>
                                <th className="px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {filteredMeetings.length > 0 ? (
                                filteredMeetings.map((meeting) => (
                                    <tr
                                        key={meeting.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {meeting.title}
                                                    {meeting.is_confidential && (
                                                        <span
                                                            title={__(
                                                                'Confidential',
                                                            )}
                                                        >
                                                            <Shield className="h-3.5 w-3.5 fill-rose-500/10 text-rose-500" />
                                                        </span>
                                                    )}
                                                </span>
                                                {meeting.committee && (
                                                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                        {__(
                                                            'Committee: :title',
                                                            {
                                                                title: meeting
                                                                    .committee
                                                                    .title,
                                                            },
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(
                                                        meeting.meeting_date,
                                                    ).toLocaleDateString(
                                                        intlLocale(),
                                                        { dateStyle: 'medium' },
                                                    )}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {meeting.start_time.substring(
                                                        0,
                                                        5,
                                                    )}{' '}
                                                    -{' '}
                                                    {meeting.end_time.substring(
                                                        0,
                                                        5,
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {meeting.meeting_type ===
                                                'offline' && (
                                                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    {meeting.room?.name ||
                                                        __('Room ID: :id', {
                                                            id:
                                                                meeting.room_id ??
                                                                '',
                                                        })}
                                                </span>
                                            )}
                                            {meeting.meeting_type ===
                                                'online' && (
                                                <span className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                                                    <Globe className="h-4 w-4" />
                                                    {meeting.online_platform ||
                                                        __('Online')}
                                                </span>
                                            )}
                                            {meeting.meeting_type ===
                                                'hybrid' && (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {meeting.room?.name ||
                                                            __('Room')}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                        <Globe className="h-3.5 w-3.5" />
                                                        {meeting.online_platform ||
                                                            __('Online')}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5 text-xs">
                                                <span>
                                                    <strong className="text-muted-foreground">
                                                        {__('Org:')}
                                                    </strong>{' '}
                                                    {meeting.organizer?.name ||
                                                        __('Unknown')}
                                                </span>
                                                <span>
                                                    <strong className="text-muted-foreground">
                                                        {__('Chair:')}
                                                    </strong>{' '}
                                                    {meeting.chairman?.name ||
                                                        __('Unknown')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide capitalize ${meeting.status === 'scheduled' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${meeting.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} ${meeting.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400' : ''} ${meeting.status === 'draft' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' : ''} `}
                                            >
                                                {STATUS_LABELS[
                                                    meeting.status
                                                ] ?? meeting.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={show.url(meeting.id)}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href={edit.url(meeting.id)}
                                                >
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
                                                        handleDelete(meeting.id)
                                                    }
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__(
                                            'No meetings found matching the filters.',
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
