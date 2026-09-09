import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function Edit() {
    return (
        <>
            <Head title="Edit Maintenance Activity" />
            <div className="flex flex-col gap-4 p-4">
                <Heading title="Edit Maintenance Activity" description="Update the details of this maintenance activity." />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Maintenance Activities', href: '#' },
        { title: 'Edit', href: '#' },
    ],
};
