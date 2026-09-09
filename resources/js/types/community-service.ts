import type { User } from './auth';

export type CommunityServiceStatus = 'proposed' | 'ongoing' | 'completed';

export interface CommunityService {
    id: string;
    title: string;
    description: string | null;
    location: string;
    start_date: string;
    end_date: string | null;
    funding_source: string | null;
    status: CommunityServiceStatus;
    community_service_members_count?: number;
    community_service_members?: CommunityServiceMember[];
    created_at: string;
    updated_at: string;
}

export interface CommunityServiceMember {
    id: string;
    community_service_id: string;
    user_id: string;
    role: string | null;
    user?: User;
    created_at: string;
    updated_at: string;
}
