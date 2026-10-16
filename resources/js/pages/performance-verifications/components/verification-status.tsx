import { __ } from '@/lib/i18n';
export const VERIFICATION_PENDING = 0;
export const VERIFICATION_APPROVED = 1;
export const VERIFICATION_REJECTED = 2;
export const VERIFICATION_RETURNED = 3;

const labels: Record<number, string> = {
    [VERIFICATION_PENDING]: __('Pending'),
    [VERIFICATION_APPROVED]: __('Approved'),
    [VERIFICATION_REJECTED]: __('Rejected'),
    [VERIFICATION_RETURNED]: __('Returned'),
};

const classes: Record<number, string> = {
    [VERIFICATION_PENDING]:
        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    [VERIFICATION_APPROVED]:
        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400',
    [VERIFICATION_REJECTED]:
        'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400',
    [VERIFICATION_RETURNED]:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400',
};

export function isLocked(status: number | null): boolean {
    return status === VERIFICATION_APPROVED || status === VERIFICATION_REJECTED;
}

export function VerificationBadge({ status }: { status: number | null }) {
    const value = status ?? VERIFICATION_PENDING;

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${classes[value] ?? classes[VERIFICATION_PENDING]}`}
        >
            {labels[value] ?? labels[VERIFICATION_PENDING]}
        </span>
    );
}
