import { Form } from '@inertiajs/react';
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

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CreateStudentModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Student</DialogTitle>
                    <DialogDescription>
                        Add a new student record. They can link an account
                        later via registration.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    action="/students"
                    method="post"
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormErrorList errors={errors} />
                            <StudentFormFields idPrefix="create" errors={errors} />
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner className="size-4" />}
                                    Create Student
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
