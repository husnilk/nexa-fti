import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { __ } from '@/lib/i18n';

export default function Edit() {
    return (
        <>
            <Head title={__('Edit Equipment Maintenance Request')} />
            <div className="flex flex-col gap-4 p-4">
                <Heading
                    title={__('Edit Maintenance Request')}
                    description={__(
                        'Update the details of this equipment maintenance request.',
                    )}
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: __('Equipment'), href: '#' },
        { title: __('Maintenance Requests'), href: '#' },
        { title: __('Edit'), href: '#' },
    ],
};
