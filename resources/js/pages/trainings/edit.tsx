import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import TrainingController from '@/actions/App/Http/Controllers/Hr/TrainingController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import { index as trainingsIndex } from '@/routes/trainings';

interface Employee {
    id: string;
    name: string;
}

interface Training {
    id: string;
    title: string;
    description?: string;
    provider: string;
    location?: string;
    start_date: string;
    end_date: string;
    hours?: number;
    certificate_file?: string;
    employees?: Employee[];
}

type PageProps = {
    training: Training;
    employees: Employee[];
};

export default function TrainingEdit({ training, employees }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        title: training.title,
        description: training.description || '',
        provider: training.provider,
        location: training.location || '',
        start_date: training.start_date
            ? training.start_date.substring(0, 10)
            : '',
        end_date: training.end_date ? training.end_date.substring(0, 10) : '',
        hours: training.hours?.toString() || '',
        certificate_file: null as File | null,
        employee_ids: training.employees?.map((emp) => emp.id) || [],
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        // Use post with _method: 'PATCH' for multipart/form-data support in Laravel
        post(TrainingController.update.url(training.id), {
            forceFormData: true,
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head
                title={__('Edit Training: :title', { title: training.title })}
            />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={trainingsIndex()}>
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
                        {__('Edit Training')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Update training session details and manage participants.',
                        )}
                    </p>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2"
            >
                <Card className="md:col-span-1">
                    <CardContent className="grid gap-6 pt-6">
                        <h3 className="text-lg font-semibold">
                            {__('Training Information')}
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                {__('Training Title')}
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder={__(
                                    'e.g. Advanced React Development',
                                )}
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder={__(
                                    'Describe the training objectives...',
                                )}
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="provider">
                                {__('Provider / Organizer')}
                            </Label>
                            <Input
                                id="provider"
                                value={data.provider}
                                onChange={(e) =>
                                    setData('provider', e.target.value)
                                }
                                placeholder={__(
                                    'e.g. Coursera, Local University',
                                )}
                                required
                            />
                            {errors.provider && (
                                <p className="text-sm text-destructive">
                                    {errors.provider}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">{__('Location')}</Label>
                            <Input
                                id="location"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                                placeholder={__('e.g. Online, Seminar Room A')}
                            />
                            {errors.location && (
                                <p className="text-sm text-destructive">
                                    {errors.location}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="grid gap-6 pt-6">
                            <h3 className="text-lg font-semibold">
                                {__('Schedule & Certificate')}
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">
                                        {__('Start Date')}
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {errors.start_date && (
                                        <p className="text-sm text-destructive">
                                            {errors.start_date}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">
                                        {__('End Date')}
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData('end_date', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.end_date && (
                                        <p className="text-sm text-destructive">
                                            {errors.end_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="hours">
                                    {__('Total Hours')}
                                </Label>
                                <Input
                                    id="hours"
                                    type="number"
                                    value={data.hours}
                                    onChange={(e) =>
                                        setData('hours', e.target.value)
                                    }
                                    placeholder={__('e.g. 16')}
                                />
                                {errors.hours && (
                                    <p className="text-sm text-destructive">
                                        {errors.hours}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="certificate_file">
                                    {__('Completion Certificate')}
                                </Label>
                                <Input
                                    id="certificate_file"
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            'certificate_file',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="cursor-pointer"
                                />
                                {training.certificate_file && (
                                    <p className="text-xs text-muted-foreground italic">
                                        {__('Current file: :file', {
                                            file: training.certificate_file
                                                .split('/')
                                                .pop(),
                                        })}
                                    </p>
                                )}
                                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {__('Accepted formats: PDF, JPG, PNG')}
                                </p>
                                {errors.certificate_file && (
                                    <p className="text-sm text-destructive">
                                        {errors.certificate_file}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="grid gap-6 pt-6">
                            <h3 className="text-lg font-semibold">
                                {__('Enroll Participants')}
                            </h3>
                            <div className="max-h-[200px] space-y-3 overflow-y-auto pr-2">
                                {employees.map((emp) => (
                                    <div
                                        key={emp.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`emp-${emp.id}`}
                                            checked={data.employee_ids.includes(
                                                emp.id,
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setData('employee_ids', [
                                                        ...data.employee_ids,
                                                        emp.id,
                                                    ]);
                                                } else {
                                                    setData(
                                                        'employee_ids',
                                                        data.employee_ids.filter(
                                                            (id) =>
                                                                id !== emp.id,
                                                        ),
                                                    );
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor={`emp-${emp.id}`}
                                            className="cursor-pointer text-sm font-normal select-none"
                                        >
                                            {emp.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.employee_ids && (
                                <p className="text-sm text-destructive">
                                    {errors.employee_ids}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-3 md:col-span-2">
                    <Link href={trainingsIndex()}>
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
                        <Save className="h-4 w-4" /> {__('Update Training')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

TrainingEdit.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        { title: __('Trainings'), href: trainingsIndex() },
        { title: __('Edit Training'), href: '#' },
    ],
};
