import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import BookController from '@/actions/App/Http/Controllers/BookController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { __ } from '@/lib/i18n';
import {
    index as booksIndex,
    create as bookCreate,
    edit as bookEdit,
    show as bookShow,
} from '@/routes/books';
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

interface PageProps {
    auth: Auth;
    books: Book[];
    filters: {
        search?: string;
    };
    [key: string]: any;
}

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function BookIndex({ books = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingBook, setDeletingBook] = useState<Book | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const mayManage = can(auth, 'book.manage');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(booksIndex(), { search }, { preserveState: true });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(booksIndex(), {}, { preserveState: true });
    };

    function destroyBook(): void {
        if (!deletingBook) {
            return;
        }

        router.delete(BookController.destroy.url(deletingBook.id), {
            preserveScroll: true,
            onSuccess: () => setDeletingBook(null),
        });
    }

    return (
        <div className="container mx-auto space-y-6 px-4 py-8">
            <Head title={__('Authored Books')} />

            <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {__('Authored Books')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {__(
                            'Manage and track books authored by faculty members and users.',
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {mayManage && (
                        <Link href={bookCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary font-medium text-primary-foreground shadow-md hover:bg-primary/90">
                                <Plus className="h-4 w-4" /> {__('Add Book')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-zinc-50 p-4 md:flex-row dark:border-zinc-800 dark:bg-zinc-900/50">
                <form
                    onSubmit={handleSearch}
                    className="relative flex w-full items-center md:max-w-xs"
                >
                    <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={__('Search books...')}
                        className="w-full bg-white pr-9 pl-9 dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-zinc-50 text-xs font-semibold tracking-wider text-muted-foreground uppercase dark:border-zinc-800 dark:bg-zinc-900">
                                <th className="w-[200px] px-6 py-4">
                                    {__('Title')}
                                </th>
                                <th className="px-6 py-4">{__('Authors')}</th>
                                <th className="px-6 py-4">
                                    {__('Type & Year')}
                                </th>
                                <th className="px-6 py-4">{__('Publisher')}</th>
                                <th className="w-[150px] px-6 py-4 text-right">
                                    {__('Actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                            {books.length > 0 ? (
                                books.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <div className="flex max-w-[250px] flex-col gap-1">
                                                    <span className="line-clamp-2 font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {book.title}
                                                    </span>
                                                    {book.isbn && (
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            ISBN: {book.isbn}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {book.authors &&
                                                book.authors.length > 0 ? (
                                                    book.authors.map(
                                                        (author) => (
                                                            <Badge
                                                                key={author.id}
                                                                variant="secondary"
                                                                className="text-[10px] font-normal"
                                                            >
                                                                {author.name}
                                                            </Badge>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">
                                                        {__(
                                                            'No authors specified',
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <Badge
                                                    variant="outline"
                                                    className="w-fit text-[10px] font-semibold uppercase"
                                                >
                                                    {book.type}
                                                </Badge>
                                                {book.publication_year && (
                                                    <span className="mt-1 text-xs text-muted-foreground">
                                                        {book.publication_year}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                                            {book.publisher || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={bookShow.url(book.id)}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title={__(
                                                            'View Detail',
                                                        )}
                                                        className="h-8 w-8 cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayManage && (
                                                    <>
                                                        <Link
                                                            href={bookEdit.url(
                                                                book.id,
                                                            )}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title={__(
                                                                    'Edit',
                                                                )}
                                                                className="h-8 w-8 cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            title={__('Delete')}
                                                            onClick={() =>
                                                                setDeletingBook(
                                                                    book,
                                                                )
                                                            }
                                                            className="h-8 w-8 cursor-pointer text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {__('No authored books found.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={deletingBook !== null}
                onOpenChange={(open) => !open && setDeletingBook(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{__('Delete Book')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        {__(
                            'Are you sure you want to delete the book ":title"? This action cannot be undone.',
                            { title: deletingBook?.title },
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingBook(null)}
                            className="cursor-pointer"
                        >
                            {__('Cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={destroyBook}
                            className="cursor-pointer"
                        >
                            {__('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

BookIndex.layout = {
    breadcrumbs: [
        { title: __('Academic'), href: '#' },
        { title: __('Authored Books'), href: booksIndex() },
    ],
};
