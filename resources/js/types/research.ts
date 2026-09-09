import type { User } from './auth';

export type ResearchStatus = 'proposed' | 'ongoing' | 'completed';

export interface Research {
    id: string;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    funding_source: string | null;
    budget: string | number | null;
    status: ResearchStatus;
    research_members_count?: number;
    research_members?: ResearchMember[];
    created_at: string;
    updated_at: string;
}

export interface ResearchMember {
    id: string;
    research_id: string;
    user_id: string;
    role: string | null;
    user?: User;
    created_at: string;
    updated_at: string;
}
