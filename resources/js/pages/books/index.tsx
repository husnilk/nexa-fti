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
import { index as booksIndex, create as bookCreate, edit as bookEdit, show as bookShow } from '@/routes/books';
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
    return auth.roles.includes('super-admin') || auth.permissions.includes(ability);
}

export default function BookIndex({ books = [], filters }: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [deletingBook, setDeletingBook] = useState<Book | null>(null);
    const [search, setSearch] = useState(filters.search || '');

    const mayManage = can(auth, 'book.manage');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            booksIndex(),
            { search },
            { preserveState: true }
        );
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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Authored Books" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Authored Books
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and track books authored by faculty members and users.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {mayManage && (
                        <Link href={bookCreate()}>
                            <Button className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md">
                                <Plus className="h-4 w-4" /> Add Book
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <form onSubmit={handleSearch} className="relative w-full md:max-w-xs flex items-center">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search books..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6 w-[200px]">Title</th>
                                <th className="py-4 px-6">Authors</th>
                                <th className="py-4 px-6">Type & Year</th>
                                <th className="py-4 px-6">Publisher</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {books.length > 0 ? (
                                books.map((book) => (
                                    <tr key={book.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col gap-1 max-w-[250px]">
                                                    <span className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2">
                                                        {book.title}
                                                    </span>
                                                    {book.isbn && (
                                                        <span className="text-xs font-mono text-muted-foreground">
                                                            ISBN: {book.isbn}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1">
                                                {book.authors && book.authors.length > 0 ? (
                                                    book.authors.map((author) => (
                                                        <Badge key={author.id} variant="secondary" className="font-normal text-[10px]">
                                                            {author.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">No authors specified</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-0.5">
                                                <Badge variant="outline" className="w-fit text-[10px] uppercase font-semibold">
                                                    {book.type}
                                                </Badge>
                                                {book.publication_year && (
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {book.publication_year}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-700 dark:text-zinc-300">
                                            {book.publisher || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={bookShow.url(book.id)}>
                                                    <Button variant="ghost" size="icon" title="View Detail" className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {mayManage && (
                                                    <>
                                                        <Link href={bookEdit.url(book.id)}>
                                                            <Button variant="ghost" size="icon" title="Edit" className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Delete"
                                                            onClick={() => setDeletingBook(book)}
                                                            className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
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
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No authored books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={deletingBook !== null} onOpenChange={(open) => !open && setDeletingBook(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Book</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm italic">
                        Are you sure you want to delete the book "{deletingBook?.title}"? This action cannot be undone.
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setDeletingBook(null)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={destroyBook} className="cursor-pointer">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

BookIndex.layout = {
    breadcrumbs: [
        { title: 'Academic', href: '#' },
        { title: 'Authored Books', href: booksIndex() },
    ],
};
