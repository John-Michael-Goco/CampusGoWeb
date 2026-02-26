import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { Student } from '@/pages/students/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import {
    FormErrorList,
    StudentFormFields,
} from '@/pages/students/student-form-fields';

function formatBirthday(birthday: string | null): string {
    if (!birthday) return '';
    if (typeof birthday === 'string' && birthday.length >= 10)
        return birthday.slice(0, 10);
    try {
        return new Date(birthday).toISOString().slice(0, 10);
    } catch {
        return '';
    }
}

type Props = {
    student: Student | null;
    errors?: Partial<Record<string, string>>;
    status?: string;
    onClose: () => void;
};

/** Update Student form modal; opens when clicking the pencil (Update) button in the table Actions column. */
export function EditStudentModal({ student, errors, status, onClose }: Props) {
    const [processing, setProcessing] = useState(false);
    const open = !!student;
    const defaultValues = student
        ? {
              student_id: student.student_id,
              first_name: student.first_name,
              last_name: student.last_name,
              birthday: formatBirthday(student.birthday),
          }
        : undefined;

    if (!student) return null;

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Student</DialogTitle>
                    <DialogDescription>
                        Update student details. Changes do not affect a linked
                        account.
                    </DialogDescription>
                </DialogHeader>
                {status && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200">
                        {status}
                    </div>
                )}
                <form
                    key={student.id}
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const formData = new FormData(form);
                        const data = Object.fromEntries(
                            [...formData.entries()].filter(
                                ([key]) => key !== '_method',
                            ),
                        ) as Record<string, string>;
                        setProcessing(true);
                        router.put(`/students/${student.id}`, data, {
                            onFinish: () => setProcessing(false),
                        });
                    }}
                >
                    <FormErrorList errors={errors} />
                    <StudentFormFields
                        idPrefix="edit"
                        errors={errors}
                        defaultValues={defaultValues}
                    />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner className="size-4" />}
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
