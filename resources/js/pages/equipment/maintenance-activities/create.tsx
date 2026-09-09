import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function Create() {
    return (
        <>
            <Head title="Create Maintenance Activity" />
            <div className="flex flex-col gap-4 p-4">
                <Heading title="Create Maintenance Activity" description="Add a new activity to an equipment maintenance request." />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Maintenance Activities', href: '#' },
        { title: 'Create', href: '#' },
    ],
};
