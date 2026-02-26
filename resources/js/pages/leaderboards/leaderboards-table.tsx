import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye } from 'lucide-react';
import type { LeaderboardEntry } from '@/pages/leaderboards/types';
import { Button } from '@/components/ui/button';

type SortColumn = 'rank' | 'student_id' | 'level' | 'xp';
type SortDir = 'asc' | 'desc';

type Props = {
    entries: LeaderboardEntry[];
    sort: SortColumn;
    dir: SortDir;
    currentPage: number;
    search?: string;
};

function buildSortHref(
    column: SortColumn,
    nextDir: SortDir,
    currentPage: number,
    search?: string,
): string {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('sort', column);
    params.set('dir', nextDir);
    if (search?.trim()) params.set('search', search.trim());
    return `/leaderboards?${params.toString()}`;
}

function SortableHeader({
    label,
    column,
    currentSort,
    currentDir,
    currentPage,
    search,
}: {
    label: string;
    column: SortColumn;
    currentSort: SortColumn;
    currentDir: SortDir;
    currentPage: number;
    search?: string;
}) {
    const isActive = currentSort === column;
    const nextDir = isActive && currentDir === 'asc' ? 'desc' : 'asc';
    const href = buildSortHref(column, nextDir, currentPage, search);
    return (
        <th className="px-4 py-3 text-left font-medium">
            <Link
                href={href}
                preserveState
                className="inline-flex items-center gap-1.5 hover:underline"
                title="Click to sort"
            >
                {label}
                <span className="text-muted-foreground" aria-hidden>
                    {isActive ? (
                        currentDir === 'asc' ? (
                            <ArrowUp className="size-3.5" />
                        ) : (
                            <ArrowDown className="size-3.5" />
                        )
                    ) : (
                        <ArrowUpDown className="size-3.5 opacity-60" />
                    )}
                </span>
            </Link>
        </th>
    );
}

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) {
        return (
            <span
                className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/90 font-bold text-amber-950 shadow-sm"
                title="1st place"
            >
                {rank}
            </span>
        );
    }
    if (rank === 2) {
        return (
            <span
                className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 font-bold text-slate-700 shadow-sm dark:bg-slate-500 dark:text-slate-100"
                title="2nd place"
            >
                {rank}
            </span>
        );
    }
    if (rank === 3) {
        return (
            <span
                className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-600/80 font-bold text-amber-100 shadow-sm"
                title="3rd place"
            >
                {rank}
            </span>
        );
    }
    return (
        <span className="inline-flex size-8 flex-shrink-0 items-center justify-center rounded-md bg-muted font-semibold text-muted-foreground">
            {rank}
        </span>
    );
}

export function LeaderboardsTable({
    entries,
    sort,
    dir,
    currentPage,
    search,
}: Props) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border dark:bg-muted/20">
                            <SortableHeader
                                label="Rank"
                                column="rank"
                                currentSort={sort}
                                currentDir={dir}
                                currentPage={currentPage}
                                search={search}
                            />
                            <SortableHeader
                                label="Student ID"
                                column="student_id"
                                currentSort={sort}
                                currentDir={dir}
                                currentPage={currentPage}
                                search={search}
                            />
                            <th className="px-4 py-3 text-left font-medium">
                                Name
                            </th>
                            <SortableHeader
                                label="Level"
                                column="level"
                                currentSort={sort}
                                currentDir={dir}
                                currentPage={currentPage}
                                search={search}
                            />
                            <SortableHeader
                                label="EXP"
                                column="xp"
                                currentSort={sort}
                                currentDir={dir}
                                currentPage={currentPage}
                                search={search}
                            />
                            <th className="w-32 px-4 py-3 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-muted-foreground"
                                >
                                    No entries found.
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr
                                    key={entry.id}
                                    className="border-b border-sidebar-border/50 dark:border-sidebar-border/50 last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <RankBadge rank={entry.rank} />
                                    </td>
                                    <td className="px-4 py-3">
                                        {entry.student_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        {entry.last_name}, {entry.first_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {entry.level}
                                    </td>
                                    <td className="px-4 py-3">
                                        {entry.xp}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-1.5"
                                            asChild
                                        >
                                            <Link
                                                href="#"
                                                preserveState
                                                className="inline-flex items-center"
                                            >
                                                <Eye className="size-4" />
                                                View Player
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
