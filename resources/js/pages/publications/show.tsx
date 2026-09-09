import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Trash2,
    UserPlus,
    Users as UsersIcon,
    BookOpen,
    Building2,
    Calendar,
    Globe,
    Info,
    Hash,
    Layers,
    MapPin,
} from 'lucide-react';
import { useState } from 'react';
import {
    store as authorStore,
    destroy as authorDestroy,
} from '@/actions/App/Http/Controllers/Academic/PublicationAuthorController';
import { index as publicationIndex } from '@/actions/App/Http/Controllers/Academic/PublicationController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Auth, Publication, User } from '@/types';

interface PageProps {
    auth: Auth;
    publication: Publication;
    users: User[];
}

const typeColors: Record<string, string> = {
    journal:
        'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400',
    conference:
        'bg-amber-50 text-amber-700 dark:bg-amber-950/35 dark:text-amber-400',
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

export default function PublicationShow({ publication, users }: PageProps) {
    const [isAddingAuthor, setIsAddingAuthor] = useState(false);

    const authorForm = useForm({
        publication_id: publication?.id || '',
        author_id: '',
        author_order: 1,
        is_corresponding: false,
        user_id: '',
    });

    if (!publication) {
        return null;
    }

    const handleAddAuthor = (e: React.FormEvent) => {
        e.preventDefault();
        authorForm.post(authorStore.url(), {
            onSuccess: () => {
                setIsAddingAuthor(false);
                authorForm.reset(
                    'author_id',
                    'author_order',
                    'is_corresponding',
                    'user_id',
                );
            },
        });
    };

    const handleRemoveAuthor = (authorId: string) => {
        if (confirm('Are you sure you want to remove this author?')) {
            router.delete(authorDestroy.url(authorId));
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title={`Publication: ${publication.title}`} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div className="flex items-center gap-4">
                    <Link href={publicationIndex().url}>
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
                            {publication.title}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            DOI: {publication.doi || 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`capitalize font-semibold py-1 px-3 text-sm ${typeColors[publication.type] || ''}`}
                    >
                        {publication.type}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="size-5 text-primary" />
                            Publication Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Abstract
                            </Label>
                            <p className="mt-1 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {publication.abstract ||
                                    'No abstract provided.'}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Publication Date
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    {dateFormatter.format(
                                        new Date(publication.publication_date),
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    DOI
                                </span>
                                <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-300">
                                    {publication.doi || '-'}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    URL
                                </span>
                                {publication.url ? (
                                    <a
                                        href={publication.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                    >
                                        <Globe className="size-4" />
                                        Visit Publication
                                    </a>
                                ) : (
                                    <span className="font-medium">-</span>
                                )}
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Related Research
                                </span>
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                    {publication.research?.title || '-'}
                                </span>
                            </div>
                        </div>

                        {publication.type === 'journal' &&
                            publication.journal_publication && (
                                <div className="mt-2 space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <BookOpen className="size-5" />
                                        <h4 className="font-semibold">
                                            Journal Details
                                        </h4>
                                    </div>
                                    <div className="grid gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Journal Name
                                            </span>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {
                                                    publication
                                                        .journal_publication
                                                        .journal_name
                                                }
                                            </span>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Publisher
                                            </span>
                                            <span className="font-medium">
                                                {publication
                                                    .journal_publication
                                                    .publisher || '-'}
                                            </span>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                ISSN
                                            </span>
                                            <span className="font-mono text-xs bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded border dark:border-zinc-800">
                                                {publication
                                                    .journal_publication
                                                    .issn || '-'}
                                            </span>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Indexing & Quartile
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">
                                                    {publication
                                                        .journal_publication
                                                        .indexing || '-'}
                                                </Badge>
                                                {publication
                                                    .journal_publication
                                                    .quartile && (
                                                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-400 hover:bg-emerald-50 border-emerald-200">
                                                        {
                                                            publication
                                                                .journal_publication
                                                                .quartile
                                                        }
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Volume / Issue / Pages
                                            </span>
                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Layers className="size-3 text-muted-foreground" />
                                                    Vol.{' '}
                                                    {publication
                                                        .journal_publication
                                                        .volume || '-'}
                                                </span>
                                                <span className="text-muted-foreground/30">
                                                    |
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Hash className="size-3 text-muted-foreground" />
                                                    No.{' '}
                                                    {publication
                                                        .journal_publication
                                                        .issue || '-'}
                                                </span>
                                                <span className="text-muted-foreground/30">
                                                    |
                                                </span>
                                                <span>
                                                    pp.{' '}
                                                    {publication
                                                        .journal_publication
                                                        .pages || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {publication.type === 'conference' &&
                            publication.conference_proceeding && (
                                <div className="mt-2 space-y-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Building2 className="size-5" />
                                        <h4 className="font-semibold">
                                            Conference Details
                                        </h4>
                                    </div>
                                    <div className="grid gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Conference Name
                                            </span>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {
                                                    publication
                                                        .conference_proceeding
                                                        .conference_name
                                                }
                                            </span>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Location
                                            </span>
                                            <div className="flex items-center gap-2 font-medium">
                                                <MapPin className="size-4 text-muted-foreground" />
                                                {publication
                                                    .conference_proceeding
                                                    .conference_location || '-'}
                                            </div>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Conference Date
                                            </span>
                                            <div className="flex items-center gap-2 font-medium">
                                                <Calendar className="size-4 text-muted-foreground" />
                                                {publication
                                                    .conference_proceeding
                                                    .conference_date
                                                    ? dateFormatter.format(
                                                          new Date(
                                                              publication.conference_proceeding.conference_date,
                                                          ),
                                                      )
                                                    : '-'}
                                            </div>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Publisher & ISBN
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-sm">
                                                    {publication
                                                        .conference_proceeding
                                                        .publisher || '-'}
                                                </span>
                                                <span className="text-muted-foreground/30">
                                                    |
                                                </span>
                                                <span className="font-mono text-xs bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded border dark:border-zinc-800">
                                                    ISBN:{' '}
                                                    {publication
                                                        .conference_proceeding
                                                        .isbn || '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <Separator className="opacity-50" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Indexing & Pages
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary">
                                                    {publication
                                                        .conference_proceeding
                                                        .indexing || '-'}
                                                </Badge>
                                                {publication
                                                    .conference_proceeding
                                                    .pages && (
                                                    <span className="text-sm font-medium">
                                                        pp.{' '}
                                                        {
                                                            publication
                                                                .conference_proceeding
                                                                .pages
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <UsersIcon className="size-4 text-primary" />
                            Authors
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsAddingAuthor(true)}
                            title="Add Author"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                        >
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {publication.publication_authors
                                ?.sort((a, b) => a.author_order - b.author_order)
                                .map((author) => (
                                    <div
                                        key={author.id}
                                        className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/35 dark:text-indigo-400 font-bold text-xs">
                                                {author.author_order}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="flex items-center gap-2 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {author.author?.name ||
                                                        'Unknown'}
                                                    {author.is_corresponding && (
                                                        <Badge className="h-4 px-1 py-0 text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/35 dark:text-blue-400 border-blue-200">
                                                            Corr.
                                                        </Badge>
                                                    )}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground font-medium">
                                                    {author.user?.name
                                                        ? author.user.name
                                                        : 'External Author'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                            onClick={() =>
                                                handleRemoveAuthor(author.id)
                                            }
                                            title="Remove Author"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            {(!publication.publication_authors ||
                                publication.publication_authors.length ===
                                    0) && (
                                <div className="py-10 text-center space-y-2">
                                    <UsersIcon className="h-10 w-10 mx-auto text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground font-medium">
                                        No authors added yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Author Dialog */}
            <Dialog open={isAddingAuthor} onOpenChange={setIsAddingAuthor}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Publication Author</DialogTitle>
                        <DialogDescription>
                            Add an author to this publication.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddAuthor}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="author_id">Author (User)</Label>
                                <Select
                                    value={authorForm.data.author_id}
                                    onValueChange={(val) => {
                                        authorForm.setData((data) => ({
                                            ...data,
                                            author_id: val,
                                            user_id: val,
                                        }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="author_order">
                                        Author Order
                                    </Label>
                                    <Input
                                        id="author_order"
                                        type="number"
                                        min="1"
                                        value={authorForm.data.author_order}
                                        onChange={(e) =>
                                            authorForm.setData(
                                                'author_order',
                                                parseInt(e.target.value) || 1,
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_corresponding"
                                            checked={
                                                authorForm.data.is_corresponding
                                            }
                                            onCheckedChange={(checked) =>
                                                authorForm.setData(
                                                    'is_corresponding',
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="is_corresponding"
                                            className="cursor-pointer text-sm font-medium"
                                        >
                                            Corresponding Author
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddingAuthor(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={authorForm.processing}
                            >
                                Add Author
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

PublicationShow.layout = {
    breadcrumbs: [
        {
            title: 'Publications',
            href: publicationIndex(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
