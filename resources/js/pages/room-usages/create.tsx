import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import type { FormEvent } from 'react';
import RoomUsageController from '@/actions/App/Http/Controllers/RoomUsageController';
import Heading from '@/components/heading';
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
import { __ } from '@/lib/i18n';
import { index as roomUsagesIndex } from '@/routes/room-usages';

type Room = { id: string; name: string; code: string; capacity: number };

type PageProps = {
    rooms: Room[];
};

export default function RoomUsageCreate({ rooms }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        room_id: '',
        start_time: '',
        end_time: '',
        purpose: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(RoomUsageController.store.url());
    }

    return (
        <>
            <Head title={__('Propose Room Usage')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={roomUsagesIndex()}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Heading
                        title={__('Propose Room Usage')}
                        description={__(
                            'Submit a request to use a publicly available room',
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
                                                    {__(
                                                        ':name (:code) - Capacity: :capacity',
                                                        {
                                                            name: room.name,
                                                            code: room.code,
                                                            capacity:
                                                                room.capacity,
                                                        },
                                                    )}
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start_time">
                                            {__('Start Time')}
                                        </Label>
                                        <Input
                                            id="start_time"
                                            type="datetime-local"
                                            value={data.start_time}
                                            onChange={(e) =>
                                                setData(
                                                    'start_time',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.start_time && (
                                            <p className="text-sm text-destructive">
                                                {errors.start_time}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end_time">
                                            {__('End Time')}
                                        </Label>
                                        <Input
                                            id="end_time"
                                            type="datetime-local"
                                            value={data.end_time}
                                            onChange={(e) =>
                                                setData(
                                                    'end_time',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.end_time && (
                                            <p className="text-sm text-destructive">
                                                {errors.end_time}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="purpose">
                                        {__('Purpose')}
                                    </Label>
                                    <Textarea
                                        id="purpose"
                                        value={data.purpose}
                                        onChange={(e) =>
                                            setData('purpose', e.target.value)
                                        }
                                        placeholder={__(
                                            'Describe the purpose of using this room...',
                                        )}
                                        rows={4}
                                    />
                                    {errors.purpose && (
                                        <p className="text-sm text-destructive">
                                            {errors.purpose}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button asChild variant="outline">
                                        <Link href={roomUsagesIndex()}>
                                            {__('Cancel')}
                                        </Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Send /> {__('Submit Proposal')}
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

RoomUsageCreate.layout = {
    breadcrumbs: [
        { title: __('Assets & Facilities'), href: '#' },
        { title: __('Room Usages'), href: roomUsagesIndex() },
        { title: __('Propose Usage'), href: '#' },
    ],
};
