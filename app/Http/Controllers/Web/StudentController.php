<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display the student list (paginated, sortable by student_id and last_name).
     */
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'last_name');
        $dir = $request->query('dir', 'asc');
        $search = $request->query('search', '');
        if (! in_array($sort, ['student_id', 'last_name'], true)) {
            $sort = 'last_name';
        }
        if (! in_array($dir, ['asc', 'desc'], true)) {
            $dir = 'asc';
        }

        $query = Student::query()
            ->with('user:id,name,username,email');

        if (trim($search) !== '') {
            $term = '%'.trim($search).'%';
            $query->where(function ($q) use ($term) {
                $q->where('student_id', 'like', $term)
                    ->orWhere('last_name', 'like', $term)
                    ->orWhere('first_name', 'like', $term);
            });
        }

        $students = $query
            ->orderBy($sort, $dir)
            ->orderBy($sort === 'last_name' ? 'first_name' : 'last_name')
            ->paginate(10)
            ->withQueryString();

        $errors = $request->session()->get('errors');
        $errorBag = $errors?->getBag('default');
        $createErrors = $errorBag
            ? collect($errorBag->getMessages())->map(fn ($m) => $m[0] ?? '')->all()
            : [];

        return Inertia::render('students', [
            'students' => $students->items(),
            'pagination' => [
                'links' => $students->linkCollection()->toArray(),
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
                'from' => $students->firstItem(),
                'to' => $students->lastItem(),
            ],
            'sort' => $sort,
            'dir' => $dir,
            'search' => $search,
            'status' => $request->session()->get('status'),
            'errors' => $createErrors,
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'string', 'max:255', 'unique:students,student_id'],
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date', 'date_format:Y-m-d'],
        ]);

        Student::create([
            'student_id' => $validated['student_id'],
            'last_name' => $validated['last_name'],
            'first_name' => $validated['first_name'],
            'birthday' => $validated['birthday'],
        ]);

        return redirect()->route('students.index')->with('status', 'Student created successfully.');
    }

    /**
     * Update the specified student.
     */
    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'string', 'max:255', 'unique:students,student_id,'.$student->id],
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date', 'date_format:Y-m-d'],
        ]);

        $student->update([
            'student_id' => $validated['student_id'],
            'last_name' => $validated['last_name'],
            'first_name' => $validated['first_name'],
            'birthday' => $validated['birthday'],
        ]);

        return redirect()->route('students.index')->with('status', 'Student updated successfully.');
    }

    /**
     * Remove the student and their linked account (if any).
     */
    public function destroy(Student $student): RedirectResponse
    {
        $userId = $student->user_id;
        $student->delete();
        if ($userId) {
            User::find($userId)?->delete();
        }

        return redirect()->route('students.index')->with('status', 'Student and linked account (if any) deleted.');
    }
}
