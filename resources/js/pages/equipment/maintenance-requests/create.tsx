import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    index as requestIndex,
    store as requestStore,
} from '@/actions/App/Http/Controllers/EquipmentMaintenanceRequestController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import type { Equipment } from '@/types';

type PageProps = {
    equipment: Equipment[];
};

export default function EquipmentMaintenanceCreate({
    equipment = [],
}: PageProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        equipment_id: string;
        problem_description: string;
        priority: 'low' | 'medium' | 'high';
        photo: File | null;
    }>({
        equipment_id: '',
        problem_description: '',
        priority: 'medium',
        photo: null,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(requestStore.url());
    }

    const handleFileChange = (file: File | null) => {
        setData('photo', file);

        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <>
            <Head title={__('Report Maintenance Issue')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={requestIndex()}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Heading
                        title={__('Report Equipment Maintenance')}
                        description={__(
                            'Submit a new maintenance request for an equipment',
                        )}
                    />
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="equipment_id">
                                        {__('Select Equipment')}
                                    </Label>
                                    <Select
                                        value={data.equipment_id}
                                        onValueChange={(value) =>
                                            setData('equipment_id', value)
                                        }
                                    >
                                        <SelectTrigger id="equipment_id">
                                            <SelectValue
                                                placeholder={__(
                                                    'Choose equipment',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {equipment.map((eq) => (
                                                <SelectItem
                                                    key={eq.id}
                                                    value={eq.id}
                                                >
                                                    {eq.equipment_number} -{' '}
                                                    {eq.serial_number}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.equipment_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.equipment_id}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="priority">
                                        {__('Priority')}
                                    </Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(value: any) =>
                                            setData('priority', value)
                                        }
                                    >
                                        <SelectTrigger id="priority">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                {__('Low')}
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                {__('Medium')}
                                            </SelectItem>
                                            <SelectItem value="high">
                                                {__('High')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && (
                                        <p className="text-sm text-destructive">
                                            {errors.priority}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="problem_description">
                                        {__('Issue Description')}
                                    </Label>
                                    <Textarea
                                        id="problem_description"
                                        value={data.problem_description}
                                        onChange={(e) =>
                                            setData(
                                                'problem_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={__(
                                            'Describe the problem in detail...',
                                        )}
                                        rows={6}
                                    />
                                    {errors.problem_description && (
                                        <p className="text-sm text-destructive">
                                            {errors.problem_description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="photo">
                                        {__('Upload Photo of Issue (Optional)')}
                                    </Label>
                                    {previewUrl ? (
                                        <div className="relative mt-2 flex max-h-64 justify-center overflow-hidden rounded-lg border bg-black/5">
                                            <img
                                                src={previewUrl}
                                                className="max-h-64 object-contain"
                                                alt={__('Preview')}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 size-8"
                                                onClick={() =>
                                                    handleFileChange(null)
                                                }
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex w-full items-center justify-center">
                                            <label
                                                htmlFor="photo"
                                                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/40 hover:bg-muted/60"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        <span className="font-semibold">
                                                            {__(
                                                                'Click to upload',
                                                            )}
                                                        </span>{' '}
                                                        {__('or drag and drop')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {__(
                                                            'JPEG, PNG, WEBP (Max 5MB)',
                                                        )}
                                                    </p>
                                                </div>
                                                <input
                                                    id="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            e.target
                                                                .files?.[0] ||
                                                                null,
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                    )}
                                    {errors.photo && (
                                        <p className="text-sm text-destructive">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button asChild variant="outline">
                                        <Link href={requestIndex()}>
                                            {__('Cancel')}
                                        </Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Send /> {__('Submit Report')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

EquipmentMaintenanceCreate.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Equipment Maintenance'), href: requestIndex() },
        { title: __('Report Issue'), href: '#' },
    ],
};
