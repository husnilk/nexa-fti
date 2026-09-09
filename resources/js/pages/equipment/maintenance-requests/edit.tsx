import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';

export default function Edit() {
    return (
        <>
            <Head title="Edit Equipment Maintenance Request" />
            <div className="flex flex-col gap-4 p-4">
                <Heading title="Edit Maintenance Request" description="Update the details of this equipment maintenance request." />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Equipment', href: '#' },
        { title: 'Maintenance Requests', href: '#' },
        { title: 'Edit', href: '#' },
    ],
};
