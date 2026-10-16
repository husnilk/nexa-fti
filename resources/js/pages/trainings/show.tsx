import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Calendar,
    MapPin,
    Award,
    BookOpen,
    Download,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { __, intlLocale } from '@/lib/i18n';
import {
    index as trainingsIndex,
    edit as trainingEdit,
} from '@/routes/trainings';
import type { Auth } from '@/types';

interface Employee {
    id: string;
    name: string;
}

interface Training {
    id: string;
    title: string;
    description?: string;
    provider: string;
    location?: string;
    start_date: string;
    end_date: string;
    hours?: number;
    certificate_file?: string;
    employees?: Employee[];
}

type PageProps = {
    auth: Auth;
    training: Training;
};

const shortDateFormatter = new Intl.DateTimeFormat(intlLocale(), {
    dateStyle: 'medium',
});

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function TrainingShow({ auth, training }: PageProps) {
    const mayUpdate = can(auth, 'training.manage');

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Training: :title', { title: training.title })} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <Link href={trainingsIndex()}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {training.title}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__(
                                'Detailed information about this training session.',
                            )}
                        </p>
                    </div>
                </div>
                {mayUpdate && (
                    <Link href={trainingEdit.url(training.id)}>
                        <Button className="cursor-pointer gap-2 bg-indigo-600 font-medium text-white shadow-md hover:bg-indigo-700">
                            <Pencil className="h-4 w-4" /> {__('Edit Training')}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            {__('Training Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                {__('Description')}
                            </h4>
                            <p className="leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                {training.description ||
                                    __(
                                        'No description provided for this training.',
                                    )}
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {__('Provider & Location')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {training.provider}
                                        </p>
                                        {training.location && (
                                            <p className="text-xs text-muted-foreground italic">
                                                {training.location}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Award className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {__('Duration')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {__(':count Hours', {
                                                count: training.hours || 0,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {__('Training Period')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {training.start_date
                                                ? shortDateFormatter.format(
                                                      new Date(
                                                          training.start_date,
                                                      ),
                                                  )
                                                : '-'}{' '}
                                            —{' '}
                                            {training.end_date
                                                ? shortDateFormatter.format(
                                                      new Date(
                                                          training.end_date,
                                                      ),
                                                  )
                                                : '-'}
                                        </p>
                                    </div>
                                </div>

                                {training.certificate_file && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <Download className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {__('Certificate')}
                                            </p>
                                            <a
                                                href={`/storage/${training.certificate_file}`}
                                                target="_blank"
                                                className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                {__(
                                                    'View Completion Certificate',
                                                )}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {__('Participants (:count)', {
                                count: training.employees?.length || 0,
                            })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {training.employees && training.employees.length > 0 ? (
                            <ul className="space-y-3">
                                {training.employees.map((emp) => (
                                    <li
                                        key={emp.id}
                                        className="flex items-center gap-3 rounded-lg border bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {emp.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground italic">
                                {__('No employees enrolled in this training.')}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

TrainingShow.layout = {
    breadcrumbs: [
        { title: __('HR'), href: '#' },
        { title: __('Trainings'), href: trainingsIndex() },
        { title: __('Training Detail'), href: '#' },
    ],
};
