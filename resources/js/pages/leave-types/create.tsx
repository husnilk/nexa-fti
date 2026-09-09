import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { index as leaveTypeIndex, store as leaveTypeStore } from '@/actions/App/Http/Controllers/Hr/LeaveTypeController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function LeaveTypeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        default_quota: 0,
        requires_attachment: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(leaveTypeStore.url());
    };

    return (
        <>
            <Head title="Add Leave Type" />
            
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild title="Back to Leave Types">
                        <Link href={leaveTypeIndex().url}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading title="Add Leave Type" description="Create a new type of leave with its default quota." />
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="e.g. AL, SL, ML"
                            required
                        />
                        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="default_quota">Default Quota (Days)</Label>
                        <Input
                            id="default_quota"
                            type="number"
                            min="0"
                            value={data.default_quota}
                            onChange={(e) => setData('default_quota', parseInt(e.target.value))}
                            required
                        />
                        {errors.default_quota && <p className="text-sm text-destructive">{errors.default_quota}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="requires_attachment" 
                            checked={data.requires_attachment}
                            onCheckedChange={(checked) => setData('requires_attachment', !!checked)}
                        />
                        <Label htmlFor="requires_attachment" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Requires attachment (e.g. medical certificate)
                        </Label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" asChild>
                            <Link href={leaveTypeIndex().url}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>Save Leave Type</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

LeaveTypeCreate.layout = {
    breadcrumbs: [
        {
            title: 'Leave Types',
            href: leaveTypeIndex(),
        },
        {
            title: 'Add',
            href: '#',
        },
    ],
};
