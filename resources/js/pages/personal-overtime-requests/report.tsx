import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { __ } from '@/lib/i18n';
import {
    index as personalOvertimeIndex,
    show as personalOvertimeShow,
} from '@/routes/personal-overtime-requests';
import type { Auth } from '@/types';
import type { OvertimeRequest } from '@/types/overtime';

interface PageProps {
    auth: Auth;
    overtimeRequest: OvertimeRequest;
}

export default function PersonalOvertimeRequestReport({
    overtimeRequest,
}: PageProps) {
    const formatDateTimeLocal = (dateStr: string) => {
        if (!dateStr) {
            return '';
        }

        const d = new Date(dateStr);
        const tzOffset = d.getTimezoneOffset() * 60000;

        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    const initialMembers = overtimeRequest.members
        ? overtimeRequest.members.map((m) => ({
              id: m.id,
              employee_name: m.employee?.name || __('Unknown'),
              planned_hours: m.planned_hours,
              actual_start_time: formatDateTimeLocal(
                  overtimeRequest.planned_start_time,
              ),
              actual_end_time: formatDateTimeLocal(
                  overtimeRequest.planned_end_time,
              ),
              actual_hours:
                  typeof m.planned_hours === 'string'
                      ? parseFloat(m.planned_hours)
                      : m.planned_hours,
          }))
        : [];

    const { data, setData, post, processing, errors } = useForm({
        members: initialMembers,
    });

    const updateMemberField = (index: number, field: string, value: any) => {
        const updatedMembers = [...data.members];
        (updatedMembers[index] as any)[field] = value;
        setData('members', updatedMembers);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/personal-overtime-requests/${overtimeRequest.id}/complete`);
    };

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Submit Overtime Report - :number', {
                    number: overtimeRequest.request_number,
                })}
            />

            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link
                    href={personalOvertimeShow.url({
                        personal_overtime_request: overtimeRequest.id,
                    })}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Submit Overtime Report')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Provide actual hours and times for overtime request: :number',
                            { number: overtimeRequest.request_number },
                        )}
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mx-auto grid w-full max-w-3xl gap-6"
            >
                <Card className="border dark:border-zinc-800">
                    <CardContent className="grid gap-6 pt-6">
                        <div className="border-b pb-2">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                {__('Overtime Details')}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {__('Title: :title', {
                                    title: overtimeRequest.title,
                                })}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {data.members.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="grid grid-cols-1 items-end gap-4 border-b pb-6 last:border-0 last:pb-0 md:grid-cols-12"
                                >
                                    <div className="md:col-span-12">
                                        <Label className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                            {__('Employee: :name', {
                                                name: member.employee_name,
                                            })}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {__('Planned Hours: :hours hrs', {
                                                hours: member.planned_hours,
                                            })}
                                        </p>
                                    </div>

                                    <div className="grid gap-2 md:col-span-4">
                                        <Label htmlFor={`start-${index}`}>
                                            {__('Actual Start')}
                                        </Label>
                                        <Input
                                            id={`start-${index}`}
                                            type="datetime-local"
                                            value={member.actual_start_time}
                                            onChange={(e) =>
                                                updateMemberField(
                                                    index,
                                                    'actual_start_time',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors[
                                            `members.${index}.actual_start_time` as any
                                        ] && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors[
                                                        `members.${index}.actual_start_time` as any
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2 md:col-span-4">
                                        <Label htmlFor={`end-${index}`}>
                                            {__('Actual End')}
                                        </Label>
                                        <Input
                                            id={`end-${index}`}
                                            type="datetime-local"
                                            value={member.actual_end_time}
                                            onChange={(e) =>
                                                updateMemberField(
                                                    index,
                                                    'actual_end_time',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors[
                                            `members.${index}.actual_end_time` as any
                                        ] && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors[
                                                        `members.${index}.actual_end_time` as any
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2 md:col-span-4">
                                        <Label htmlFor={`hours-${index}`}>
                                            {__('Actual Hours Worked')}
                                        </Label>
                                        <Input
                                            id={`hours-${index}`}
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            value={member.actual_hours}
                                            onChange={(e) =>
                                                updateMemberField(
                                                    index,
                                                    'actual_hours',
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0.5,
                                                )
                                            }
                                            required
                                        />
                                        {errors[
                                            `members.${index}.actual_hours` as any
                                        ] && (
                                            <p className="text-xs text-destructive">
                                                {
                                                    errors[
                                                        `members.${index}.actual_hours` as any
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Link
                        href={personalOvertimeShow.url({
                            personal_overtime_request: overtimeRequest.id,
                        })}
                    >
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
                        className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90"
                    >
                        <Save className="h-4 w-4" />{' '}
                        {__('Submit Completion Report')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

PersonalOvertimeRequestReport.layout = {
    breadcrumbs: [
        { title: __('Self-Service'), href: '#' },
        { title: __('My Overtime Requests'), href: personalOvertimeIndex() },
        { title: __('Submit Report'), href: '#' },
    ],
};
