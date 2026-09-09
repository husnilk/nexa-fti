import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Calendar, MapPin, Award, BookOpen, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index as trainingsIndex, edit as trainingEdit } from '@/routes/trainings';
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

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Training: ${training.title}`} />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={trainingsIndex()}>
                        <Button variant="outline" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {training.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Detailed information about this training session.
                        </p>
                    </div>
                </div>
                {mayUpdate && (
                    <Link href={trainingEdit.url(training.id)}>
                        <Button className="cursor-pointer gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md">
                            <Pencil className="h-4 w-4" /> Edit Training
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Training Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {training.description || 'No description provided for this training.'}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Provider & Location</p>
                                        <p className="text-sm text-muted-foreground">{training.provider}</p>
                                        {training.location && <p className="text-xs text-muted-foreground italic">{training.location}</p>}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Award className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Duration</p>
                                        <p className="text-sm text-muted-foreground">{training.hours || 0} Hours</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Training Period</p>
                                        <p className="text-sm text-muted-foreground">
                                            {training.start_date ? shortDateFormatter.format(new Date(training.start_date)) : '-'} — {training.end_date ? shortDateFormatter.format(new Date(training.end_date)) : '-'}
                                        </p>
                                    </div>
                                </div>

                                {training.certificate_file && (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            <Download className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Certificate</p>
                                            <a 
                                                href={`/storage/${training.certificate_file}`} 
                                                target="_blank"
                                                className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                View Completion Certificate
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
                            Participants ({training.employees?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {training.employees && training.employees.length > 0 ? (
                            <ul className="space-y-3">
                                {training.employees.map((emp) => (
                                    <li key={emp.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border dark:border-zinc-800">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {emp.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium">{emp.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground italic">
                                No employees enrolled in this training.
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
        { title: 'HR', href: '#' },
        { title: 'Trainings', href: trainingsIndex() },
        { title: 'Training Detail', href: '#' },
    ],
};
