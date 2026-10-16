import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import RubricCategoryController from '@/actions/App/Http/Controllers/RubricCategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import type { RubricCategory } from '@/types/remuneration';

type RubricCategoryFormData = {
    code: string;
    name: string;
    description: string;
};

function toFormData(
    category: RubricCategory | null | undefined,
): RubricCategoryFormData {
    return {
        code: category?.code ?? '',
        name: category?.name ?? '',
        description: category?.description ?? '',
    };
}

interface RubricCategoryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: RubricCategory | null;
}

export function RubricCategoryFormModal({
    open,
    onOpenChange,
    category,
}: RubricCategoryFormModalProps) {
    const isEdit = !!category?.id;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<RubricCategoryFormData>(toFormData(category));

    useEffect(() => {
        if (open) {
            setData(toFormData(category));
            clearErrors();
        }
    }, [open, category]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const onSuccess = () => {
            onOpenChange(false);
            reset();
            toast.success(
                isEdit
                    ? __('Category updated successfully')
                    : __('Category created successfully'),
            );
        };

        if (isEdit && category) {
            put(RubricCategoryController.update.url(category.id), {
                preserveScroll: true,
                onSuccess,
            });
        } else {
            post(RubricCategoryController.store.url(), {
                preserveScroll: true,
                onSuccess,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b p-6 pb-4">
                        <DialogTitle className="text-xl font-bold">
                            {isEdit
                                ? __('Edit Category: :name', {
                                      name: category?.name,
                                  })
                                : __('Add Category')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Categories group rubrics, e.g. Pendidikan or Penelitian.',
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 p-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="category-code">
                                    {__('Code')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="category-code"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                />
                                <InputError message={errors.code} />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="category-name">
                                    {__('Name')}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="category-name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="category-description">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="category-description"
                                rows={3}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            <InputError message={errors.description} />
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
                                  : __('Create Category')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
