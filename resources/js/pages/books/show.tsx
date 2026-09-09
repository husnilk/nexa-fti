import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, BookOpen, Building2, Calendar, Hash, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Book: ${book.title}`} />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={booksIndex()}>
                        <Button variant="outline" size="icon" className="cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {book.title}
                            </h1>
                            <Badge variant="secondary" className="uppercase tracking-wider text-[10px] mt-1">
                                {book.type}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Detailed information about this authored book.
                        </p>
                    </div>
                </div>
                {mayUpdate && (
                    <Link href={bookEdit.url(book.id)}>
                        <Button className="cursor-pointer gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md">
                            <Pencil className="h-4 w-4" /> Edit Book
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Book Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {book.description || 'No description provided for this book.'}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Publisher</p>
                                        <p className="text-sm text-muted-foreground">{book.publisher || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">Publication Year</p>
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
                                        <p className="text-sm font-semibold">ISBN</p>
                                        <p className="text-sm text-muted-foreground font-mono">
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
                            Authors ({book.authors?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {book.authors && book.authors.length > 0 ? (
                            <ul className="space-y-3">
                                {book.authors.map((author) => (
                                    <li key={author.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border dark:border-zinc-800">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {author.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium">{author.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-8 text-center text-sm text-muted-foreground italic">
                                No authors associated with this book.
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
        { title: 'Academic', href: '#' },
        { title: 'Authored Books', href: booksIndex() },
        { title: 'Book Detail', href: '#' },
    ],
};
