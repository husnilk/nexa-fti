import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { LanguageTabs } from '@/components/language-switcher';
import { __ } from '@/lib/i18n';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title={__('Appearance settings')} />

            <h1 className="sr-only">{__('Appearance settings')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={__('Appearance settings')}
                    description={__(
                        'Update the appearance settings for your account',
                    )}
                />
                <AppearanceTabs />
            </div>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={__('Language')}
                    description={__(
                        'Choose the language used throughout the application',
                    )}
                />
                <LanguageTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: __('Appearance settings'),
            href: editAppearance(),
        },
    ],
};
