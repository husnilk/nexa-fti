import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import RubricCategoryController from '@/actions/App/Http/Controllers/RubricCategoryController';
import { Button } from '@/components/ui/button';
import { __ } from '@/lib/i18n';
import { RubricCategoryFormModal } from '@/pages/rubric-categories/components/rubric-category-form-modal';
import { index as rubricCategoriesIndex } from '@/routes/rubric-categories';
import { index as rubricsIndex } from '@/routes/rubrics';
import type { Auth } from '@/types';
import type { RubricCategory } from '@/types/remuneration';

type PageProps = {
    auth: Auth;
    categories: RubricCategory[];
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function RubricCategoriesIndex({ categories }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const mayManage = can(auth, 'rubric.manage');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<RubricCategory | null>(null);

    const handleDelete = (category: RubricCategory) => {
        if (
            confirm(
                __('Are you sure you want to delete :name?', {
                    name: category.name,
                }),
            )
        ) {
            router.delete(RubricCategoryController.destroy.url(category.id), {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(__('Category deleted successfully')),
                onError: (errors) =>
                    toast.error(
                        errors.category ?? __('Could not delete category'),
                    ),
            });
        }
    };

    return (
        <>
            <Head title={__('Rubric Categories')} />

            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
                    <div>
                        <Link
                            href={rubricsIndex()}
                            className="mb-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />{' '}
                            {__('Back to Rubrics')}
                        </Link>
                        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
                            {__('Rubric Categories')}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {__('Group rubrics by area of activity.')}
                        </p>
                    </div>
                    {mayManage && (
                        <Button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="cursor-pointer gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-medium text-white shadow-md hover:from-violet-700 hover:to-indigo-700"
                        >
                            <Plus className="h-4 w-4" />
                            {__('Add Category')}
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse text-left">
                            <thead>
                                <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                    <th className="px-6 py-4">{__('Code')}</th>
                                    <th className="px-6 py-4">
                                        {__('Category')}
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        {__('Rubrics')}
                                    </th>
                                    {mayManage && (
                                        <th className="px-6 py-4 text-right">
                                            {__('Actions')}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-muted-foreground"
                                        >
                                            {__('No categories yet.')}
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50"
                                        >
                                            <td className="px-6 py-4">
                                                <code className="font-mono text-xs text-violet-600 dark:text-violet-400">
                                                    {category.code}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {category.name}
                                                    </span>
                                                    {category.description && (
                                                        <span className="line-clamp-1 text-xs text-muted-foreground">
                                                            {
                                                                category.description
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-zinc-700 dark:text-zinc-300">
                                                {category.rubrics_count ?? 0}
                                            </td>
                                            {mayManage && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            title={__('Edit')}
                                                            onClick={() =>
                                                                setEditingCategory(
                                                                    category,
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 disabled:opacity-40 dark:text-rose-400 dark:hover:text-rose-300"
                                                            title={
                                                                category.rubrics_count
                                                                    ? __(
                                                                          'In use by rubrics',
                                                                      )
                                                                    : __(
                                                                          'Delete',
                                                                      )
                                                            }
                                                            disabled={
                                                                !!category.rubrics_count
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <RubricCategoryFormModal
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                category={null}
            />
            <RubricCategoryFormModal
                open={!!editingCategory}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingCategory(null);
                    }
                }}
                category={editingCategory}
            />
        </>
    );
}

RubricCategoriesIndex.layout = {
    breadcrumbs: [
        { title: __('Remuneration'), href: '#' },
        { title: __('Rubrics'), href: rubricsIndex() },
        { title: __('Categories'), href: rubricCategoriesIndex() },
    ],
};
