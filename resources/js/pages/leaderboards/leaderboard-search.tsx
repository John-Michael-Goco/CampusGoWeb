import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
    search: string;
    sort: string;
    dir: string;
};

export function LeaderboardSearch({
    search = '',
    sort,
    dir,
}: Props) {
    return (
        <form
            method="get"
            action="/leaderboards"
            className="flex gap-2"
        >
            <input type="hidden" name="sort" value={sort} />
            <input type="hidden" name="dir" value={dir} />
            <input type="hidden" name="page" value="1" />
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    type="search"
                    name="search"
                    placeholder="Search by Student ID..."
                    defaultValue={search}
                    className="pl-9"
                    aria-label="Search leaderboard"
                />
            </div>
            <Button type="submit" variant="secondary">
                Search
            </Button>
        </form>
    );
}
