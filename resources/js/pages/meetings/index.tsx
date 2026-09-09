import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Eye, Calendar, Clock, MapPin, Globe, Shield } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type PageProps = {
    meetings: Meeting[];
    employees: Employee[];
    rooms: Room[];
    committees: Committee[];
};

export default function MeetingsIndex({ meetings = [], employees = [], rooms = [], committees = [] }: PageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredMeetings = meetings.filter((meeting) => {
        const matchesSearch = meeting.title.toLowerCase().includes(search.toLowerCase()) ||
            (meeting.agenda && meeting.agenda.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
        const matchesType = typeFilter === 'all' || meeting.meeting_type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this meeting?')) {
            router.delete(destroy.url(id));
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Meetings Dashboard" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Meetings
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage departmental meetings, participants, minutes, action items, and refreshments.</p>
                </div>
                <Link href={create.url()}>
                    <Button className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                        <Plus className="h-4 w-4" /> Create Meeting
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search meetings..."
                        className="pl-9 bg-white dark:bg-zinc-900"
                    />
                </div>
                
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Types</option>
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Meeting Info</th>
                                <th className="py-4 px-6">Date & Time</th>
                                <th className="py-4 px-6">Location / Link</th>
                                <th className="py-4 px-6">Organizer / Chairman</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredMeetings.length > 0 ? (
                                filteredMeetings.map((meeting) => (
                                    <tr key={meeting.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                                                    {meeting.title}
                                                    {meeting.is_confidential && (
                                                        <span title="Confidential">
                                                            <Shield className="h-3.5 w-3.5 text-rose-500 fill-rose-500/10" />
                                                        </span>
                                                    )}
                                                </span>
                                                {meeting.committee && (
                                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                                        Committee: {meeting.committee.title}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(meeting.meeting_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {meeting.start_time.substring(0, 5)} - {meeting.end_time.substring(0, 5)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {meeting.meeting_type === 'offline' && (
                                                <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    {meeting.room?.name || `Room ID: ${meeting.room_id}`}
                                                </span>
                                            )}
                                            {meeting.meeting_type === 'online' && (
                                                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                                                    <Globe className="h-4 w-4" />
                                                    {meeting.online_platform || 'Online'}
                                                </span>
                                            )}
                                            {meeting.meeting_type === 'hybrid' && (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 text-xs">
                                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {meeting.room?.name || 'Room'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium text-xs">
                                                        <Globe className="h-3.5 w-3.5" />
                                                        {meeting.online_platform || 'Online'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-0.5 text-xs">
                                                <span><strong className="text-muted-foreground">Org:</strong> {meeting.organizer?.name || 'Unknown'}</span>
                                                <span><strong className="text-muted-foreground">Chair:</strong> {meeting.chairman?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize
                                                ${meeting.status === 'scheduled' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400' : ''}
                                                ${meeting.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400' : ''}
                                                ${meeting.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400' : ''}
                                                ${meeting.status === 'draft' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' : ''}
                                            `}>
                                                {meeting.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={show.url(meeting.id)}>
                                                    <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={edit.url(meeting.id)}>
                                                    <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDelete(meeting.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No meetings found matching the filters.
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
