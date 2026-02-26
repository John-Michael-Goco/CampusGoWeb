import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import type { Student } from '@/pages/students/types';
import { Button } from '@/components/ui/button';

type SortColumn = 'student_id' | 'last_name';
type SortDir = 'asc' | 'desc';

type Props = {
    students: Student[];
    sort: SortColumn;
    dir: SortDir;
    currentPage: number;
    search?: string;
    onEdit: (student: Student) => void;
    onDelete: (student: Student) => void;
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
    return `/students?${params.toString()}`;
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

function formatBirthday(birthday: string | null): string {
    if (!birthday) return '—';
    try {
        return new Date(birthday).toLocaleDateString();
    } catch {
        return '—';
    }
}

export function StudentsTable({
    students,
    sort,
    dir,
    currentPage,
    search,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-sidebar-border/70 bg-muted/50 dark:border-sidebar-border dark:bg-muted/20">
                            <SortableHeader
                                label="Student ID"
                                column="student_id"
                                currentSort={sort}
                                currentDir={dir}
                                currentPage={currentPage}
                                search={search}
                            />
                            <SortableHeader
                                label="Last Name"
                                column="last_name"
                                currentSort={sort}
                                currentDir={dir}
                                currentPage={currentPage}
                                search={search}
                            />
                            <th className="px-4 py-3 text-left font-medium">
                                First Name
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                                Birthday
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                                Account
                            </th>
                            <th className="w-24 px-4 py-3 text-right font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-muted-foreground"
                                >
                                    No students found.
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b border-sidebar-border/50 dark:border-sidebar-border/50 last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        {student.student_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.last_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.first_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatBirthday(student.birthday)}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {student.user
                                            ? student.user.username
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() =>
                                                    onEdit(student)
                                                }
                                                title="Update student"
                                                aria-label={`Update ${student.first_name} ${student.last_name}`}
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    onDelete(student)
                                                }
                                                title="Delete"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
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
