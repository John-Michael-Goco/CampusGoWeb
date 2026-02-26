import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import type { LeaderboardsPageProps } from '@/pages/leaderboards/types';
import { LeaderboardSearch } from '@/pages/leaderboards/leaderboard-search';
import { LeaderboardsTable } from '@/pages/leaderboards/leaderboards-table';
import { LeaderboardPaginationBar } from '@/pages/leaderboards/pagination-bar';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Leaderboards', href: '/leaderboards' },
];

export default function Leaderboards({
    entries = [],
    pagination,
    sort = 'xp',
    dir = 'desc',
    search = '',
}: LeaderboardsPageProps) {
    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Leaderboards" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Leaderboards</h1>
                    <LeaderboardSearch search={search} sort={sort} dir={dir} />
                </div>
                <LeaderboardsTable
                    entries={entries}
                    sort={sort}
                    dir={dir}
                    currentPage={pagination?.current_page ?? 1}
                    search={search}
                />
                {pagination && pagination.last_page > 1 && (
                    <LeaderboardPaginationBar pagination={pagination} />
                )}
            </div>
        </AppLayout>
    );
}
