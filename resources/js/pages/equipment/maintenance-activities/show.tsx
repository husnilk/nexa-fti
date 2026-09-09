import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function Show() {
    return (
        <>
            <Head title="Maintenance Activity Details" />
            <div className="flex flex-col gap-4 p-4">
                <Heading title="Maintenance Activity Details" description="View details of this maintenance activity." />
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Maintenance Activities', href: '#' },
        { title: 'Details', href: '#' },
    ],
};
