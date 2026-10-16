import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { __ } from '@/lib/i18n';

export default function Edit() {
    return (
        <>
            <Head title={__('Edit Maintenance Activity')} />
            <div className="flex flex-col gap-4 p-4">
                <Heading
                    title={__('Edit Maintenance Activity')}
                    description={__(
                        'Update the details of this maintenance activity.',
                    )}
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Maintenance Activities'), href: '#' },
        { title: __('Edit'), href: '#' },
    ],
};
