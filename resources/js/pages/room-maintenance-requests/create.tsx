import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState  } from 'react';
import type {FormEvent} from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index as maintenanceRequestsIndex, store as storeRequest } from '@/routes/room-maintenance-requests';

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
            <Head title="Report Maintenance Issue" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={maintenanceRequestsIndex()}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Heading
                        title="Report Maintenance Issue"
                        description="Submit a new maintenance request for a room"
                    />
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="room_id">Select Room</Label>
                                    <Select value={data.room_id} onValueChange={(value) => setData('room_id', value)}>
                                        <SelectTrigger id="room_id">
                                            <SelectValue placeholder="Choose a room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map((room) => (
                                                <SelectItem key={room.id} value={room.id}>
                                                    {room.name} ({room.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.room_id && <p className="text-sm text-destructive">{errors.room_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="issue_description">Issue Description</Label>
                                    <Textarea
                                        id="issue_description"
                                        value={data.issue_description}
                                        onChange={(e) => setData('issue_description', e.target.value)}
                                        placeholder="Describe the maintenance issue in detail..."
                                        rows={6}
                                    />
                                    {errors.issue_description && <p className="text-sm text-destructive">{errors.issue_description}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="photo">Upload Photo of Damaged Part (Optional)</Label>
                                    {previewUrl ? (
                                        <div className="relative mt-2 border rounded-lg overflow-hidden max-h-64 flex justify-center bg-black/5">
                                            <img src={previewUrl} className="max-h-64 object-contain" alt="Preview" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 size-8"
                                                onClick={() => handleFileChange(null)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full">
                                            <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60 border-muted-foreground/20">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP (Max 5MB)</p>
                                                </div>
                                                <input
                                                    id="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                                />
                                            </label>
                                        </div>
                                    )}
                                    {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button asChild variant="outline">
                                        <Link href={maintenanceRequestsIndex()}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Send /> Submit Report
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
        { title: 'Assets & Facilities', href: '#' },
        { title: 'Room Maintenance', href: maintenanceRequestsIndex() },
        { title: 'Report Issue', href: '#' },
    ],
};
