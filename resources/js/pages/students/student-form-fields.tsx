import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FORM_FIELD_KEYS = [
    'student_id',
    'first_name',
    'last_name',
    'birthday',
] as const;

type FormErrors = Partial<Record<string, string>> | undefined;

type Props = {
    idPrefix: string;
    errors?: FormErrors;
    defaultValues?: {
        student_id: string;
        first_name: string;
        last_name: string;
        birthday: string;
    };
};

export function FormErrorList({ errors }: { errors: FormErrors }) {
    const messages = errors
        ? FORM_FIELD_KEYS.map((k) => errors[k]).filter(Boolean) as string[]
        : [];
    if (messages.length === 0) return null;
    return (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            <ul className="list-inside list-disc space-y-0.5">
                {messages.map((msg) => (
                    <li key={msg}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}

export function StudentFormFields({
    idPrefix,
    errors,
    defaultValues,
}: Props) {
    const id = (name: string) => `${idPrefix}_${name}`;
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor={id('student_id')}>Student ID</Label>
                    <Input
                        id={id('student_id')}
                        type="text"
                        name="student_id"
                        required
                        autoComplete="off"
                        placeholder="e.g. 2024-001"
                        defaultValue={defaultValues?.student_id}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={id('birthday')}>Birthday</Label>
                    <div className="relative">
                        <Input
                            id={id('birthday')}
                            type="date"
                            name="birthday"
                            required
                            defaultValue={defaultValues?.birthday}
                            className="pr-9 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full"
                        />
                        <CalendarIcon
                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden
                        />
                    </div>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor={id('first_name')}>First name</Label>
                    <Input
                        id={id('first_name')}
                        type="text"
                        name="first_name"
                        required
                        autoComplete="given-name"
                        placeholder="Juan"
                        defaultValue={defaultValues?.first_name}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={id('last_name')}>Last name</Label>
                    <Input
                        id={id('last_name')}
                        type="text"
                        name="last_name"
                        required
                        autoComplete="family-name"
                        placeholder="Dela Cruz"
                        defaultValue={defaultValues?.last_name}
                    />
                </div>
            </div>
        </>
    );
}
