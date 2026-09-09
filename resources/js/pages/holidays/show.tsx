import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar as CalendarIcon, Info } from 'lucide-react';
import Heading from '@/components/heading';
import { index as holidaysIndex } from '@/routes/holidays';

type Holiday = {
    id: string;
    date: string;
    name: string;
};

type PageProps = {
    holiday: Holiday;
};

export default function HolidayShow({ holiday }: PageProps) {
    return (
        <>
            <Head title="Holiday Detail" />
            <div className="mx-auto flex h-full max-w-3xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Link
                        href={holidaysIndex()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" /> Back to Holidays
                    </Link>
                    <Heading
                        title="Holiday Detail"
                        description="View holiday information"
                    />
                </div>

                <div className="grid gap-6">
                    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                    <CalendarIcon className="size-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">
                                        {holiday.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Public Holiday / Non-Working Day
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarIcon className="size-4" />
                                    <span>Date</span>
                                </div>
                                <p className="text-lg font-medium">
                                    {new Date(holiday.date).toLocaleDateString(
                                        'en-GB',
                                        {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        },
                                    )}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Info className="size-4" />
                                    <span>Name / Description</span>
                                </div>
                                <p className="font-medium">{holiday.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

HolidayShow.layout = {
    breadcrumbs: [
        { title: 'HR', href: '#' },
        { title: 'Holidays', href: holidaysIndex() },
        { title: 'Detail', href: '' },
    ],
};
