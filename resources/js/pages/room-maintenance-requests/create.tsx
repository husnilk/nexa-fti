import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
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
import {
    index as maintenanceRequestsIndex,
    store as storeRequest,
} from '@/routes/room-maintenance-requests';

type Room = { id: string; name: string; code: string };

type PageProps = {
    rooms: Room[];
};

export default function RoomMaintenanceCreate({ rooms }: PageProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        room_id: string;
        issue_description: string;
        photo: File | null;
    }>({
        room_id: '',
        issue_description: '',
        photo: null,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(storeRequest());
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
                        <Link href={maintenanceRequestsIndex()}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Heading
                        title={__('Report Maintenance Issue')}
                        description={__(
                            'Submit a new maintenance request for a room',
                        )}
                    />
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="room_id">
                                        {__('Select Room')}
                                    </Label>
                                    <Select
                                        value={data.room_id}
                                        onValueChange={(value) =>
                                            setData('room_id', value)
                                        }
                                    >
                                        <SelectTrigger id="room_id">
                                            <SelectValue
                                                placeholder={__(
                                                    'Choose a room',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem
                                                    key={room.id}
                                                    value={room.id}
                                                >
                                                    {room.name} ({room.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.room_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.room_id}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="issue_description">
                                        {__('Issue Description')}
                                    </Label>
                                    <Textarea
                                        id="issue_description"
                                        value={data.issue_description}
                                        onChange={(e) =>
                                            setData(
                                                'issue_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={__(
                                            'Describe the maintenance issue in detail...',
                                        )}
                                        rows={6}
                                    />
                                    {errors.issue_description && (
                                        <p className="text-sm text-destructive">
                                            {errors.issue_description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="photo">
                                        {__(
                                            'Upload Photo of Damaged Part (Optional)',
                                        )}
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
                                        <Link href={maintenanceRequestsIndex()}>
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

RoomMaintenanceCreate.layout = {
    breadcrumbs: [
        { title: __('Assets & Facilities'), href: '#' },
        { title: __('Room Maintenance'), href: maintenanceRequestsIndex() },
        { title: __('Report Issue'), href: '#' },
    ],
};
