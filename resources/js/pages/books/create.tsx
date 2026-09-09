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
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Add Authored Book" />
            <div className="flex items-center gap-4 border-b pb-5 dark:border-zinc-800">
                <Link href={booksIndex()}>
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Add Authored Book
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Create a new book record and associate it with authors.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="mx-auto w-full max-w-4xl grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 grid gap-6">
                        <h3 className="text-lg font-semibold">Book Information</h3>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="title">Book Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Introduction to Algorithms"
                                required
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Summary or description..."
                                rows={4}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="pt-6 grid gap-6">
                            <h3 className="text-lg font-semibold">Publication Details</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Book Type</Label>
                                    <Input
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        placeholder="e.g. Textbook, Monograph"
                                        required
                                    />
                                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="publication_year">Publication Year</Label>
                                    <Input
                                        id="publication_year"
                                        type="number"
                                        value={data.publication_year}
                                        onChange={(e) => setData('publication_year', parseInt(e.target.value) || new Date().getFullYear())}
                                        required
                                    />
                                    {errors.publication_year && <p className="text-sm text-destructive">{errors.publication_year}</p>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="publisher">Publisher</Label>
                                <Input
                                    id="publisher"
                                    value={data.publisher}
                                    onChange={(e) => setData('publisher', e.target.value)}
                                    placeholder="Publisher Name"
                                />
                                {errors.publisher && <p className="text-sm text-destructive">{errors.publisher}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="isbn">ISBN</Label>
                                <Input
                                    id="isbn"
                                    value={data.isbn}
                                    onChange={(e) => setData('isbn', e.target.value)}
                                    placeholder="e.g. 978-3-16-148410-0"
                                />
                                {errors.isbn && <p className="text-sm text-destructive">{errors.isbn}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 grid gap-6">
                            <h3 className="text-lg font-semibold">Authors</h3>
                            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`user-${user.id}`} 
                                            checked={data.authors.includes(user.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setData('authors', [...data.authors, user.id]);
                                                } else {
                                                    setData('authors', data.authors.filter(id => id !== user.id));
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`user-${user.id}`} className="text-sm font-normal cursor-pointer select-none">
                                            {user.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.authors && <p className="text-sm text-destructive">{errors.authors}</p>}
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3">
                    <Link href={booksIndex()}>
                        <Button type="button" variant="outline" className="cursor-pointer">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing} className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md gap-2">
                        <Save className="h-4 w-4" /> Save Book
                    </Button>
                </div>
            </form>
        </div>
    );
}

BookCreate.layout = {
    breadcrumbs: [
        { title: 'Academic', href: '#' },
        { title: 'Authored Books', href: booksIndex() },
        { title: 'Add Book', href: '#' },
    ],
};
