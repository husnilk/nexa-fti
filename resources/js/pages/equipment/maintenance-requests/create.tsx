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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Equipment } from '@/types';

type PageProps = {
    equipment: Equipment[];
};

export default function EquipmentMaintenanceCreate({ equipment = [] }: PageProps) {
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
            <Head title="Report Maintenance Issue" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={requestIndex()}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Heading
                        title="Report Equipment Maintenance"
                        description="Submit a new maintenance request for an equipment"
                    />
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="equipment_id">Select Equipment</Label>
                                    <Select value={data.equipment_id} onValueChange={(value) => setData('equipment_id', value)}>
                                        <SelectTrigger id="equipment_id">
                                            <SelectValue placeholder="Choose equipment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {equipment.map((eq) => (
                                                <SelectItem key={eq.id} value={eq.id}>
                                                    {eq.equipment_number} - {eq.serial_number}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.equipment_id && <p className="text-sm text-destructive">{errors.equipment_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select value={data.priority} onValueChange={(value: any) => setData('priority', value)}>
                                        <SelectTrigger id="priority">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="problem_description">Issue Description</Label>
                                    <Textarea
                                        id="problem_description"
                                        value={data.problem_description}
                                        onChange={(e) => setData('problem_description', e.target.value)}
                                        placeholder="Describe the problem in detail..."
                                        rows={6}
                                    />
                                    {errors.problem_description && <p className="text-sm text-destructive">{errors.problem_description}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="photo">Upload Photo of Issue (Optional)</Label>
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
                                        <Link href={requestIndex()}>Cancel</Link>
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

EquipmentMaintenanceCreate.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Equipment Maintenance', href: requestIndex() },
        { title: 'Report Issue', href: '#' },
    ],
};
