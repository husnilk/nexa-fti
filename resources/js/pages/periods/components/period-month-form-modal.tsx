import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import PeriodMonthController from '@/actions/App/Http/Controllers/PeriodMonthController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { __, intlLocale } from '@/lib/i18n';
import type { Period, PeriodMonth } from '@/types/remuneration';

const monthFormatter = new Intl.DateTimeFormat(intlLocale(), { month: 'long' });

export function monthName(month: number): string {
    return monthFormatter.format(new Date(2000, month - 1, 1));
}

type PeriodMonthFormData = {
    month: string;
    workdays: string;
};

interface PeriodMonthFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    period: Period;
    periodMonth?: PeriodMonth | null;
}

export function PeriodMonthFormModal({
    open,
    onOpenChange,
    period,
    periodMonth,
}: PeriodMonthFormModalProps) {
    const isEdit = !!periodMonth?.id;

    // Months already in the period cannot be picked again, except the one being edited.
    const availableMonths = useMemo(() => {
        const taken = new Set(
            (period.months ?? [])
                .filter((m) => m.id !== periodMonth?.id)
                .map((m) => m.month),
        );

        return Array.from({ length: 12 }, (_, i) => i + 1).filter(
            (month) => !taken.has(month),
        );
    }, [period.months, periodMonth?.id]);

    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<PeriodMonthFormData>({ month: '', workdays: '' });

    useEffect(() => {
        if (open) {
            setData({
                month: periodMonth ? String(periodMonth.month) : '',
                workdays: periodMonth ? String(periodMonth.workdays) : '',
            });
            clearErrors();
        }
    }, [open, periodMonth]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (isEdit && periodMonth) {
            patch(
                PeriodMonthController.update.url({
                    period: period.id,
                    month: periodMonth.id,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        onOpenChange(false);
                        toast.success(__('Month updated successfully'));
                    },
                },
            );
        } else {
            post(PeriodMonthController.store.url(period.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success(__('Month added successfully'));
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b p-6 pb-4">
                        <DialogTitle className="text-xl font-bold">
                            {isEdit
                                ? __('Edit Month: :month', {
                                      month: monthName(periodMonth!.month),
                                  })
                                : __('Add Month')}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Set the number of work days for a month in :period.',
                                { period: period.name },
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 p-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="period-month-month">
                                {__('Month')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.month}
                                onValueChange={(value) =>
                                    setData('month', value)
                                }
                            >
                                <SelectTrigger id="period-month-month">
                                    <SelectValue
                                        placeholder={__('Select month')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableMonths.map((month) => (
                                        <SelectItem
                                            key={month}
                                            value={String(month)}
                                        >
                                            {monthName(month)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.month} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="period-month-workdays">
                                {__('Work Days')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="period-month-workdays"
                                type="number"
                                min={0}
                                max={31}
                                placeholder={__('e.g. 21')}
                                value={data.workdays}
                                onChange={(e) =>
                                    setData('workdays', e.target.value)
                                }
                            />
                            <InputError message={errors.workdays} />
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
                                ? isEdit
                                    ? __('Saving Changes...')
                                    : __('Adding...')
                                : isEdit
                                  ? __('Save Changes')
                                  : __('Add Month')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
