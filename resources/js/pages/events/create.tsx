import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { index, store } from '@/routes/events';

type Employee = {
    id: string;
    name: string;
};

type PageProps = {
    employees: Employee[];
};

export default function CreateEvent({ employees = [] }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        description: '',
        objectives: '',
        event_type: 'seminar',
        delivery_mode: 'offline',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        venue: '',
        online_platform: '',
        online_link: '',
        quota: '',
        registration_deadline: '',
        cover_image: '',
        banner_image: '',
        status: 'draft',
        created_by: employees[0]?.id || '',
        created_by_id: employees[0]?.id || '',
        published_by: '',
        published_by_id: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    const handleSelectOrganizer = (value: string) => {
        setData((prev) => ({
            ...prev,
            created_by: value,
            created_by_id: value,
        }));
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl space-y-6">
            <Head title="Create Event" />
            
            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={index.url()}>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                        Create Event
                    </h1>
                    <p className="text-muted-foreground mt-1">Schedule and publish a new event for the faculty.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. General Details */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Event Details</h2>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => {
                                setData('title', e.target.value);
                                // Auto-slugify
                                setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                            }}
                            required
                            placeholder="e.g. Guest Lecture: AI Ethics in Education"
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Event Code / Slug *</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            required
                            placeholder="e.g. ai-ethics-2026"
                        />
                        {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="event_type">Category / Event Type *</Label>
                            <select
                                id="event_type"
                                value={data.event_type}
                                onChange={(e) => setData('event_type', e.target.value as any)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                            >
                                <option value="seminar">Seminar</option>
                                <option value="workshop">Workshop</option>
                                <option value="training">Training</option>
                                <option value="conference">Conference</option>
                                <option value="webinar">Webinar</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.event_type && <p className="text-sm text-destructive">{errors.event_type}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="created_by">Organizer *</Label>
                            <select
                                id="created_by"
                                value={data.created_by}
                                onChange={(e) => handleSelectOrganizer(e.target.value)}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                            >
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                            {errors.created_by && <p className="text-sm text-destructive">{errors.created_by}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Describe what this event is about..."
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="objectives">Objectives</Label>
                        <Textarea
                            id="objectives"
                            value={data.objectives}
                            onChange={(e) => setData('objectives', e.target.value)}
                            placeholder="Key goals or targets of the event..."
                            rows={2}
                        />
                        {errors.objectives && <p className="text-sm text-destructive">{errors.objectives}</p>}
                    </div>
                </div>

                {/* 2. Schedule */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Schedule</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start Date *</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                required
                            />
                            {errors.start_date && <p className="text-sm text-destructive">{errors.start_date}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End Date *</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                required
                            />
                            {errors.end_date && <p className="text-sm text-destructive">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_time">Start Time</Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                            {errors.start_time && <p className="text-sm text-destructive">{errors.start_time}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_time">End Time</Label>
                            <Input
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                            {errors.end_time && <p className="text-sm text-destructive">{errors.end_time}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Location & Mode */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Venue & Mode</h2>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="delivery_mode">Delivery Mode *</Label>
                        <select
                            id="delivery_mode"
                            value={data.delivery_mode}
                            onChange={(e) => setData('delivery_mode', e.target.value as any)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background dark:border-zinc-800"
                        >
                            <option value="offline">Offline (In-person)</option>
                            <option value="online">Online (Remote)</option>
                            <option value="hybrid">Hybrid (Both)</option>
                        </select>
                        {errors.delivery_mode && <p className="text-sm text-destructive">{errors.delivery_mode}</p>}
                    </div>

                    {data.delivery_mode !== 'online' && (
                        <div className="grid gap-2">
                            <Label htmlFor="venue">Physical Venue *</Label>
                            <Input
                                id="venue"
                                value={data.venue}
                                onChange={(e) => setData('venue', e.target.value)}
                                required={data.delivery_mode !== 'online'}
                                placeholder="e.g. Auditorium Hall, 3rd Floor"
                            />
                            {errors.venue && <p className="text-sm text-destructive">{errors.venue}</p>}
                        </div>
                    )}

                    {data.delivery_mode !== 'offline' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="online_platform">Online Platform *</Label>
                                <Input
                                    id="online_platform"
                                    value={data.online_platform}
                                    onChange={(e) => setData('online_platform', e.target.value)}
                                    required={data.delivery_mode !== 'offline'}
                                    placeholder="e.g. Zoom, Google Meet"
                                />
                                {errors.online_platform && <p className="text-sm text-destructive">{errors.online_platform}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="online_link">Online Link</Label>
                                <Input
                                    id="online_link"
                                    value={data.online_link}
                                    onChange={(e) => setData('online_link', e.target.value)}
                                    placeholder="e.g. https://zoom.us/j/..."
                                />
                                {errors.online_link && <p className="text-sm text-destructive">{errors.online_link}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Registration & Media */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-xs space-y-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b pb-2 dark:border-zinc-800">Registration & Media</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quota">Capacity (Seats/Quota)</Label>
                            <Input
                                id="quota"
                                type="number"
                                value={data.quota}
                                onChange={(e) => setData('quota', e.target.value)}
                                placeholder="Unlimited"
                            />
                            {errors.quota && <p className="text-sm text-destructive">{errors.quota}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="registration_deadline">Registration Deadline</Label>
                            <Input
                                id="registration_deadline"
                                type="datetime-local"
                                value={data.registration_deadline}
                                onChange={(e) => setData('registration_deadline', e.target.value)}
                            />
                            {errors.registration_deadline && <p className="text-sm text-destructive">{errors.registration_deadline}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="banner_image">Banner Image / Poster URL</Label>
                        <Input
                            id="banner_image"
                            value={data.banner_image}
                            onChange={(e) => setData('banner_image', e.target.value)}
                            placeholder="e.g. https://example.com/banner.jpg"
                        />
                        {errors.banner_image && <p className="text-sm text-destructive">{errors.banner_image}</p>}
                    </div>
                </div>

                {/* Submit & Cancel */}
                <div className="flex justify-end gap-3 pt-4 border-t dark:border-zinc-800">
                    <Link href={index.url()}>
                        <Button type="button" variant="outline" className="cursor-pointer">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing} className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md">
                        <Save className="h-4 w-4" /> Save Event
                    </Button>
                </div>
            </form>
        </div>
    );
}
