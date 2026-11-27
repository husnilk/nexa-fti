import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import { __ } from '@/lib/i18n';
import { RubricForm } from '@/pages/rubrics/components/rubric-form';
import { index as rubricsIndex, show as rubricShow } from '@/routes/rubrics';
import type {
    EmploymentTypeOption,
    Rubric,
    RubricCategory,
    RubricOptions,
    RubricRegulation,
} from '@/types/remuneration';

type PageProps = {
    rubric: Rubric;
    categories: RubricCategory[];
    regulations: RubricRegulation[];
    organizations: { id: string; name: string; code: string }[];
    employmentTypes: EmploymentTypeOption[];
    options: RubricOptions;
};

export default function RubricEdit({ rubric, ...props }: PageProps) {
    return (
        <>
            <Head title={__('Edit Rubric: :code', { code: rubric.code })} />
            <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-2">
                    <Link
                        href={rubricShow(rubric.id)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" /> {__('Back to Rubric')}
                    </Link>
                    <Heading
                        title={__('Edit Rubric: :code', { code: rubric.code })}
                        description={rubric.activity}
                    />
                </div>

                <RubricForm
                    {...props}
                    rubric={rubric}
                    cancelHref={rubricShow.url(rubric.id)}
                />
            </div>
        </>
    );
}

RubricEdit.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Rubrics'), href: rubricsIndex() },
        { title: __('Edit'), href: '' },
    ],
};
