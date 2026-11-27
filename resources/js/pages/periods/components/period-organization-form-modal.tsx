import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import PeriodOrganizationController from '@/actions/App/Http/Controllers/PeriodOrganizationController';
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
import { __ } from '@/lib/i18n';
import type {
    PeriodOrganization,
    PeriodOrganizationOptions,
    SelectOption,
} from '@/types/remuneration';

type PeriodOrganizationFormData = {
    pagu: string;
    pir_unit: string;
    percentage: string;
    sharing_method: string;
    finalization_state: string;
    stage: string;
};

function toFormData(
    periodOrganization?: PeriodOrganization | null,
): PeriodOrganizationFormData {
    return {
        pagu: String(periodOrganization?.pagu ?? 0),
        pir_unit: String(periodOrganization?.pir_unit ?? 0),
        percentage: String(periodOrganization?.percentage ?? 0),
        sharing_method: String(periodOrganization?.sharing_method ?? 0),
        finalization_state: String(periodOrganization?.finalization_state ?? 0),
        stage: String(periodOrganization?.stage ?? 0),
    };
}

interface PeriodOrganizationFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periodId: string;
    periodOrganization: PeriodOrganization | null;
    options: PeriodOrganizationOptions;
}

export function PeriodOrganizationFormModal({
    open,
    onOpenChange,
    periodId,
    periodOrganization,
    options,
}: PeriodOrganizationFormModalProps) {
    const { data, setData, patch, processing, errors, clearErrors } =
        useForm<PeriodOrganizationFormData>(toFormData(periodOrganization));

    useEffect(() => {
        if (open) {
            setData(toFormData(periodOrganization));
            clearErrors();
        }
    }, [open, periodOrganization]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!periodOrganization) {
            return;
        }

        patch(
            PeriodOrganizationController.update.url({
                period: periodId,
                organization: periodOrganization.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success(
                        __('Organization settings updated successfully'),
                    );
                },
            },
        );
    }

    function numberField(
        field: 'pagu' | 'pir_unit' | 'percentage',
        label: string,
        props: { step?: string; max?: number; hint?: string } = {},
    ) {
        const id = `period-organization-${field}`;

        return (
            <div className="space-y-1.5">
                <Label htmlFor={id}>
                    {label} <span className="text-destructive">*</span>
                </Label>
                <Input
                    id={id}
                    type="number"
                    min={0}
                    max={props.max}
                    step={props.step ?? '0.01'}
                    value={data[field]}
                    onChange={(e) => setData(field, e.target.value)}
                />
                {props.hint && (
                    <p className="text-xs text-muted-foreground">
                        {props.hint}
                    </p>
                )}
                <InputError message={errors[field]} />
            </div>
        );
    }

    function selectField(
        field: 'sharing_method' | 'finalization_state' | 'stage',
        label: string,
        choices: SelectOption[],
    ) {
        const id = `period-organization-${field}`;

        return (
            <div className="space-y-1.5">
                <Label htmlFor={id}>
                    {label} <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={data[field]}
                    onValueChange={(value) => setData(field, value)}
                >
                    <SelectTrigger id={id}>
                        <SelectValue
                            placeholder={__('Select :field', {
                                field: label.toLowerCase(),
                            })}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {choices.map((choice) => (
                            <SelectItem
                                key={choice.value}
                                value={String(choice.value)}
                            >
                                {choice.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors[field]} />
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b p-6 pb-4">
                        <DialogTitle className="text-xl font-bold">
                            {__('Edit: :name', {
                                name: periodOrganization?.organization.name,
                            })}
                        </DialogTitle>
                        <DialogDescription>
                            {__(
                                'Update the budget (pagu), point index and status of this organization for the period.',
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 p-6">
                        <div className="space-y-4 rounded-lg border bg-card/50 p-5 shadow-xs">
                            <h3 className="border-b pb-2 text-base font-semibold text-foreground">
                                {__('Budget')}
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {numberField('pagu', __('Pagu (Rp)'), {
                                    step: '1',
                                })}
                                {numberField('pir_unit', __('Unit PIR'))}
                                {numberField(
                                    'percentage',
                                    __('Percentage (%)'),
                                    {
                                        max: 100,
                                    },
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-card/50 p-5 shadow-xs">
                            <h3 className="border-b pb-2 text-base font-semibold text-foreground">
                                {__('Status')}
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {selectField(
                                    'sharing_method',
                                    __('Sharing Method'),
                                    options.sharingMethods,
                                )}
                                {selectField(
                                    'stage',
                                    __('Stage'),
                                    options.stages,
                                )}
                                {selectField(
                                    'finalization_state',
                                    __('Finalization'),
                                    options.finalizationStates,
                                )}
                            </div>
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
                                ? __('Saving Changes...')
                                : __('Save Changes')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
