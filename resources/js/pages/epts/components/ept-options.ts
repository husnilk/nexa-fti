import { __ } from '@/lib/i18n';
import type { Ept } from '@/types/remuneration';

// Code lists follow PermenPANRB No. 6 Tahun 2022. Adjust labels here only.

export const ratingLabels: Record<number, string> = {
    1: __('Below expectation'),
    2: __('As expected'),
    3: __('Above expectation'),
};

export const predicateLabels: Record<number, string> = {
    1: __('Very poor'),
    2: __('Lacking'),
    3: __('Needs improvement'),
    4: __('Good'),
    5: __('Very good'),
};

export const statusLabels: Record<number, string> = {
    0: __('Draft'),
    1: __('Submitted'),
    2: __('Verified'),
};

export const behaviorAspects: {
    name: keyof Pick<
        Ept,
        | 'orientation'
        | 'integrity'
        | 'commitment'
        | 'discipline'
        | 'teamwork'
        | 'leadership'
    >;
    label: string;
}[] = [
    { name: 'orientation', label: __('Service Orientation') },
    { name: 'integrity', label: __('Integrity') },
    { name: 'commitment', label: __('Commitment') },
    { name: 'discipline', label: __('Discipline') },
    { name: 'teamwork', label: __('Teamwork') },
    { name: 'leadership', label: __('Leadership') },
];

export const monthNames = [
    __('January'),
    __('February'),
    __('March'),
    __('April'),
    __('May'),
    __('June'),
    __('July'),
    __('August'),
    __('September'),
    __('October'),
    __('November'),
    __('December'),
];

export function monthRange(ept: Pick<Ept, 'start' | 'end'>): string {
    if (!ept.start || !ept.end) {
        return '-';
    }

    const start = monthNames[ept.start - 1]?.slice(0, 3);
    const end = monthNames[ept.end - 1]?.slice(0, 3);

    return start === end ? start : `${start} – ${end}`;
}

const statusClasses: Record<number, string> = {
    0: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    1: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400',
    2: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400',
};

const predicateClasses: Record<number, string> = {
    1: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400',
    2: 'bg-rose-50 text-rose-700 dark:bg-rose-950/35 dark:text-rose-400',
    3: 'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400',
    4: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400',
    5: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400',
};

const badgeBase =
    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide';

export function statusBadgeClass(status: number | null): string {
    return `${badgeBase} ${statusClasses[status ?? 0] ?? statusClasses[0]}`;
}

export function predicateBadgeClass(predicate: number | null): string {
    return `${badgeBase} ${
        predicate ? predicateClasses[predicate] : statusClasses[0]
    }`;
}
