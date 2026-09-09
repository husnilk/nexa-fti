import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    Award,
    Briefcase,
    CalendarDays,
    FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index as functionalPositionsIndex } from '@/routes/functional-positions';

type FunctionalPosition = {
    id: string;
    name: string;
    code: string;
    description: string | null;
    level: number;
    grade: number;
    job_value: number;
    is_active: boolean;
    created_at: string;
};

type PageProps = {
    functionalPosition: FunctionalPosition;
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
});

export default function FunctionalPositionShow({
    functionalPosition,
}: PageProps) {
    return (
        <>
            <Head title={`Functional Position: ${functionalPosition.name}`} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                    <Link href={functionalPositionsIndex()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {functionalPosition.name}
                            </h1>
                            <Badge className="rounded-full px-3 py-1 uppercase">
                                Level {functionalPosition.level}
                            </Badge>
                            <Badge
                                variant={
                                    functionalPosition.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="rounded-full px-3 py-1 uppercase"
                            >
                                {functionalPosition.is_active
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review code, level metadata, grade, job value, and the role
                            description for this functional position.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <h3 className="border-b pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                                Position Details
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono">
                                        {functionalPosition.code}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                    <span>Level {functionalPosition.level}</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                    <span>Grade {functionalPosition.grade}</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span>{functionalPosition.job_value}</span>
                                </div>

                                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {dateFormatter.format(
                                            new Date(functionalPosition.created_at),
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-3">
                        <div className="rounded-2xl border bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-2 border-b pb-3 dark:border-zinc-800">
                                <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    Description
                                </h3>
                            </div>

                            <p className="mt-4 leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                {functionalPosition.description ||
                                    'No description provided.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

FunctionalPositionShow.layout = {
    breadcrumbs: [
        {
            title: 'Functional Positions',
            href: functionalPositionsIndex(),
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
