import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { __ } from '@/lib/i18n';
import { RubricForm } from '@/pages/rubrics/components/rubric-form';
import {
    create as rubricCreate,
    index as rubricsIndex,
} from '@/routes/rubrics';
import type {
    EmploymentTypeOption,
    RubricCategory,
    RubricOptions,
    RubricRegulation,
} from '@/types/remuneration';

type PageProps = {
    categories: RubricCategory[];
    regulations: RubricRegulation[];
    organizations: { id: string; name: string; code: string }[];
    employmentTypes: EmploymentTypeOption[];
    options: RubricOptions;
};

export default function RubricCreate(props: PageProps) {
    return (
        <>
            <Head title={__('Add Rubric')} />
            <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Link
                        href={rubricsIndex()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" /> {__('Back to Rubrics')}
                    </Link>
                    <Heading
                        title={__('Add Rubric')}
                        description={__(
                            'Define a new activity, its points per position and who may use it',
                        )}
                    />
                </div>

                <RubricForm {...props} cancelHref={rubricsIndex.url()} />
            </div>
        </>
    );
}

RubricCreate.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Rubrics'), href: rubricsIndex() },
        { title: __('Add'), href: rubricCreate() },
    ],
};
