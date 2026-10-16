import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarRange, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { __, intlLocale } from '@/lib/i18n';
import { index as eptIndex } from '@/routes/epts';
import type { Ept } from '@/types/remuneration';
import {
    behaviorAspects,
    monthRange,
    predicateBadgeClass,
    predicateLabels,
    ratingLabels,
    statusBadgeClass,
    statusLabels,
} from './components/ept-options';

type PageProps = {
    ept: Ept;
};

function formatDate(value: string | null): string {
    return value
        ? new Date(value).toLocaleDateString(intlLocale(), {
              dateStyle: 'medium',
          })
        : '-';
}

function Item({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {label}
            </p>
            <div className="mt-1 text-base font-medium text-zinc-900 dark:text-zinc-50">
                {children}
            </div>
        </div>
    );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
            </h2>
            {children}
        </div>
    );
}

export default function EptShow({ ept }: PageProps) {
    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head title={__('Performance Target Detail')} />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={eptIndex()}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                        {__('Performance Target Details')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Employee performance target (SKP) and its assessment.',
                        )}
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <UserRound className="size-6 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {ept.employee?.name}
                            </h3>
                            <p className="font-mono text-sm text-muted-foreground">
                                {ept.employee?.emp_number}
                            </p>
                        </div>
                    </div>
                    <span className={statusBadgeClass(ept.status)}>
                        {statusLabels[ept.status ?? 0]}
                    </span>
                </div>
            </div>

            <Card title={__('Target Period')}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Item label={__('Period')}>
                        <span className="flex items-center gap-2">
                            <CalendarRange className="size-4 text-muted-foreground" />
                            {ept.period?.name}
                        </span>
                    </Item>
                    <Item label={__('Months')}>
                        {monthRange(ept)} {ept.year}
                    </Item>
                    <Item label={__('Start Date')}>
                        {formatDate(ept.start_date)}
                    </Item>
                    <Item label={__('End Date')}>
                        {formatDate(ept.end_date)}
                    </Item>
                    <Item label={__('Appraiser Officer')}>
                        {ept.appraiser?.name ?? '-'}
                    </Item>
                    <Item label={__('Superior Appraiser Officer')}>
                        {ept.superior_appraiser?.name ?? '-'}
                    </Item>
                </div>
            </Card>

            <Card title={__('Behaviour Scores')}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {behaviorAspects.map((aspect) => (
                        <Item key={aspect.name} label={aspect.label}>
                            <span className="font-mono text-lg">
                                {ept[aspect.name] ?? '-'}
                            </span>
                        </Item>
                    ))}
                </div>
            </Card>

            <Card title={__('Assessment')}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Item label={__('Work Result Rating')}>
                        {ept.work_result_rating
                            ? ratingLabels[ept.work_result_rating]
                            : '-'}
                    </Item>
                    <Item label={__('Behaviour Rating')}>
                        {ept.behavior_rating
                            ? ratingLabels[ept.behavior_rating]
                            : '-'}
                    </Item>
                    <Item label={__('Performance Predicate')}>
                        {ept.performance_predicate ? (
                            <span
                                className={predicateBadgeClass(
                                    ept.performance_predicate,
                                )}
                            >
                                {predicateLabels[ept.performance_predicate]}
                            </span>
                        ) : (
                            '-'
                        )}
                    </Item>
                    <Item label={__('Achievement')}>
                        <span className="font-mono">
                            {ept.skp_achievement !== null
                                ? `${ept.skp_achievement}%`
                                : '-'}
                        </span>
                    </Item>
                    <Item label={__('Points')}>
                        <span className="font-mono">{ept.points ?? '-'}</span>
                    </Item>
                </div>
            </Card>

            <p className="text-xs text-muted-foreground">
                {ept.creator &&
                    __('Created by :name on :date', {
                        name: ept.creator.name,
                        date: formatDate(ept.created_at),
                    })}
                {ept.updater &&
                    ` · ${__('Last updated by :name on :date', {
                        name: ept.updater.name,
                        date: formatDate(ept.updated_at),
                    })}`}
            </p>
        </div>
    );
}

EptShow.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Performance Targets'), href: eptIndex() },
        { title: __('Detail'), href: '' },
    ],
};
