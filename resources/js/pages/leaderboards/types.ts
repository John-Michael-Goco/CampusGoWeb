export type LeaderboardEntry = {
    id: number;
    user_id: number | null;
    student_id: string;
    first_name: string;
    last_name: string;
    level: number;
    xp: number;
    rank: number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Pagination = {
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export type LeaderboardsPageProps = {
    entries?: LeaderboardEntry[];
    pagination?: Pagination;
    sort?: 'rank' | 'student_id' | 'level' | 'xp';
    dir?: 'asc' | 'desc';
    search?: string;
};
