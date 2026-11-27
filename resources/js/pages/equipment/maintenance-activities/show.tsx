import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { __ } from '@/lib/i18n';

export default function Show() {
    return (
        <>
            <Head title={__('Maintenance Activity Details')} />
            <div className="flex flex-col gap-4 p-4">
                <Heading
                    title={__('Maintenance Activity Details')}
                    description={__(
                        'View details of this maintenance activity.',
                    )}
                />
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Maintenance Activities'), href: '#' },
        { title: __('Details'), href: '#' },
    ],
};
