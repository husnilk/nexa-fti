import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import {
    index as leaveTypeIndex,
    update as leaveTypeUpdate,
} from '@/actions/App/Http/Controllers/Hr/LeaveTypeController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import type { LeaveType } from '@/types';

interface PageProps {
    leaveType: LeaveType;
}

export default function LeaveTypeEdit({ leaveType }: PageProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: leaveType.name,
        code: leaveType.code,
        description: leaveType.description || '',
        default_quota: leaveType.default_quota,
        requires_attachment: leaveType.requires_attachment,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(leaveTypeUpdate.url(leaveType.id));
    };

    return (
        <>
            <Head
                title={__('Edit Leave Type: :name', { name: leaveType.name })}
            />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title={__('Back to Leave Types')}
                    >
                        <Link href={leaveTypeIndex().url}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading
                        title={__('Edit Leave Type: :name', {
                            name: leaveType.name,
                        })}
                        description={__(
                            'Update the details for this leave type.',
                        )}
                    />
                </div>

                <form onSubmit={handleSubmit} className="grid max-w-2xl gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{__('Name')}</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">{__('Code')}</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder={__('e.g. AL, SL, ML')}
                            required
                        />
                        {errors.code && (
                            <p className="text-sm text-destructive">
                                {errors.code}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">{__('Description')}</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="default_quota">
                            {__('Default Quota (Days)')}
                        </Label>
                        <Input
                            id="default_quota"
                            type="number"
                            min="0"
                            value={data.default_quota}
                            onChange={(e) =>
                                setData(
                                    'default_quota',
                                    parseInt(e.target.value),
                                )
                            }
                            required
                        />
                        {errors.default_quota && (
                            <p className="text-sm text-destructive">
                                {errors.default_quota}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="requires_attachment"
                            checked={data.requires_attachment}
                            onCheckedChange={(checked) =>
                                setData('requires_attachment', !!checked)
                            }
                        />
                        <Label
                            htmlFor="requires_attachment"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {__(
                                'Requires attachment (e.g. medical certificate)',
                            )}
                        </Label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" asChild>
                            <Link href={leaveTypeIndex().url}>
                                {__('Cancel')}
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {__('Update Leave Type')}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

LeaveTypeEdit.layout = {
    breadcrumbs: [
        {
            title: __('Leave Types'),
            href: leaveTypeIndex(),
        },
        {
            title: __('Edit'),
            href: '#',
        },
    ],
};
