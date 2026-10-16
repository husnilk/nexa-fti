import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Globe,
    Shield,
    Users,
    FileText,
    Coffee,
    CheckSquare,
    Plus,
    Trash2,
    Pencil,
    Check,
    X,
    File,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __, intlLocale } from '@/lib/i18n';
import {
    store as storeMeetingActionItem,
    destroy as destroyMeetingActionItem,
} from '@/routes/meeting-action-items';
import {
    store as storeMeetingDocument,
    destroy as destroyMeetingDocument,
} from '@/routes/meeting-documents';
import {
    store as storeMeetingExternalParticipant,
    destroy as destroyMeetingExternalParticipant,
} from '@/routes/meeting-external-participants';
import {
    store as storeMeetingMinute,
    destroy as destroyMeetingMinute,
} from '@/routes/meeting-minutes';
import {
    store as storeMeetingParticipant,
    destroy as destroyMeetingParticipant,
} from '@/routes/meeting-participants';
import {
    store as storeMeetingRefreshmentItem,
    destroy as destroyMeetingRefreshmentItem,
} from '@/routes/meeting-refreshment-items';
import {
    store as storeMeetingRefreshmentRequest,
    destroy as destroyMeetingRefreshmentRequest,
} from '@/routes/meeting-refreshment-requests';
import { index as meetingsIndex } from '@/routes/meetings';

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

type User = {
    id: string;
    name: string;
    email: string;
};

type MeetingParticipant = {
    id: string;
    meeting_id: string;
    user_id: string;
    role: 'participant' | 'moderator' | 'speaker' | 'note_taker';
    attendance_status: 'invited' | 'attended' | 'absent';
    check_in_time?: string;
    check_out_time?: string;
    attendance_method: 'manual' | 'qr_scan';
    notes?: string;
    user?: User;
};

type MeetingExternalParticipant = {
    id: string;
    meeting_id: string;
    name: string;
    institution?: string;
    email?: string;
    phone?: string;
    role: 'participant' | 'speaker' | 'guest';
    attendance_status: 'invited' | 'attended' | 'absent';
    check_in_time?: string;
    check_out_time?: string;
    attendance_method: 'manual' | 'qr_scan';
};

type MeetingMinute = {
    id: string;
    meeting_id: string;
    version: number;
    summary: string;
    decisions?: string;
    next_actions?: string;
    prepared_by?: string;
    approved_by?: string;
    approved_at?: string;
    is_final: boolean;
    file_upload?: string;
    prepared_by_id: string;
    approved_by_id: string;
    prepared_by_employee?: Employee;
    approved_by_employee?: Employee;
};

type MeetingDocument = {
    id: string;
    meeting_id: string;
    title: string;
    document_type:
        | 'photo'
        | 'minutes'
        | 'presentation'
        | 'recording'
        | 'attendance'
        | 'other';
    file_path: string;
    uploaded_by: string;
    uploaded_at: string;
    uploaded_by_id: string;
    uploader?: Employee;
};

type MeetingRefreshmentItem = {
    id: string;
    meeting_refreshment_request_id: string;
    item_name: string;
    quantity: number;
    estimated_cost?: number;
    notes?: string;
};

type MeetingRefreshmentRequest = {
    id: string;
    meeting_id: string;
    requested_by?: string;
    request_date: string;
    participant_count: number;
    notes?: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'fulfilled';
    approved_by?: string;
    approved_at?: string;
    requested_by_id: string;
    approved_by_id: string;
    requester?: Employee;
    approver?: Employee;
    meeting_refreshment_items?: MeetingRefreshmentItem[];
};

type MeetingActionItem = {
    id: string;
    meeting_id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    assigned_to_id: string;
    assignee?: Employee;
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
    meeting_participants: MeetingParticipant[];
    meeting_external_participants: MeetingExternalParticipant[];
    meeting_minutes: MeetingMinute[];
    meeting_documents: MeetingDocument[];
    meeting_refreshment_requests: MeetingRefreshmentRequest[];
    meeting_action_items: MeetingActionItem[];
};

const VALUE_LABELS: Record<string, string> = {
    draft: __('Draft'),
    scheduled: __('Scheduled'),
    completed: __('Completed'),
    cancelled: __('Cancelled'),
    offline: __('Offline'),
    online: __('Online'),
    hybrid: __('Hybrid'),
    participant: __('Participant'),
    moderator: __('Moderator'),
    speaker: __('Speaker'),
    note_taker: __('Note Taker'),
    guest: __('Guest'),
    invited: __('Invited'),
    attended: __('Attended'),
    absent: __('Absent'),
    photo: __('Photo'),
    minutes: __('Minutes'),
    presentation: __('Presentation'),
    recording: __('Recording'),
    attendance: __('Attendance Sheet'),
    other: __('Other'),
    pending: __('Pending'),
    approved: __('Approved'),
    rejected: __('Rejected'),
    fulfilled: __('Fulfilled'),
    open: __('Open'),
    in_progress: __('In Progress'),
};

const label = (value: string): string => VALUE_LABELS[value] ?? value;

const DELETE_CONFIRMATIONS: Record<string, string> = {
    'meeting-participant': __(
        'Are you sure you want to delete this participant?',
    ),
    'meeting-external-participant': __(
        'Are you sure you want to delete this external participant?',
    ),
    'meeting-minute': __('Are you sure you want to delete these minutes?'),
    'meeting-document': __('Are you sure you want to delete this document?'),
    'meeting-refreshment-request': __(
        'Are you sure you want to delete this refreshment request?',
    ),
    'meeting-refreshment-item': __(
        'Are you sure you want to delete this refreshment item?',
    ),
    'meeting-action-item': __(
        'Are you sure you want to delete this action item?',
    ),
};

type PageProps = {
    meeting: Meeting;
    employees: Employee[];
    rooms: Room[];
    committees: Committee[];
    users: User[];
};

export default function ShowMeeting({
    meeting,
    employees = [],
    rooms = [],
    committees = [],
    users = [],
}: PageProps) {
    const [activeTab, setActiveTab] = useState<
        'overview' | 'participants' | 'documents' | 'refreshments' | 'actions'
    >('overview');

    // Modals visibility
    const [showParticipantModal, setShowParticipantModal] = useState(false);
    const [showExtParticipantModal, setShowExtParticipantModal] =
        useState(false);
    const [showMinuteModal, setShowMinuteModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [showRefreshmentModal, setShowRefreshmentModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedRequestForItems, setSelectedRequestForItems] = useState<
        string | null
    >(null);
    const [showActionModal, setShowActionModal] = useState(false);

    // Sub-resources deletion
    const handleDeleteResource = (type: string, id: string) => {
        if (
            confirm(
                DELETE_CONFIRMATIONS[type] ??
                    __('Are you sure you want to delete this item?'),
            )
        ) {
            let url = '';

            switch (type) {
                case 'meeting-participant':
                    url = destroyMeetingParticipant.url(id);
                    break;
                case 'meeting-external-participant':
                    url = destroyMeetingExternalParticipant.url(id);
                    break;
                case 'meeting-minute':
                    url = destroyMeetingMinute.url(id);
                    break;
                case 'meeting-document':
                    url = destroyMeetingDocument.url(id);
                    break;
                case 'meeting-refreshment-request':
                    url = destroyMeetingRefreshmentRequest.url(id);
                    break;
                case 'meeting-refreshment-item':
                    url = destroyMeetingRefreshmentItem.url(id);
                    break;
                case 'meeting-action-item':
                    url = destroyMeetingActionItem.url(id);
                    break;
            }

            if (url) {
                router.delete(url, {
                    headers: { 'X-Inertia': 'true' },
                });
            }
        }
    };

    // 1. Internal Participant Form
    const participantForm = useForm({
        meeting_id: meeting.id,
        user_id: '',
        role: 'participant',
        attendance_status: 'invited',
        attendance_method: 'manual',
        check_in_time: '',
        check_out_time: '',
        notes: '',
    });

    // 2. External Participant Form
    const extParticipantForm = useForm({
        meeting_id: meeting.id,
        name: '',
        institution: '',
        email: '',
        phone: '',
        role: 'participant',
        attendance_status: 'invited',
        attendance_method: 'manual',
        check_in_time: '',
        check_out_time: '',
    });

    // 3. Minute Form
    const minuteForm = useForm({
        meeting_id: meeting.id,
        version: 1,
        summary: '',
        decisions: '',
        next_actions: '',
        prepared_by_id: employees[0]?.id || '',
        approved_by_id: employees[0]?.id || '',
        is_final: false,
    });

    // 4. Document Form
    const documentForm = useForm({
        meeting_id: meeting.id,
        title: '',
        document_type: 'photo',
        file_path: 'uploads/docs/meeting_' + meeting.id + '_' + Date.now(),
        uploaded_by_id: employees[0]?.id || '',
        uploaded_by: employees[0]?.id || '',
        uploaded_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });

    // 5. Refreshment Form
    const refreshmentForm = useForm({
        meeting_id: meeting.id,
        requested_by_id: employees[0]?.id || '',
        requested_by: employees[0]?.id || '',
        approved_by_id: employees[0]?.id || '',
        approved_by: employees[0]?.id || '',
        request_date: new Date().toISOString().split('T')[0],
        participant_count: 5,
        notes: '',
        status: 'draft',
    });

    // 5b. Refreshment Item Form
    const itemForm = useForm({
        meeting_refreshment_request_id: '',
        item_name: '',
        quantity: 1,
        estimated_cost: 0,
        notes: '',
    });

    // 6. Action Item Form
    const actionForm = useForm({
        meeting_id: meeting.id,
        title: '',
        description: '',
        assigned_to_id: employees[0]?.id || '',
        assigned_to: employees[0]?.id || '',
        due_date: '',
        status: 'open',
    });

    // Submit handlers
    const submitParticipant = (e: FormEvent) => {
        e.preventDefault();
        participantForm.post(storeMeetingParticipant.url(), {
            headers: { 'X-Inertia': 'true' },
            onSuccess: () => {
                setShowParticipantModal(false);
                participantForm.reset();
            },
        });
    };

    const submitExtParticipant = (e: FormEvent) => {
        e.preventDefault();
        extParticipantForm.post(storeMeetingExternalParticipant.url(), {
            headers: { 'X-Inertia': 'true' },
            onSuccess: () => {
                setShowExtParticipantModal(false);
                extParticipantForm.reset();
            },
        });
    };

    const submitMinute = (e: FormEvent) => {
        e.preventDefault();
        minuteForm.post(storeMeetingMinute.url(), {
            headers: { 'X-Inertia': 'true' },
            onSuccess: () => {
                setShowMinuteModal(false);
                minuteForm.reset();
            },
        });
    };

    const submitDocument = (e: FormEvent) => {
        e.preventDefault();
        documentForm.post(storeMeetingDocument.url(), {
            headers: { 'X-Inertia': 'true' },
            onSuccess: () => {
                setShowDocumentModal(false);
                documentForm.reset();
            },
        });
    };

    const submitRefreshment = (e: FormEvent) => {
        e.preventDefault();
        refreshmentForm.post(storeMeetingRefreshmentRequest.url(), {
            headers: { 'X-Inertia': 'true' },
            onSuccess: () => {
                setShowRefreshmentModal(false);
                refreshmentForm.reset();
            },
        });
    };

    const submitItem = (e: FormEvent) => {
        e.preventDefault();
        itemForm.post(storeMeetingRefreshmentItem.url(), {
            headers: { 'X-Inertia': 'true' },
            onSuccess: () => {
                setShowItemModal(false);
                itemForm.reset();
            },
        });
    };

    const submitAction = (e: FormEvent) => {
        e.preventDefault();
        actionForm.post(storeMeetingActionItem.url(), {
            headers: { 'X-Inertia': 'true' },
            onSuccess: () => {
                setShowActionModal(false);
                actionForm.reset();
            },
        });
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Meeting Cockpit - :title', { title: meeting.title })}
            />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={meetingsIndex.url()}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {meeting.title}
                        </h1>
                        {meeting.is_confidential && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-900/35 dark:text-rose-400">
                                <Shield className="h-3.5 w-3.5" />{' '}
                                {__('Confidential')}
                            </span>
                        )}
                    </div>
                    {meeting.committee && (
                        <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
                            {__('Under Committee: :title', {
                                title: meeting.committee.title,
                            })}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Sidebar Details Card */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="border-b pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                            {__('Schedule Details')}
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {new Date(
                                        meeting.meeting_date,
                                    ).toLocaleDateString(intlLocale(), {
                                        dateStyle: 'medium',
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {meeting.start_time.substring(0, 5)} -{' '}
                                    {meeting.end_time.substring(0, 5)}
                                </span>
                            </div>

                            <div className="flex items-start gap-2.5 text-zinc-700 dark:text-zinc-300">
                                {meeting.meeting_type === 'offline' ? (
                                    <>
                                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {meeting.room?.name ||
                                                __('Assigned Room')}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="font-medium capitalize">
                                                {label(meeting.meeting_type)}
                                            </span>
                                            {meeting.online_platform && (
                                                <span className="text-xs text-muted-foreground">
                                                    {meeting.online_platform}
                                                </span>
                                            )}
                                            {meeting.online_link && (
                                                <a
                                                    href={meeting.online_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-1 text-xs break-all text-indigo-600 hover:underline dark:text-indigo-400"
                                                >
                                                    {__('Join Meeting Link')}
                                                </a>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4 text-sm dark:border-zinc-800">
                            <span className="text-muted-foreground">
                                {__('Status')}
                            </span>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide capitalize ${meeting.status === 'scheduled' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${meeting.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} ${meeting.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400' : ''} ${meeting.status === 'draft' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' : ''} `}
                            >
                                {label(meeting.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Cockpit Workspace */}
                <div className="space-y-6 lg:col-span-3">
                    <div className="flex border-b dark:border-zinc-800">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`-mb-[2px] flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'overview'
                                    ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                                    : 'border-transparent text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            <FileText className="h-4 w-4" />{' '}
                            {__('Minutes & Overview')}
                        </button>
                        <button
                            onClick={() => setActiveTab('participants')}
                            className={`-mb-[2px] flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'participants'
                                    ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                                    : 'border-transparent text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            <Users className="h-4 w-4" /> {__('Participants')}
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`-mb-[2px] flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'documents'
                                    ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                                    : 'border-transparent text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            <File className="h-4 w-4" /> {__('Documents')}
                        </button>
                        <button
                            onClick={() => setActiveTab('refreshments')}
                            className={`-mb-[2px] flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'refreshments'
                                    ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                                    : 'border-transparent text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            <Coffee className="h-4 w-4" /> {__('Refreshments')}
                        </button>
                        <button
                            onClick={() => setActiveTab('actions')}
                            className={`-mb-[2px] flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                                activeTab === 'actions'
                                    ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                                    : 'border-transparent text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            <CheckSquare className="h-4 w-4" />{' '}
                            {__('Action Items')}
                        </button>
                    </div>

                    <div className="space-y-6 pt-2">
                        {/* Tab 1: Overview & Minutes */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        {__('Agenda')}
                                    </h3>
                                    <p className="leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                        {meeting.agenda ||
                                            __('No agenda detailed yet.')}
                                    </p>
                                </div>

                                <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            {__('Meeting Minutes')}
                                        </h3>
                                        <Button
                                            onClick={() =>
                                                setShowMinuteModal(true)
                                            }
                                            size="sm"
                                            className="cursor-pointer gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                                        >
                                            <Plus className="h-4 w-4" />{' '}
                                            {__('Add Minutes')}
                                        </Button>
                                    </div>

                                    {meeting.meeting_minutes &&
                                    meeting.meeting_minutes.length > 0 ? (
                                        <div className="space-y-4">
                                            {meeting.meeting_minutes.map(
                                                (min) => (
                                                    <div
                                                        key={min.id}
                                                        className="relative space-y-3 rounded-xl border bg-zinc-50/20 p-5 dark:border-zinc-800 dark:bg-zinc-950/20"
                                                    >
                                                        <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
                                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                                {__(
                                                                    'Version :version',
                                                                    {
                                                                        version:
                                                                            min.version,
                                                                    },
                                                                )}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                {min.is_final ? (
                                                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400">
                                                                        {__(
                                                                            'Final',
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-950/35 dark:text-amber-400">
                                                                        {__(
                                                                            'Draft',
                                                                        )}
                                                                    </span>
                                                                )}
                                                                <Button
                                                                    onClick={() =>
                                                                        handleDeleteResource(
                                                                            'meeting-minute',
                                                                            min.id,
                                                                        )
                                                                    }
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-7 w-7 cursor-pointer text-rose-500"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                                            <div>
                                                                <strong className="block text-xs tracking-wider text-muted-foreground uppercase">
                                                                    {__(
                                                                        'Summary',
                                                                    )}
                                                                </strong>
                                                                <p className="mt-1 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                                                    {
                                                                        min.summary
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <strong className="block text-xs tracking-wider text-muted-foreground uppercase">
                                                                    {__(
                                                                        'Decisions Made',
                                                                    )}
                                                                </strong>
                                                                <p className="mt-1 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                                                    {min.decisions ||
                                                                        '-'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="py-4 text-sm text-muted-foreground">
                                            {__(
                                                'No meeting minutes created yet.',
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Participants */}
                        {activeTab === 'participants' && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Internal Participants */}
                                <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            {__('Internal Participants')}
                                        </h3>
                                        <Button
                                            onClick={() =>
                                                setShowParticipantModal(true)
                                            }
                                            size="sm"
                                            className="cursor-pointer gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                                        >
                                            <Plus className="h-3.5 w-3.5" />{' '}
                                            {__('Add')}
                                        </Button>
                                    </div>

                                    {meeting.meeting_participants &&
                                    meeting.meeting_participants.length > 0 ? (
                                        <div className="divide-y dark:divide-zinc-800">
                                            {meeting.meeting_participants.map(
                                                (part) => (
                                                    <div
                                                        key={part.id}
                                                        className="flex items-center justify-between py-3"
                                                    >
                                                        <div>
                                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                                {part.user
                                                                    ?.name ||
                                                                    __(
                                                                        'User ID: :id',
                                                                        {
                                                                            id: part.user_id,
                                                                        },
                                                                    )}
                                                            </span>
                                                            <div className="mt-1 flex gap-2">
                                                                <span className="text-xs text-indigo-600 capitalize dark:text-indigo-400">
                                                                    {label(
                                                                        part.role,
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={`text-xs capitalize ${part.attendance_status === 'attended' ? 'font-semibold text-emerald-600' : 'text-muted-foreground'}`}
                                                                >
                                                                    {label(
                                                                        part.attendance_status,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() =>
                                                                handleDeleteResource(
                                                                    'meeting-participant',
                                                                    part.id,
                                                                )
                                                            }
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 cursor-pointer text-rose-500 hover:text-rose-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="py-4 text-sm text-muted-foreground">
                                            {__(
                                                'No internal participants assigned.',
                                            )}
                                        </p>
                                    )}
                                </div>

                                {/* External Participants */}
                                <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            {__('External Participants')}
                                        </h3>
                                        <Button
                                            onClick={() =>
                                                setShowExtParticipantModal(true)
                                            }
                                            size="sm"
                                            className="cursor-pointer gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                                        >
                                            <Plus className="h-3.5 w-3.5" />{' '}
                                            {__('Add')}
                                        </Button>
                                    </div>

                                    {meeting.meeting_external_participants &&
                                    meeting.meeting_external_participants
                                        .length > 0 ? (
                                        <div className="divide-y dark:divide-zinc-800">
                                            {meeting.meeting_external_participants.map(
                                                (part) => (
                                                    <div
                                                        key={part.id}
                                                        className="flex items-center justify-between py-3"
                                                    >
                                                        <div>
                                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                                {part.name}
                                                            </span>
                                                            {part.institution && (
                                                                <span className="block text-xs text-muted-foreground">
                                                                    {
                                                                        part.institution
                                                                    }
                                                                </span>
                                                            )}
                                                            <div className="mt-1 flex gap-2">
                                                                <span className="text-xs text-indigo-600 capitalize dark:text-indigo-400">
                                                                    {label(
                                                                        part.role,
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={`text-xs capitalize ${part.attendance_status === 'attended' ? 'font-semibold text-emerald-600' : 'text-muted-foreground'}`}
                                                                >
                                                                    {label(
                                                                        part.attendance_status,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() =>
                                                                handleDeleteResource(
                                                                    'meeting-external-participant',
                                                                    part.id,
                                                                )
                                                            }
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 cursor-pointer text-rose-500 hover:text-rose-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="py-4 text-sm text-muted-foreground">
                                            {__(
                                                'No external participants assigned.',
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Documents */}
                        {activeTab === 'documents' && (
                            <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        {__('Meeting Documents')}
                                    </h3>
                                    <Button
                                        onClick={() =>
                                            setShowDocumentModal(true)
                                        }
                                        size="sm"
                                        className="cursor-pointer gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                                    >
                                        <Plus className="h-4 w-4" />{' '}
                                        {__('Add Document')}
                                    </Button>
                                </div>

                                {meeting.meeting_documents &&
                                meeting.meeting_documents.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {meeting.meeting_documents.map(
                                            (doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="flex items-center justify-between rounded-xl border bg-zinc-50/20 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/20 dark:hover:bg-zinc-900"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                                        <div>
                                                            <span className="text-zinc-850 dark:text-zinc-150 block font-semibold">
                                                                {doc.title}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground uppercase">
                                                                {label(
                                                                    doc.document_type,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            handleDeleteResource(
                                                                'meeting-document',
                                                                doc.id,
                                                            )
                                                        }
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 cursor-pointer text-rose-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-4 text-sm text-muted-foreground">
                                        {__(
                                            'No documents uploaded for this meeting.',
                                        )}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Tab 4: Refreshments */}
                        {activeTab === 'refreshments' && (
                            <div className="space-y-6 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        {__('Refreshment Requests')}
                                    </h3>
                                    <Button
                                        onClick={() =>
                                            setShowRefreshmentModal(true)
                                        }
                                        size="sm"
                                        className="cursor-pointer gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                                    >
                                        <Plus className="h-4 w-4" />{' '}
                                        {__('Create Request')}
                                    </Button>
                                </div>

                                {meeting.meeting_refreshment_requests &&
                                meeting.meeting_refreshment_requests.length >
                                    0 ? (
                                    <div className="space-y-6">
                                        {meeting.meeting_refreshment_requests.map(
                                            (req) => (
                                                <div
                                                    key={req.id}
                                                    className="space-y-4 rounded-2xl border bg-zinc-50/20 p-5 dark:border-zinc-800 dark:bg-zinc-950/20"
                                                >
                                                    <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} ${req.status === 'fulfilled' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400' : ''} ${req.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400' : ''} ${req.status === 'rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400' : ''} ${req.status === 'draft' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' : ''} `}
                                                            >
                                                                {label(
                                                                    req.status,
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {__(
                                                                    'Date: :date',
                                                                    {
                                                                        date: new Date(
                                                                            req.request_date,
                                                                        ).toLocaleDateString(
                                                                            intlLocale(),
                                                                        ),
                                                                    },
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {__(
                                                                    'Count: :count pax',
                                                                    {
                                                                        count: req.participant_count,
                                                                    },
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                onClick={() => {
                                                                    setSelectedRequestForItems(
                                                                        req.id,
                                                                    );
                                                                    itemForm.setData(
                                                                        'meeting_refreshment_request_id',
                                                                        req.id,
                                                                    );
                                                                    setShowItemModal(
                                                                        true,
                                                                    );
                                                                }}
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 cursor-pointer gap-1 text-xs"
                                                            >
                                                                <Plus className="h-3 w-3" />{' '}
                                                                {__('Add Item')}
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    handleDeleteResource(
                                                                        'meeting-refreshment-request',
                                                                        req.id,
                                                                    )
                                                                }
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 cursor-pointer text-rose-500"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Items List */}
                                                    <div>
                                                        <h5 className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                            {__(
                                                                'Requested Items',
                                                            )}
                                                        </h5>
                                                        {req.meeting_refreshment_items &&
                                                        req
                                                            .meeting_refreshment_items
                                                            .length > 0 ? (
                                                            <div className="divide-y overflow-hidden rounded-xl border bg-white text-xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                                                                {req.meeting_refreshment_items.map(
                                                                    (item) => (
                                                                        <div
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="flex items-center justify-between p-3"
                                                                        >
                                                                            <div>
                                                                                <strong className="text-zinc-800 dark:text-zinc-200">
                                                                                    {
                                                                                        item.item_name
                                                                                    }
                                                                                </strong>
                                                                                <span className="ml-2 text-muted-foreground">
                                                                                    {__(
                                                                                        'Qty: :quantity',
                                                                                        {
                                                                                            quantity:
                                                                                                item.quantity,
                                                                                        },
                                                                                    )}
                                                                                </span>
                                                                                {item.estimated_cost && (
                                                                                    <span className="ml-2 text-muted-foreground">
                                                                                        {__(
                                                                                            'Cost: $:cost',
                                                                                            {
                                                                                                cost: item.estimated_cost,
                                                                                            },
                                                                                        )}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    handleDeleteResource(
                                                                                        'meeting-refreshment-item',
                                                                                        item.id,
                                                                                    )
                                                                                }
                                                                                size="icon"
                                                                                variant="ghost"
                                                                                className="h-6 w-6 cursor-pointer text-rose-500 hover:text-rose-700"
                                                                            >
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-muted-foreground italic">
                                                                {__(
                                                                    'No items added to this request yet.',
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-4 text-sm text-muted-foreground">
                                        {__('No refreshment requests filed.')}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Tab 5: Action Items */}
                        {activeTab === 'actions' && (
                            <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        {__('Meeting Action Items')}
                                    </h3>
                                    <Button
                                        onClick={() => setShowActionModal(true)}
                                        size="sm"
                                        className="cursor-pointer gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                                    >
                                        <Plus className="h-4 w-4" />{' '}
                                        {__('Add Action Item')}
                                    </Button>
                                </div>

                                {meeting.meeting_action_items &&
                                meeting.meeting_action_items.length > 0 ? (
                                    <div className="space-y-4">
                                        {meeting.meeting_action_items.map(
                                            (act) => (
                                                <div
                                                    key={act.id}
                                                    className="flex items-center justify-between rounded-xl border bg-zinc-50/20 p-4 dark:border-zinc-800 dark:bg-zinc-950/20"
                                                >
                                                    <div className="space-y-1">
                                                        <span className="text-zinc-850 dark:text-zinc-150 font-semibold">
                                                            {act.title}
                                                        </span>
                                                        {act.description && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    act.description
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>
                                                                {__(
                                                                    'Assignee: :name',
                                                                    {
                                                                        name:
                                                                            act
                                                                                .assignee
                                                                                ?.name ||
                                                                            __(
                                                                                'Unassigned',
                                                                            ),
                                                                    },
                                                                )}
                                                            </span>
                                                            {act.due_date && (
                                                                <span>
                                                                    •{' '}
                                                                    {__(
                                                                        'Due: :date',
                                                                        {
                                                                            date: new Date(
                                                                                act.due_date,
                                                                            ).toLocaleDateString(
                                                                                intlLocale(),
                                                                            ),
                                                                        },
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${act.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400' : ''} ${act.status === 'in_progress' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400' : ''} ${act.status === 'cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400' : ''} ${act.status === 'open' ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' : ''} `}
                                                        >
                                                            {label(act.status)}
                                                        </span>
                                                        <Button
                                                            onClick={() =>
                                                                handleDeleteResource(
                                                                    'meeting-action-item',
                                                                    act.id,
                                                                )
                                                            }
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 cursor-pointer text-rose-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p className="py-4 text-sm text-muted-foreground">
                                        {__('No action items created yet.')}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS */}

            {/* 1. Internal Participant Modal */}
            {showParticipantModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {__('Add Internal Participant')}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => setShowParticipantModal(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form
                            onSubmit={submitParticipant}
                            className="space-y-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="user_id">{__('User *')}</Label>
                                <select
                                    id="user_id"
                                    value={participantForm.data.user_id}
                                    onChange={(e) =>
                                        participantForm.setData(
                                            'user_id',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                >
                                    <option value="">
                                        {__('Select User')}
                                    </option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="role">{__('Role *')}</Label>
                                    <select
                                        id="role"
                                        value={participantForm.data.role}
                                        onChange={(e) =>
                                            participantForm.setData(
                                                'role',
                                                e.target.value as any,
                                            )
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        <option value="participant">
                                            {__('Participant')}
                                        </option>
                                        <option value="moderator">
                                            {__('Moderator')}
                                        </option>
                                        <option value="speaker">
                                            {__('Speaker')}
                                        </option>
                                        <option value="note_taker">
                                            {__('Note Taker')}
                                        </option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="attendance_status">
                                        {__('Status *')}
                                    </Label>
                                    <select
                                        id="attendance_status"
                                        value={
                                            participantForm.data
                                                .attendance_status
                                        }
                                        onChange={(e) =>
                                            participantForm.setData(
                                                'attendance_status',
                                                e.target.value as any,
                                            )
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        <option value="invited">
                                            {__('Invited')}
                                        </option>
                                        <option value="attended">
                                            {__('Attended')}
                                        </option>
                                        <option value="absent">
                                            {__('Absent')}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 border-t pt-3 dark:border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setShowParticipantModal(false)
                                    }
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={participantForm.processing}
                                    className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                >
                                    {__('Save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. External Participant Modal */}
            {showExtParticipantModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {__('Add External Participant')}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() =>
                                    setShowExtParticipantModal(false)
                                }
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form
                            onSubmit={submitExtParticipant}
                            className="space-y-4"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="ext_name">{__('Name *')}</Label>
                                <Input
                                    id="ext_name"
                                    value={extParticipantForm.data.name}
                                    onChange={(e) =>
                                        extParticipantForm.setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ext_institution">
                                    {__('Institution')}
                                </Label>
                                <Input
                                    id="ext_institution"
                                    value={extParticipantForm.data.institution}
                                    onChange={(e) =>
                                        extParticipantForm.setData(
                                            'institution',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="ext_email">
                                        {__('Email')}
                                    </Label>
                                    <Input
                                        id="ext_email"
                                        type="email"
                                        value={extParticipantForm.data.email}
                                        onChange={(e) =>
                                            extParticipantForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ext_phone">
                                        {__('Phone')}
                                    </Label>
                                    <Input
                                        id="ext_phone"
                                        value={extParticipantForm.data.phone}
                                        onChange={(e) =>
                                            extParticipantForm.setData(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="ext_role">
                                        {__('Role *')}
                                    </Label>
                                    <select
                                        id="ext_role"
                                        value={extParticipantForm.data.role}
                                        onChange={(e) =>
                                            extParticipantForm.setData(
                                                'role',
                                                e.target.value as any,
                                            )
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        <option value="participant">
                                            {__('Participant')}
                                        </option>
                                        <option value="speaker">
                                            {__('Speaker')}
                                        </option>
                                        <option value="guest">
                                            {__('Guest')}
                                        </option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ext_attendance_status">
                                        {__('Status *')}
                                    </Label>
                                    <select
                                        id="ext_attendance_status"
                                        value={
                                            extParticipantForm.data
                                                .attendance_status
                                        }
                                        onChange={(e) =>
                                            extParticipantForm.setData(
                                                'attendance_status',
                                                e.target.value as any,
                                            )
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        <option value="invited">
                                            {__('Invited')}
                                        </option>
                                        <option value="attended">
                                            {__('Attended')}
                                        </option>
                                        <option value="absent">
                                            {__('Absent')}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 border-t pt-3 dark:border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setShowExtParticipantModal(false)
                                    }
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={extParticipantForm.processing}
                                    className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                >
                                    {__('Save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Minute Modal */}
            {showMinuteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg space-y-4 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {__('Create Meeting Minutes')}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => setShowMinuteModal(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={submitMinute} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="version">
                                        {__('Version *')}
                                    </Label>
                                    <Input
                                        id="version"
                                        type="number"
                                        value={minuteForm.data.version}
                                        onChange={(e) =>
                                            minuteForm.setData(
                                                'version',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        id="is_final"
                                        type="checkbox"
                                        checked={minuteForm.data.is_final}
                                        onChange={(e) =>
                                            minuteForm.setData(
                                                'is_final',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <Label
                                        htmlFor="is_final"
                                        className="cursor-pointer"
                                    >
                                        {__('This is the final version')}
                                    </Label>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">
                                    {__('Summary *')}
                                </Label>
                                <Textarea
                                    id="summary"
                                    value={minuteForm.data.summary}
                                    onChange={(e) =>
                                        minuteForm.setData(
                                            'summary',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'Brief summary of discussion...',
                                    )}
                                    required
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="decisions">
                                    {__('Decisions Made')}
                                </Label>
                                <Textarea
                                    id="decisions"
                                    value={minuteForm.data.decisions}
                                    onChange={(e) =>
                                        minuteForm.setData(
                                            'decisions',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('List decisions here...')}
                                    rows={2}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="next_actions">
                                    {__('Next Actions')}
                                </Label>
                                <Textarea
                                    id="next_actions"
                                    value={minuteForm.data.next_actions}
                                    onChange={(e) =>
                                        minuteForm.setData(
                                            'next_actions',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'List follow up task descriptions...',
                                    )}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="prepared_by_id">
                                        {__('Prepared By *')}
                                    </Label>
                                    <select
                                        id="prepared_by_id"
                                        value={minuteForm.data.prepared_by_id}
                                        onChange={(e) => {
                                            minuteForm.setData(
                                                'prepared_by_id',
                                                e.target.value,
                                            );
                                        }}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="approved_by_id">
                                        {__('Approved By *')}
                                    </Label>
                                    <select
                                        id="approved_by_id"
                                        value={minuteForm.data.approved_by_id}
                                        onChange={(e) => {
                                            minuteForm.setData(
                                                'approved_by_id',
                                                e.target.value,
                                            );
                                        }}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 border-t pt-3 dark:border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setShowMinuteModal(false)}
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={minuteForm.processing}
                                    className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                >
                                    {__('Save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 4. Document Modal */}
            {showDocumentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {__('Upload Document')}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => setShowDocumentModal(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={submitDocument} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="doc_title">
                                    {__('Title *')}
                                </Label>
                                <Input
                                    id="doc_title"
                                    value={documentForm.data.title}
                                    onChange={(e) =>
                                        documentForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('Document Title')}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="document_type">
                                    {__('Document Type *')}
                                </Label>
                                <select
                                    id="document_type"
                                    value={documentForm.data.document_type}
                                    onChange={(e) =>
                                        documentForm.setData(
                                            'document_type',
                                            e.target.value as any,
                                        )
                                    }
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                >
                                    <option value="photo">{__('Photo')}</option>
                                    <option value="minutes">
                                        {__('Minutes')}
                                    </option>
                                    <option value="presentation">
                                        {__('Presentation')}
                                    </option>
                                    <option value="recording">
                                        {__('Recording')}
                                    </option>
                                    <option value="attendance">
                                        {__('Attendance Sheet')}
                                    </option>
                                    <option value="other">{__('Other')}</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="file_path">
                                    {__('File Name / Path Mock *')}
                                </Label>
                                <Input
                                    id="file_path"
                                    value={documentForm.data.file_path}
                                    onChange={(e) =>
                                        documentForm.setData(
                                            'file_path',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="uploaded_by_id">
                                    {__('Uploader *')}
                                </Label>
                                <select
                                    id="uploaded_by_id"
                                    value={documentForm.data.uploaded_by_id}
                                    onChange={(e) => {
                                        documentForm.setData(
                                            'uploaded_by_id',
                                            e.target.value,
                                        );
                                        documentForm.setData(
                                            'uploaded_by',
                                            e.target.value,
                                        );
                                    }}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                >
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 border-t pt-3 dark:border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setShowDocumentModal(false)}
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={documentForm.processing}
                                    className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                >
                                    {__('Upload')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. Refreshment Modal */}
            {showRefreshmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {__('Request Refreshments')}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => setShowRefreshmentModal(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form
                            onSubmit={submitRefreshment}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="request_date">
                                        {__('Request Date *')}
                                    </Label>
                                    <Input
                                        id="request_date"
                                        type="date"
                                        value={
                                            refreshmentForm.data.request_date
                                        }
                                        onChange={(e) =>
                                            refreshmentForm.setData(
                                                'request_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="participant_count">
                                        {__('Count (Pax) *')}
                                    </Label>
                                    <Input
                                        id="participant_count"
                                        type="number"
                                        value={
                                            refreshmentForm.data
                                                .participant_count
                                        }
                                        onChange={(e) =>
                                            refreshmentForm.setData(
                                                'participant_count',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ref_notes">{__('Notes')}</Label>
                                <Textarea
                                    id="ref_notes"
                                    value={refreshmentForm.data.notes}
                                    onChange={(e) =>
                                        refreshmentForm.setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'Dietary restrictions, food preferences...',
                                    )}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="requested_by_id">
                                        {__('Requested By *')}
                                    </Label>
                                    <select
                                        id="requested_by_id"
                                        value={
                                            refreshmentForm.data.requested_by_id
                                        }
                                        onChange={(e) => {
                                            refreshmentForm.setData(
                                                'requested_by_id',
                                                e.target.value,
                                            );
                                            refreshmentForm.setData(
                                                'requested_by',
                                                e.target.value,
                                            );
                                        }}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ref_status">
                                        {__('Status *')}
                                    </Label>
                                    <select
                                        id="ref_status"
                                        value={refreshmentForm.data.status}
                                        onChange={(e) =>
                                            refreshmentForm.setData(
                                                'status',
                                                e.target.value as any,
                                            )
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        <option value="draft">
                                            {__('Draft')}
                                        </option>
                                        <option value="pending">
                                            {__('Pending')}
                                        </option>
                                        <option value="approved">
                                            {__('Approved')}
                                        </option>
                                        <option value="rejected">
                                            {__('Rejected')}
                                        </option>
                                        <option value="fulfilled">
                                            {__('Fulfilled')}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 border-t pt-3 dark:border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setShowRefreshmentModal(false)
                                    }
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={refreshmentForm.processing}
                                    className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                >
                                    {__('Save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5b. Refreshment Item Modal */}
            {showItemModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {__('Add Refreshment Item')}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => setShowItemModal(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={submitItem} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="item_name">
                                    {__('Item Name *')}
                                </Label>
                                <Input
                                    id="item_name"
                                    value={itemForm.data.item_name}
                                    onChange={(e) =>
                                        itemForm.setData(
                                            'item_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'e.g. Box Lunch, Coffee, Snacks',
                                    )}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">
                                        {__('Quantity *')}
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={itemForm.data.quantity}
                                        onChange={(e) =>
                                            itemForm.setData(
                                                'quantity',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="estimated_cost">
                                        {__('Estimated Cost ($)')}
                                    </Label>
                                    <Input
                                        id="estimated_cost"
                                        type="number"
                                        step="0.01"
                                        value={itemForm.data.estimated_cost}
                                        onChange={(e) =>
                                            itemForm.setData(
                                                'estimated_cost',
                                                parseFloat(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="item_notes">
                                    {__('Notes')}
                                </Label>
                                <Textarea
                                    id="item_notes"
                                    value={itemForm.data.notes}
                                    onChange={(e) =>
                                        itemForm.setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__(
                                        'Special instructions for this item...',
                                    )}
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end gap-3 border-t pt-3 dark:border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setShowItemModal(false)}
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={itemForm.processing}
                                    className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                >
                                    {__('Save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 6. Action Item Modal */}
            {showActionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {__('Add Action Item')}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => setShowActionModal(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={submitAction} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="act_title">
                                    {__('Task / Action *')}
                                </Label>
                                <Input
                                    id="act_title"
                                    value={actionForm.data.title}
                                    onChange={(e) =>
                                        actionForm.setData(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('Action title...')}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="act_description">
                                    {__('Description')}
                                </Label>
                                <Textarea
                                    id="act_description"
                                    value={actionForm.data.description}
                                    onChange={(e) =>
                                        actionForm.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={__('What needs to be done...')}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date">
                                        {__('Due Date')}
                                    </Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={actionForm.data.due_date}
                                        onChange={(e) =>
                                            actionForm.setData(
                                                'due_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="act_status">
                                        {__('Status *')}
                                    </Label>
                                    <select
                                        id="act_status"
                                        value={actionForm.data.status}
                                        onChange={(e) =>
                                            actionForm.setData(
                                                'status',
                                                e.target.value as any,
                                            )
                                        }
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                    >
                                        <option value="open">
                                            {__('Open')}
                                        </option>
                                        <option value="in_progress">
                                            {__('In Progress')}
                                        </option>
                                        <option value="completed">
                                            {__('Completed')}
                                        </option>
                                        <option value="cancelled">
                                            {__('Cancelled')}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="assigned_to_id">
                                    {__('Assignee *')}
                                </Label>
                                <select
                                    id="assigned_to_id"
                                    value={actionForm.data.assigned_to_id}
                                    onChange={(e) => {
                                        actionForm.setData(
                                            'assigned_to_id',
                                            e.target.value,
                                        );
                                        actionForm.setData(
                                            'assigned_to',
                                            e.target.value,
                                        );
                                    }}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                                >
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 border-t pt-3 dark:border-zinc-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => setShowActionModal(false)}
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={actionForm.processing}
                                    className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                >
                                    {__('Save')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
