import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { index as overtimeIndex } from '@/actions/App/Http/Controllers/Hr/OvertimeRequestController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
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
import type { Auth, Employee } from '@/types';

interface PageProps {
    auth: Auth;
    employees: Employee[];
}

export default function OvertimeRequestCreate({ employees }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        request_number: `OT-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0')}`,
        title: '',
        description: '',
        request_date: new Date().toISOString().split('T')[0],
        planned_start_time: '',
        planned_end_time: '',
        submitted_by: '',
        members: [
            { employee_id: '', role: '', job_desc: '', planned_hours: 1 },
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/overtime-requests');
    };

    return (
        <>
            <Head title="New Overtime Request" />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Back to Overtime Requests"
                    >
                        <Link href={overtimeIndex().url}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="New Overtime Request"
                        description="Create a new overtime request with multiple members."
                    />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-8">
                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <h3 className="border-b pb-2 text-lg font-semibold">
                            Request Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="request_number">
                                    Request Number
                                </Label>
                                <Input
                                    id="request_number"
                                    value={data.request_number}
                                    readOnly
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="request_date">
                                    Request Date
                                </Label>
                                <Input
                                    id="request_date"
                                    type="date"
                                    value={data.request_date}
                                    onChange={(e) =>
                                        setData('request_date', e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="planned_start_time">
                                    Planned Start
                                </Label>
                                <Input
                                    id="planned_start_time"
                                    type="datetime-local"
                                    value={data.planned_start_time}
                                    onChange={(e) =>
                                        setData(
                                            'planned_start_time',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {errors.planned_start_time && (
                                    <p className="text-sm text-destructive">
                                        {errors.planned_start_time}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="planned_end_time">
                                    Planned End
                                </Label>
                                <Input
                                    id="planned_end_time"
                                    type="datetime-local"
                                    value={data.planned_end_time}
                                    onChange={(e) =>
                                        setData(
                                            'planned_end_time',
                                            e.target.value,
                                        )
                                    }
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
                            <Label htmlFor="submitted_by">
                                Submitted By (Manager/Supervisor)
                            </Label>
                            <Select
                                onValueChange={(val) =>
                                    setData('submitted_by', val)
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
                            {errors.submitted_by && (
                                <p className="text-sm text-destructive">
                                    {errors.submitted_by}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 rounded-lg border bg-card p-6">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-lg font-semibold">Members</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addMember}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Member
                            </Button>
                        </div>

                        {data.members.map((member, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 items-end gap-4 border-b pb-4 last:border-0 last:pb-0"
                            >
                                <div className="col-span-4 grid gap-2">
                                    <Label>Employee</Label>
                                    <Select
                                        onValueChange={(val) =>
                                            updateMember(
                                                index,
                                                'employee_id',
                                                val,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees.map((emp) => (
                                                <SelectItem
                                                    key={emp.id}
                                                    value={emp.id}
                                                >
                                                    {emp.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-3 grid gap-2">
                                    <Label>Role</Label>
                                    <Input
                                        value={member.role}
                                        onChange={(e) =>
                                            updateMember(
                                                index,
                                                'role',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Lead"
                                    />
                                </div>
                                <div className="col-span-3 grid gap-2">
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
                                                parseFloat(e.target.value),
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeMember(index)}
                                        disabled={data.members.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <div className="col-span-12 grid gap-2">
                                    <Label>Job Description</Label>
                                    <Input
                                        value={member.job_desc || ''}
                                        onChange={(e) =>
                                            updateMember(
                                                index,
                                                'job_desc',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Specific tasks for this member"
                                    />
                                </div>
                            </div>
                        ))}
                        {errors.members && (
                            <p className="text-sm text-destructive">
                                {errors.members}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href={overtimeIndex().url}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Submit Overtime Request
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

OvertimeRequestCreate.layout = {
    breadcrumbs: [
        {
            title: 'Overtime Requests',
            href: overtimeIndex(),
        },
        {
            title: 'New Request',
            href: '#',
        },
    ],
};
