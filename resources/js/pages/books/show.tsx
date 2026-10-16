import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    BookOpen,
    Building2,
    Calendar,
    Hash,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { __ } from '@/lib/i18n';
import { index as booksIndex, edit as bookEdit } from '@/routes/books';
import type { Auth } from '@/types';

interface Author {
    id: string;
    name: string;
}

interface Book {
    id: string;
    title: string;
    type: string;
    publisher?: string;
    publication_year?: number;
    isbn?: string;
    description?: string;
    authors: Author[];
}

type PageProps = {
    auth: Auth;
    book: Book;
};

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function BookShow({ auth, book }: PageProps) {
    const mayUpdate = can(auth, 'book.manage');

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Book: :title', { title: book.title })} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {book.title}
                            </h1>
                            <Badge
                                variant="secondary"
                                className="mt-1 text-[10px] tracking-wider uppercase"
                            >
                                {book.type}
                            </Badge>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                            {__(
                                'Detailed information about this authored book.',
                            )}
                        </p>
                    </div>
                </div>
                {mayUpdate && (
                    <Link href={bookEdit.url(book.id)}>
                        <Button className="cursor-pointer gap-2 bg-indigo-600 font-medium text-white shadow-md hover:bg-indigo-700">
                            <Pencil className="h-4 w-4" /> {__('Edit Book')}
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            {__('Book Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                {__('Description')}
                            </h4>
                            <p className="leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                                {book.description ||
                                    __(
                                        'No description provided for this book.',
                                    )}
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {__('Publisher')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {book.publisher || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {__('Publication Year')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {book.publication_year || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Hash className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            ISBN
                                        </p>
                                        <p className="font-mono text-sm text-muted-foreground">
                                            {book.isbn || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {__('Authors (:count)', {
                                count: book.authors?.length || 0,
                            })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {book.authors && book.authors.length > 0 ? (
                            <ul className="space-y-3">
                                {book.authors.map((author) => (
                                    <li
                                        key={author.id}
                                        className="flex items-center gap-3 rounded-lg border bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {author.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {author.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground italic">
                                {__('No authors associated with this book.')}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

BookShow.layout = {
    breadcrumbs: [
        { title: __('Academic'), href: '#' },
        { title: __('Authored Books'), href: booksIndex() },
        { title: __('Book Detail'), href: '#' },
    ],
};
