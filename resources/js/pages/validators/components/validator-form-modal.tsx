import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import ValidatorController from '@/actions/App/Http/Controllers/ValidatorController';
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
import { Label } from '@/components/ui/label';
import { __ } from '@/lib/i18n';
import type { Validator } from '@/types/remuneration';

export const positionLabels: Record<number, string> = {
    1: __('Chair'),
    2: __('Member'),
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    validator: Validator | null;
    periodName: string;
    employees: { id: string; name: string; emp_number: string }[];
    organizations: { id: string; name: string }[];
};

type FormData = {
    employee_id: string;
    organization_id: string;
    position: string;
    is_active: boolean;
};

const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 bg-white dark:bg-zinc-900';

/**
 * Add or edit a validator. Mount with a fresh `key` per open.
 */
export default function ValidatorFormModal({
    open,
    onOpenChange,
    validator,
    periodName,
    employees,
    organizations,
}: Props) {
    const { data, setData, post, put, processing, errors, clearErrors } =
        useForm<FormData>({
            employee_id: validator?.employee_id ?? '',
            organization_id: validator?.organization_id ?? '',
            position: String(validator?.position ?? 2),
            is_active: validator?.is_active ?? true,
        });

    function close(): void {
        onOpenChange(false);
        clearErrors();
    }

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();

        const options = { preserveScroll: true, onSuccess: close };

        if (validator) {
            put(ValidatorController.update.url(validator.id), options);
        } else {
            post(ValidatorController.store.url(), options);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => (value ? onOpenChange(true) : close())}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {validator ? __('Edit Validator') : __('Add Validator')}
                    </DialogTitle>
                    <DialogDescription>
                        {__('Period: :name', { name: periodName })}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="employee_id">{__('Employee *')}</Label>
                        <select
                            id="employee_id"
                            value={data.employee_id}
                            onChange={(e) =>
                                setData('employee_id', e.target.value)
                            }
                            required
                            className={selectClass}
                        >
                            <option value="">{__('Select Employee')}</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} ({emp.emp_number})
                                </option>
                            ))}
                        </select>
                        {errors.employee_id && (
                            <p className="text-sm text-destructive">
                                {errors.employee_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="organization_id">
                            {__('Organization')}
                        </Label>
                        <select
                            id="organization_id"
                            value={data.organization_id}
                            onChange={(e) =>
                                setData('organization_id', e.target.value)
                            }
                            className={selectClass}
                        >
                            <option value="">{__('All organizations')}</option>
                            {organizations.map((organization) => (
                                <option
                                    key={organization.id}
                                    value={organization.id}
                                >
                                    {organization.name}
                                </option>
                            ))}
                        </select>
                        {errors.organization_id && (
                            <p className="text-sm text-destructive">
                                {errors.organization_id}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="position">{__('Position *')}</Label>
                        <select
                            id="position"
                            value={data.position}
                            onChange={(e) =>
                                setData('position', e.target.value)
                            }
                            required
                            className={selectClass}
                        >
                            {Object.entries(positionLabels).map(
                                ([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ),
                            )}
                        </select>
                        {errors.position && (
                            <p className="text-sm text-destructive">
                                {errors.position}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="is_active">{__('Active')}</Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={close}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                        >
                            <Save className="h-4 w-4" />{' '}
                            {validator
                                ? __('Save Changes')
                                : __('Add Validator')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
