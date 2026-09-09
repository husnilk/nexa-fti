import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import {
    index as publicationIndex,
    store,
    update,
    destroy,
} from '@/actions/App/Http/Controllers/Academic/PublicationController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import type { Auth, Publication, Research } from '@/types';

interface PageProps {
    auth: Auth;
    publications: Publication[];
    researchProjects: Research[];
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

function can(auth: Auth, ability: string): boolean {
    return (
        auth.roles.includes('super-admin') || auth.permissions.includes(ability)
    );
}

export default function PublicationIndex({
    publications = [],
    researchProjects = [],
}: PageProps) {
    const { auth } = usePage<PageProps>().props;
    const [isCreating, setIsCreating] = useState(false);
    const [editingPublication, setEditingPublication] =
        useState<Publication | null>(null);
    const [deletingPublication, setDeletingPublication] =
        useState<Publication | null>(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const createForm = useForm({
        type: 'journal' as 'journal' | 'conference',
        title: '',
        publication_date: '',
        doi: '',
        url: '',
        abstract: '',
        research_id: '',
        // Journal specific
        journal_name: '',
        issn: '',
        publisher: '',
        volume: '',
        issue: '',
        pages: '',
        indexing: '',
        quartile: '',
        // Conference specific
        conference_name: '',
        conference_location: '',
        conference_date: '',
        isbn: '',
    });

    const editForm = useForm({
        type: 'journal' as 'journal' | 'conference',
        title: '',
        publication_date: '',
        doi: '',
        url: '',
        abstract: '',
        research_id: '',
        // Journal specific
        journal_name: '',
        issn: '',
        publisher: '',
        volume: '',
        issue: '',
        pages: '',
        indexing: '',
        quartile: '',
        // Conference specific
        conference_name: '',
        conference_location: '',
        conference_date: '',
        isbn: '',
    });

    const mayCreate = can(auth, 'publication.manage');
    const mayUpdate = can(auth, 'publication.manage');
    const mayDelete = can(auth, 'publication.manage');

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(store.url(), {
            onSuccess: () => {
                setIsCreating(false);
                createForm.reset();
            },
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingPublication) {
            return;
        }

        editForm.patch(update.url(editingPublication.id), {
            onSuccess: () => {
                setEditingPublication(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingPublication) {
            return;
        }

        router.delete(destroy.url(deletingPublication.id), {
            onSuccess: () => setDeletingPublication(null),
        });
    };

    const openEdit = (pub: Publication) => {
        setEditingPublication(pub);
        const isJournal = pub.type === 'journal';
        const isConf = pub.type === 'conference';

        editForm.setData({
            type: (pub.type === 'unknown' ? 'journal' : pub.type) as
                | 'journal'
                | 'conference',
            title: pub.title,
            publication_date: pub.publication_date,
            doi: pub.doi || '',
            url: pub.url || '',
            abstract: pub.abstract || '',
            research_id: pub.research_id || '',
            // Journal specific
            journal_name:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.journal_name
                    : '',
            issn:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.issn || ''
                    : '',
            publisher:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.publisher || ''
                    : isConf && pub.conference_proceeding
                      ? pub.conference_proceeding.publisher || ''
                      : '',
            volume:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.volume || ''
                    : '',
            issue:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.issue || ''
                    : '',
            pages:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.pages || ''
                    : isConf && pub.conference_proceeding
                      ? pub.conference_proceeding.pages || ''
                      : '',
            indexing:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.indexing || ''
                    : isConf && pub.conference_proceeding
                      ? pub.conference_proceeding.indexing || ''
                      : '',
            quartile:
                isJournal && pub.journal_publication
                    ? pub.journal_publication.quartile || ''
                    : '',
            // Conference specific
            conference_name:
                isConf && pub.conference_proceeding
                    ? pub.conference_proceeding.conference_name
                    : '',
            conference_location:
                isConf && pub.conference_proceeding
                    ? pub.conference_proceeding.conference_location || ''
                    : '',
            conference_date:
                isConf && pub.conference_proceeding
                    ? pub.conference_proceeding.conference_date || ''
                    : '',
            isbn:
                isConf && pub.conference_proceeding
                    ? pub.conference_proceeding.isbn || ''
                    : '',
        });
    };

    const filteredPublications = publications.filter((pub) => {
        const matchesSearch =
            pub.title.toLowerCase().includes(search.toLowerCase()) ||
            pub.doi?.toLowerCase().includes(search.toLowerCase());

        const matchesType = typeFilter === 'all' || pub.type === typeFilter;

        return matchesSearch && matchesType;
    });

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Head title="Publications" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 dark:border-zinc-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Publications
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage academic publications, journals, and conference proceedings.
                    </p>
                </div>
                {mayCreate && (
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-md"
                    >
                        <Plus className="h-4 w-4" /> Add Publication
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border dark:border-zinc-800">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search publications..."
                        className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-10 rounded-md border border-input bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800"
                    >
                        <option value="all">All Types</option>
                        <option value="journal">Journal</option>
                        <option value="conference">Conference</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <th className="py-4 px-6">Title</th>
                                <th className="py-4 px-6">Type</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6 text-center">Authors</th>
                                <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                            {filteredPublications.length > 0 ? (
                                filteredPublications.map((pub) => (
                                    <tr
                                        key={pub.id}
                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                                    >
                                        <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-zinc-50">
                                            {pub.title}
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge
                                                variant="outline"
                                                className={`capitalize font-semibold ${typeColors[pub.type] || ''}`}
                                            >
                                                {pub.type}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                                            {pub.publication_date
                                                ? dateFormatter.format(
                                                      new Date(pub.publication_date),
                                                  )
                                                : '-'}
                                        </td>
                                        <td className="py-4 px-6 text-center text-zinc-700 dark:text-zinc-300">
                                            {pub.publication_authors_count}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    title="View Details"
                                                    className="cursor-pointer h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                                >
                                                    <Link href={`/publications/${pub.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {mayUpdate && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEdit(pub)}
                                                        title="Edit"
                                                        className="cursor-pointer h-8 w-8 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {mayDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeletingPublication(pub)}
                                                        title="Delete"
                                                        className="cursor-pointer h-8 w-8 text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                                        No publications found matching the filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Publication</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new publication.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Publication Type</Label>
                                <Select
                                    value={createForm.data.type}
                                    onValueChange={(val) =>
                                        createForm.setData(
                                            'type',
                                            val as 'journal' | 'conference',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="journal">
                                            Journal Publication
                                        </SelectItem>
                                        <SelectItem value="conference">
                                            Conference Proceeding
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={createForm.data.title}
                                    onChange={(e) =>
                                        createForm.setData('title', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="publication_date">
                                        Publication Date
                                    </Label>
                                    <Input
                                        id="publication_date"
                                        type="date"
                                        value={createForm.data.publication_date}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'publication_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="doi">DOI</Label>
                                    <Input
                                        id="doi"
                                        value={createForm.data.doi}
                                        onChange={(e) => createForm.setData('doi', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={createForm.data.url}
                                    onChange={(e) => createForm.setData('url', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="abstract">Abstract</Label>
                                <Input
                                    id="abstract"
                                    value={createForm.data.abstract}
                                    onChange={(e) =>
                                        createForm.setData('abstract', e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="research_id">
                                    Related Research Project
                                </Label>
                                <Select
                                    value={createForm.data.research_id}
                                    onValueChange={(val) =>
                                        createForm.setData('research_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select research project (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {researchProjects.map((research) => (
                                            <SelectItem key={research.id} value={research.id}>
                                                {research.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {createForm.data.type === 'journal' && (
                                <div className="mt-4 grid gap-4 border-t pt-4">
                                    <h4 className="font-medium">Journal Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="journal_name">Journal Name *</Label>
                                            <Input
                                                id="journal_name"
                                                value={createForm.data.journal_name}
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        'journal_name',
                                                        e.target.value,
                                                    )
                                                }
                                                required={createForm.data.type === 'journal'}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="issn">ISSN</Label>
                                            <Input
                                                id="issn"
                                                value={createForm.data.issn}
                                                onChange={(e) =>
                                                    createForm.setData('issn', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="publisher">Publisher</Label>
                                            <Input
                                                id="publisher"
                                                value={createForm.data.publisher}
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        'publisher',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="indexing">Indexing</Label>
                                            <Input
                                                id="indexing"
                                                value={createForm.data.indexing}
                                                onChange={(e) =>
                                                    createForm.setData('indexing', e.target.value)
                                                }
                                                placeholder="e.g. Scopus, Web of Science"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="volume">Volume</Label>
                                            <Input
                                                id="volume"
                                                value={createForm.data.volume}
                                                onChange={(e) =>
                                                    createForm.setData('volume', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="issue">Issue</Label>
                                            <Input
                                                id="issue"
                                                value={createForm.data.issue}
                                                onChange={(e) =>
                                                    createForm.setData('issue', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pages">Pages</Label>
                                            <Input
                                                id="pages"
                                                value={createForm.data.pages}
                                                onChange={(e) =>
                                                    createForm.setData('pages', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="quartile">Quartile</Label>
                                            <Input
                                                id="quartile"
                                                value={createForm.data.quartile}
                                                onChange={(e) =>
                                                    createForm.setData('quartile', e.target.value)
                                                }
                                                placeholder="Q1, Q2..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {createForm.data.type === 'conference' && (
                                <div className="mt-4 grid gap-4 border-t pt-4">
                                    <h4 className="font-medium">Conference Information</h4>
                                    <div className="grid gap-2">
                                        <Label htmlFor="conference_name">
                                            Conference Name *
                                        </Label>
                                        <Input
                                            id="conference_name"
                                            value={createForm.data.conference_name}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    'conference_name',
                                                    e.target.value,
                                                )
                                            }
                                            required={createForm.data.type === 'conference'}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="conference_location">Location</Label>
                                            <Input
                                                id="conference_location"
                                                value={createForm.data.conference_location}
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        'conference_location',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="conference_date">
                                                Conference Date
                                            </Label>
                                            <Input
                                                id="conference_date"
                                                type="date"
                                                value={createForm.data.conference_date}
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        'conference_date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="conf_publisher">Publisher</Label>
                                            <Input
                                                id="conf_publisher"
                                                value={createForm.data.publisher}
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        'publisher',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="isbn">ISBN</Label>
                                            <Input
                                                id="isbn"
                                                value={createForm.data.isbn}
                                                onChange={(e) =>
                                                    createForm.setData('isbn', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="conf_pages">Pages</Label>
                                            <Input
                                                id="conf_pages"
                                                value={createForm.data.pages}
                                                onChange={(e) =>
                                                    createForm.setData('pages', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="conf_indexing">Indexing</Label>
                                            <Input
                                                id="conf_indexing"
                                                value={createForm.data.indexing}
                                                onChange={(e) =>
                                                    createForm.setData('indexing', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreating(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={!!editingPublication}
                onOpenChange={() => setEditingPublication(null)}
            >
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Publication</DialogTitle>
                        <DialogDescription>
                            Update the publication details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-type">Publication Type</Label>
                                <Select
                                    value={editForm.data.type}
                                    onValueChange={(val) =>
                                        editForm.setData(
                                            'type',
                                            val as 'journal' | 'conference',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="journal">
                                            Journal Publication
                                        </SelectItem>
                                        <SelectItem value="conference">
                                            Conference Proceeding
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editForm.data.title}
                                    onChange={(e) =>
                                        editForm.setData('title', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-publication_date">
                                        Publication Date
                                    </Label>
                                    <Input
                                        id="edit-publication_date"
                                        type="date"
                                        value={editForm.data.publication_date}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'publication_date',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-doi">DOI</Label>
                                    <Input
                                        id="edit-doi"
                                        value={editForm.data.doi}
                                        onChange={(e) => editForm.setData('doi', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-url">URL</Label>
                                <Input
                                    id="edit-url"
                                    type="url"
                                    value={editForm.data.url}
                                    onChange={(e) => editForm.setData('url', e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-abstract">Abstract</Label>
                                <Input
                                    id="edit-abstract"
                                    value={editForm.data.abstract}
                                    onChange={(e) =>
                                        editForm.setData('abstract', e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-research_id">
                                    Related Research Project
                                </Label>
                                <Select
                                    value={editForm.data.research_id}
                                    onValueChange={(val) =>
                                        editForm.setData('research_id', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select research project (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {researchProjects.map((research) => (
                                            <SelectItem key={research.id} value={research.id}>
                                                {research.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {editForm.data.type === 'journal' && (
                                <div className="mt-4 grid gap-4 border-t pt-4">
                                    <h4 className="font-medium">Journal Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-journal_name">Journal Name *</Label>
                                            <Input
                                                id="edit-journal_name"
                                                value={editForm.data.journal_name}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'journal_name',
                                                        e.target.value,
                                                    )
                                                }
                                                required={editForm.data.type === 'journal'}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-issn">ISSN</Label>
                                            <Input
                                                id="edit-issn"
                                                value={editForm.data.issn}
                                                onChange={(e) =>
                                                    editForm.setData('issn', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-publisher">Publisher</Label>
                                            <Input
                                                id="edit-publisher"
                                                value={editForm.data.publisher}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'publisher',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-indexing">Indexing</Label>
                                            <Input
                                                id="edit-indexing"
                                                value={editForm.data.indexing}
                                                onChange={(e) =>
                                                    editForm.setData('indexing', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-volume">Volume</Label>
                                            <Input
                                                id="edit-volume"
                                                value={editForm.data.volume}
                                                onChange={(e) =>
                                                    editForm.setData('volume', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-issue">Issue</Label>
                                            <Input
                                                id="edit-issue"
                                                value={editForm.data.issue}
                                                onChange={(e) =>
                                                    editForm.setData('issue', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-pages">Pages</Label>
                                            <Input
                                                id="edit-pages"
                                                value={editForm.data.pages}
                                                onChange={(e) =>
                                                    editForm.setData('pages', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-quartile">Quartile</Label>
                                            <Input
                                                id="edit-quartile"
                                                value={editForm.data.quartile}
                                                onChange={(e) =>
                                                    editForm.setData('quartile', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editForm.data.type === 'conference' && (
                                <div className="mt-4 grid gap-4 border-t pt-4">
                                    <h4 className="font-medium">Conference Information</h4>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-conference_name">
                                            Conference Name *
                                        </Label>
                                        <Input
                                            id="edit-conference_name"
                                            value={editForm.data.conference_name}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    'conference_name',
                                                    e.target.value,
                                                )
                                            }
                                            required={editForm.data.type === 'conference'}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-conference_location">Location</Label>
                                            <Input
                                                id="edit-conference_location"
                                                value={editForm.data.conference_location}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'conference_location',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-conference_date">
                                                Conference Date
                                            </Label>
                                            <Input
                                                id="edit-conference_date"
                                                type="date"
                                                value={editForm.data.conference_date}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'conference_date',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-conf_publisher">Publisher</Label>
                                            <Input
                                                id="edit-conf_publisher"
                                                value={editForm.data.publisher}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'publisher',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-isbn">ISBN</Label>
                                            <Input
                                                id="edit-isbn"
                                                value={editForm.data.isbn}
                                                onChange={(e) =>
                                                    editForm.setData('isbn', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-conf_pages">Pages</Label>
                                            <Input
                                                id="edit-conf_pages"
                                                value={editForm.data.pages}
                                                onChange={(e) =>
                                                    editForm.setData('pages', e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-conf_indexing">Indexing</Label>
                                            <Input
                                                id="edit-conf_indexing"
                                                value={editForm.data.indexing}
                                                onChange={(e) =>
                                                    editForm.setData('indexing', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingPublication(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={!!deletingPublication}
                onOpenChange={() => setDeletingPublication(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Publication</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingPublication?.title}"? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingPublication(null)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

PublicationIndex.layout = {
    breadcrumbs: [
        {
            title: 'Publications',
            href: publicationIndex(),
        },
    ],
};
