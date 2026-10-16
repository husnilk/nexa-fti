import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import BookController from '@/actions/App/Http/Controllers/BookController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { __ } from '@/lib/i18n';
import { index as booksIndex } from '@/routes/books';

interface UserSummary {
    id: string;
    name: string;
}

interface PageProps {
    users: UserSummary[];
}

export default function BookCreate({ users }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'Textbook',
        publisher: '',
        publication_year: new Date().getFullYear(),
        isbn: '',
        description: '',
        authors: [] as string[],
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(BookController.store.url());
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Add Authored Book')} />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={booksIndex()}>
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Add Authored Book')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Create a new book record and associate it with authors.',
                        )}
                    </p>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2"
            >
                <Card className="md:col-span-1">
                    <CardContent className="grid gap-6 pt-6">
                        <h3 className="text-lg font-semibold">
                            {__('Book Information')}
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="title">{__('Book Title')}</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder={__(
                                    'e.g. Introduction to Algorithms',
                                )}
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                {__('Description')}
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder={__('Summary or description...')}
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="grid gap-6 pt-6">
                            <h3 className="text-lg font-semibold">
                                {__('Publication Details')}
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">
                                        {__('Book Type')}
                                    </Label>
                                    <Input
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData('type', e.target.value)
                                        }
                                        placeholder={__(
                                            'e.g. Textbook, Monograph',
                                        )}
                                        required
                                    />
                                    {errors.type && (
                                        <p className="text-sm text-destructive">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="publication_year">
                                        {__('Publication Year')}
                                    </Label>
                                    <Input
                                        id="publication_year"
                                        type="number"
                                        value={data.publication_year}
                                        onChange={(e) =>
                                            setData(
                                                'publication_year',
                                                parseInt(e.target.value) ||
                                                    new Date().getFullYear(),
                                            )
                                        }
                                        required
                                    />
                                    {errors.publication_year && (
                                        <p className="text-sm text-destructive">
                                            {errors.publication_year}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="publisher">
                                    {__('Publisher')}
                                </Label>
                                <Input
                                    id="publisher"
                                    value={data.publisher}
                                    onChange={(e) =>
                                        setData('publisher', e.target.value)
                                    }
                                    placeholder={__('Publisher Name')}
                                />
                                {errors.publisher && (
                                    <p className="text-sm text-destructive">
                                        {errors.publisher}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="isbn">ISBN</Label>
                                <Input
                                    id="isbn"
                                    value={data.isbn}
                                    onChange={(e) =>
                                        setData('isbn', e.target.value)
                                    }
                                    placeholder={__('e.g. 978-3-16-148410-0')}
                                />
                                {errors.isbn && (
                                    <p className="text-sm text-destructive">
                                        {errors.isbn}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="grid gap-6 pt-6">
                            <h3 className="text-lg font-semibold">
                                {__('Authors')}
                            </h3>
                            <div className="max-h-[200px] space-y-3 overflow-y-auto pr-2">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`user-${user.id}`}
                                            checked={data.authors.includes(
                                                user.id,
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setData('authors', [
                                                        ...data.authors,
                                                        user.id,
                                                    ]);
                                                } else {
                                                    setData(
                                                        'authors',
                                                        data.authors.filter(
                                                            (id) =>
                                                                id !== user.id,
                                                        ),
                                                    );
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor={`user-${user.id}`}
                                            className="cursor-pointer text-sm font-normal select-none"
                                        >
                                            {user.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.authors && (
                                <p className="text-sm text-destructive">
                                    {errors.authors}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-3 md:col-span-2">
                    <Link href={booksIndex()}>
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90"
                    >
                        <Save className="h-4 w-4" /> {__('Save Book')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

BookCreate.layout = {
    breadcrumbs: [
        { title: __('Academic'), href: '#' },
        { title: __('Authored Books'), href: booksIndex() },
        { title: __('Add Book'), href: '#' },
    ],
};
