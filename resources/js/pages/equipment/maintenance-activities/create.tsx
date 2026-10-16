import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { __ } from '@/lib/i18n';

export default function Create() {
    return (
        <>
            <Head title={__('Create Maintenance Activity')} />
            <div className="flex flex-col gap-4 p-4">
                <Heading
                    title={__('Create Maintenance Activity')}
                    description={__(
                        'Add a new activity to an equipment maintenance request.',
                    )}
                />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Maintenance Activities'), href: '#' },
        { title: __('Create'), href: '#' },
    ],
};
