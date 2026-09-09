import type { User } from './auth';
import type { Research } from './research';

export interface JournalPublication {
    id: string;
    journal_name: string;
    issn: string | null;
    publisher: string | null;
    volume: string | null;
    issue: string | null;
    pages: string | null;
    indexing: string | null;
    quartile: string | null;
}

export interface ConferenceProceeding {
    id: string;
    conference_name: string;
    conference_location: string | null;
    conference_date: string | null;
    publisher: string | null;
    isbn: string | null;
    pages: string | null;
    indexing: string | null;
}

export interface PublicationAuthor {
    id: string;
    publication_id: string;
    author_id: string;
    author_order: number;
    is_corresponding: boolean;
    user_id: string;
    author?: User;
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface Publication {
    id: string;
    title: string;
    publication_date: string;
    doi: string | null;
    url: string | null;
    abstract: string | null;
    research_id: string | null;
    type: 'journal' | 'conference' | 'unknown';
    journal_publication?: JournalPublication;
    conference_proceeding?: ConferenceProceeding;
    publication_authors?: PublicationAuthor[];
    publication_authors_count?: number;
    research?: Research;
    created_at: string;
    updated_at: string;
}
