import { useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import RubricRegulationController from '@/actions/App/Http/Controllers/RubricRegulationController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import type { RubricRegulation } from '@/types/remuneration';

type RubricRegulationFormData = {
    name: string;
    regulation_number: string;
    regulation_year: string;
    description: string;
    file: File | null;
    remove_file: boolean;
};

function toFormData(
    regulation: RubricRegulation | null | undefined,
): RubricRegulationFormData {
    return {
        name: regulation?.name ?? '',
        regulation_number: regulation?.regulation_number ?? '',
        regulation_year:
            regulation?.regulation_year ?? String(new Date().getFullYear()),
        description: regulation?.description ?? '',
        file: null,
        remove_file: false,
    };
}

interface RubricRegulationFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    regulation?: RubricRegulation | null;
}

export function RubricRegulationFormModal({
    open,
    onOpenChange,
    regulation,
}: RubricRegulationFormModalProps) {
    const isEdit = !!regulation?.id;

    const {
        data,
        setData,
        post,
        transform,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<RubricRegulationFormData>(toFormData(regulation));

    useEffect(() => {
        if (open) {
            setData(toFormData(regulation));
            clearErrors();
        }
    }, [open, regulation]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success(
                    isEdit
                        ? __('Regulation updated successfully')
                        : __('Regulation created successfully'),
                );
            },
        };

        if (isEdit && regulation) {
            // Files can only be sent with POST, so spoof the PUT method.
            transform((form) => ({ ...form, _method: 'put' }));
            post(RubricRegulationController.update.url(regulation.id), options);
        } else {
            transform((form) => form);
            post(RubricRegulationController.store.url(), options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b p-6 pb-4">
                        <DialogTitle className="text-xl font-bold">
                            {isEdit
                                ? __('Edit Regulation')
                                : __('Add Regulation')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'The regulation that defines a set of rubrics.',
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 p-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="regulation-name">
                                {__('Name')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="regulation-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="regulation-number">
                                    {__('Number')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="regulation-number"
                                    value={data.regulation_number}
                                    onChange={(e) =>
                                        setData(
                                            'regulation_number',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.regulation_number}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="regulation-year">
                                    {__('Year')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="regulation-year"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={data.regulation_year}
                                    onChange={(e) =>
                                        setData(
                                            'regulation_year',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.regulation_year} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="regulation-description">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="regulation-description"
                                rows={3}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="regulation-file">
                                {__('Document (PDF, max 10 MB)')}
                            </Label>
                            {isEdit && regulation?.file_path && (
                                <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
                                    <a
                                        href={`/storage/${regulation.file_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                                    >
                                        <FileText className="size-4" />
                                        {__('Current document')}
                                    </a>
                                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Checkbox
                                            checked={data.remove_file}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    'remove_file',
                                                    checked === true,
                                                )
                                            }
                                        />
                                        {__('Remove')}
                                    </label>
                                </div>
                            )}
                            <Input
                                id="regulation-file"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                    setData('file', e.target.files?.[0] ?? null)
                                }
                            />
                            <InputError message={errors.file} />
                        </div>
                    </div>

                    <DialogFooter className="border-t bg-muted/20 p-6 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-xs hover:from-violet-700 hover:to-indigo-700"
                        >
                            {processing
                                ? __('Saving...')
                                : isEdit
                                  ? __('Save Changes')
                                  : __('Create Regulation')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
