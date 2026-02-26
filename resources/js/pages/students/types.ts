export type Student = {
    id: number;
    user_id: number;
    student_id: string;
    last_name: string;
    first_name: string;
    birthday: string | null;
    user?: {
        id: number;
        name: string;
        username: string;
        email: string;
    };
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

export type StudentsPageProps = {
    students?: Student[];
    pagination?: Pagination;
    sort?: 'student_id' | 'last_name';
    dir?: 'asc' | 'desc';
    search?: string;
    status?: string;
    errors?: Partial<Record<string, string>>;
};

export const CREATE_FORM_ERROR_KEYS = [
    'student_id',
    'first_name',
    'last_name',
    'birthday',
] as const;
