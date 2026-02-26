import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import type { Student, StudentsPageProps } from '@/pages/students/types';
import { CREATE_FORM_ERROR_KEYS } from '@/pages/students/types';
import { CreateStudentModal } from '@/pages/students/create-student-modal';
import { EditStudentModal } from '@/pages/students/edit-student-modal';
import { DeleteStudentDialog } from '@/pages/students/delete-student-dialog';
import { PaginationBar } from '@/pages/students/pagination-bar';
import { StudentSearch } from '@/pages/students/student-search';
import { StudentsTable } from '@/pages/students/students-table';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Student List', href: '/students' },
];

export default function Students({
    students = [],
    pagination,
    sort = 'last_name',
    dir = 'asc',
    search = '',
    status,
    errors: pageErrors,
}: StudentsPageProps) {
    const hasCreateErrors =
        pageErrors &&
        CREATE_FORM_ERROR_KEYS.some((key) => pageErrors[key]);
    const [createOpen, setCreateOpen] = useState(!!hasCreateErrors);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="Student List" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Student List</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <StudentSearch search={search} sort={sort} dir={dir} />
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Create Student
                        </Button>
                    </div>
                </div>
                {status && !editingStudent && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200">
                        {status}
                    </div>
                )}
                <StudentsTable
                    students={students}
                    sort={sort}
                    dir={dir}
                    currentPage={pagination?.current_page ?? 1}
                    search={search}
                    onEdit={setEditingStudent}
                    onDelete={setDeleteTarget}
                />
                {pagination && pagination.last_page > 1 && (
                    <PaginationBar pagination={pagination} />
                )}
            </div>

            <CreateStudentModal
                open={createOpen}
                onOpenChange={setCreateOpen}
            />
            <EditStudentModal
                student={editingStudent}
                errors={pageErrors}
                status={status}
                onClose={() => setEditingStudent(null)}
            />
            <DeleteStudentDialog
                student={deleteTarget}
                onClose={() => setDeleteTarget(null)}
            />
        </AppLayout>
    );
}
