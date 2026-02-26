import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination } from '@/pages/students/types';
import { Button } from '@/components/ui/button';

type Props = {
    pagination: Pagination;
};

export function PaginationBar({ pagination }: Props) {
    const { links, current_page, last_page, from, to, total } = pagination;
    const prevLink = links.length > 0 ? links[0] : null;
    const nextLink = links.length > 1 ? links[links.length - 1] : null;
    const pageLinks = links.slice(1, links.length - 1);

    if (last_page <= 1) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sidebar-border/70 px-4 py-3 dark:border-sidebar-border">
            <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium">
                    {from ?? 0}-{to ?? 0}
                </span>{' '}
                of <span className="font-medium">{total}</span> results
            </p>
            <nav className="flex items-center gap-1" aria-label="Pagination">
                {prevLink?.url ? (
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href={prevLink.url} preserveState>
                            <ChevronLeft className="size-4" />
                            <span className="sr-only">Previous</span>
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        disabled
                    >
                        <ChevronLeft className="size-4" />
                        <span className="sr-only">Previous</span>
                    </Button>
                )}
                <span className="flex items-center gap-1 px-2">
                    {pageLinks.map((link, i) =>
                        link.url ? (
                            <Link
                                key={link.url || i}
                                href={link.url}
                                preserveState
                                className={
                                    link.active
                                        ? 'flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium'
                                        : 'flex size-8 items-center justify-center rounded-md text-sm text-muted-foreground hover:bg-muted'
                                }
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <span
                                key={`ellipsis-${i}`}
                                className="flex size-8 items-center justify-center text-sm"
                            >
                                {link.label}
                            </span>
                        ),
                    )}
                </span>
                {nextLink?.url ? (
                    <Button variant="outline" size="icon" className="size-8" asChild>
                        <Link href={nextLink.url} preserveState>
                            <ChevronRight className="size-4" />
                            <span className="sr-only">Next</span>
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        disabled
                    >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Next</span>
                    </Button>
                )}
            </nav>
        </div>
    );
}
