import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index as personalOvertimeIndex, store as personalOvertimeStore } from '@/routes/personal-overtime-requests';
import type { Auth, Employee } from '@/types';

interface PageProps {
    auth: Auth;
    employees: Employee[];
    currentEmployeeId: string;
}

export default function PersonalOvertimeRequestCreate({
    auth,
    employees,
    currentEmployeeId,
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        request_date: new Date().toISOString().split('T')[0],
        planned_start_time: '',
        planned_end_time: '',
        members: [
            { employee_id: currentEmployeeId || '', role: '', job_desc: '', planned_hours: 1 },
        ],
    });

    const addMember = () => {
        setData('members', [
            ...data.members,
            { employee_id: '', role: '', job_desc: '', planned_hours: 1 },
        ]);
    };

    const removeMember = (index: number) => {
        const newMembers = [...data.members];
        newMembers.splice(index, 1);
        setData('members', newMembers);
    };

    const updateMember = (index: number, field: string, value: any) => {
        const newMembers = [...data.members];
        (newMembers[index] as any)[field] = value;
        setData('members', newMembers);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(personalOvertimeStore().url);
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="New Overtime Request" />

            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={personalOvertimeIndex()}>
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        New Overtime Request
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Submit a new overtime request for approval.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl grid gap-6 md:grid-cols-2">
                <Card className="border dark:border-zinc-800 h-fit">
                    <CardContent className="pt-6 grid gap-6">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 border-b pb-2">
                            Request Details
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Purpose of overtime..."
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="request_date">Request Date</Label>
                                <Input
                                    id="request_date"
                                    type="date"
                                    value={data.request_date}
                                    onChange={(e) => setData('request_date', e.target.value)}
                                    required
                                />
                                {errors.request_date && (
                                    <p className="text-sm text-destructive">
                                        {errors.request_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="planned_start_time">Planned Start Time</Label>
                                <Input
                                    id="planned_start_time"
                                    type="datetime-local"
                                    value={data.planned_start_time}
                                    onChange={(e) => setData('planned_start_time', e.target.value)}
                                    required
                                />
                                {errors.planned_start_time && (
                                    <p className="text-sm text-destructive">
                                        {errors.planned_start_time}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="planned_end_time">Planned End Time</Label>
                                <Input
                                    id="planned_end_time"
                                    type="datetime-local"
                                    value={data.planned_end_time}
                                    onChange={(e) => setData('planned_end_time', e.target.value)}
                                    required
                                />
                                {errors.planned_end_time && (
                                    <p className="text-sm text-destructive">
                                        {errors.planned_end_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description / Reason</Label>
                            <Textarea
                                id="description"
                                placeholder="Explain detail tasks or justification..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card className="border dark:border-zinc-800">
                        <CardContent className="pt-6 grid gap-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    Team / Members
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addMember}
                                    className="cursor-pointer"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Member
                                </Button>
                            </div>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1">
                                {data.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-12 items-end gap-3 border-b pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="col-span-10 grid gap-2">
                                            <Label>Employee</Label>
                                            <Select
                                                value={member.employee_id}
                                                onValueChange={(val) =>
                                                    updateMember(index, 'employee_id', val)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select employee" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {employees.map((emp) => (
                                                        <SelectItem key={emp.id} value={emp.id}>
                                                            {emp.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMember(index)}
                                                disabled={data.members.length === 1}
                                                className="cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>

                                        <div className="col-span-8 grid gap-2">
                                            <Label>Role</Label>
                                            <Input
                                                value={member.role}
                                                onChange={(e) =>
                                                    updateMember(index, 'role', e.target.value)
                                                }
                                                placeholder="e.g. Developer, Support"
                                            />
                                        </div>
                                        <div className="col-span-4 grid gap-2">
                                            <Label>Planned Hours</Label>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                min="0.5"
                                                value={member.planned_hours}
                                                onChange={(e) =>
                                                    updateMember(
                                                        index,
                                                        'planned_hours',
                                                        parseFloat(e.target.value) || 0.5,
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-span-12 grid gap-2">
                                            <Label>Job Description</Label>
                                            <Input
                                                value={member.job_desc}
                                                onChange={(e) =>
                                                    updateMember(index, 'job_desc', e.target.value)
                                                }
                                                placeholder="Specific tasks during overtime"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.members && (
                                <p className="text-sm text-destructive font-semibold">
                                    {errors.members}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 border-t pt-4 dark:border-zinc-800">
                    <Link href={personalOvertimeIndex()}>
                        <Button type="button" variant="outline" className="cursor-pointer">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing} className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md gap-2">
                        <Save className="h-4 w-4" /> Submit Overtime Request
                    </Button>
                </div>
            </form>
        </div>
    );
}

PersonalOvertimeRequestCreate.layout = {
    breadcrumbs: [
        { title: 'Self-Service', href: '#' },
        { title: 'My Overtime Requests', href: personalOvertimeIndex() },
        { title: 'New Request', href: '#' },
    ],
};
