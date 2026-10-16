import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { __ } from '@/lib/i18n';
import { index as activityIndex } from '@/routes/activities';
import ActivityForm from './components/activity-form';
import type { ActivityFormOptions } from './components/activity-form';

export default function ActivityCreate(props: ActivityFormOptions) {
    return (
        <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
            <Head title={__('Add Activity')} />

            <div className="flex items-center gap-3 border-b pb-5 dark:border-zinc-800">
                <Link href={activityIndex()}>
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
                        {__('Add Activity')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Record an activity. You will add the employees involved on the next page.',
                        )}
                    </p>
                </div>
            </div>

            <ActivityForm {...props} />
        </div>
    );
}

ActivityCreate.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Activities'), href: activityIndex() },
        { title: __('Add Activity'), href: '#' },
    ],
};
