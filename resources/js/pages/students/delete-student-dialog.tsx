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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    student: Student | null;
    onClose: () => void;
};

export function DeleteStudentDialog({ student, onClose }: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [confirmText, setConfirmText] = useState('');
    const [processing, setProcessing] = useState(false);

    const open = !!student;

    const handleClose = () => {
        onClose();
        setStep(1);
        setConfirmText('');
    };

    const handleConfirm = () => {
        if (!student) return;
        if (step === 1) {
            setStep(2);
            return;
        }
        if (confirmText !== 'DELETE') return;
        setProcessing(true);
        router.delete(`/students/${student.id}`, {
            onFinish: () => setProcessing(false),
        });
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {step === 1
                            ? 'Delete student?'
                            : 'Confirm permanent delete'}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1 ? (
                            <p>
                                This will permanently delete
                                {student && (
                                    <strong>
                                        {' '}
                                        {student.first_name} {student.last_name}{' '}
                                        ({student.student_id}){' '}
                                    </strong>
                                )}
                                and their linked account (if any). This cannot
                                be undone.
                            </p>
                        ) : (
                            <p>
                                Type <strong>DELETE</strong> below to confirm.
                                The student and their account will be permanently
                                removed.
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>
                {step === 2 && (
                    <Input
                        type="text"
                        placeholder="Type DELETE to confirm"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="font-mono"
                        autoFocus
                    />
                )}
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={
                            step === 2 && confirmText !== 'DELETE'
                        }
                    >
                        {processing && <Spinner className="size-4" />}
                        {step === 1 ? 'Continue' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
