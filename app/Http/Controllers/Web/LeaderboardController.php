<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    /**
     * Display the leaderboard (paginated, sortable by rank/student_id/level/xp).
     */
    public function index(Request $request): Response
    {
        $sort = $request->query('sort', 'xp');
        $dir = $request->query('dir', 'desc');
        $search = $request->query('search', '');
        if (! in_array($sort, ['rank', 'student_id', 'level', 'xp'], true)) {
            $sort = 'xp';
        }
        if (! in_array($dir, ['asc', 'desc'], true)) {
            $dir = 'desc';
        }

        $query = Student::query()
            ->join('users', 'students.user_id', '=', 'users.id')
            ->select(
                'students.id',
                'students.user_id',
                'students.student_id',
                'students.first_name',
                'students.last_name',
                'users.level',
                'users.xp'
            )
            ->whereNotNull('students.user_id');

        if (trim($search) !== '') {
            $query->where('students.student_id', 'like', '%'.trim($search).'%');
        }

        $orderColumn = match ($sort) {
            'student_id' => 'students.student_id',
            'level' => 'users.level',
            'rank', 'xp' => 'users.xp',
            default => 'users.xp',
        };
        $query->orderBy($orderColumn, $dir);
        if ($sort === 'xp' || $sort === 'rank') {
            $query->orderBy('users.level', $dir);
        }

        $paginator = $query->paginate(10)->withQueryString();
        $page = $paginator->currentPage();
        $perPage = $paginator->perPage();
        $entries = collect($paginator->items())->map(function ($row, $i) use ($page, $perPage) {
            $arr = is_array($row)
                ? $row
                : (method_exists($row, 'toArray') ? $row->toArray() : (array) $row);
            $arr['rank'] = ($page - 1) * $perPage + $i + 1;

            return $arr;
        })->all();

        return Inertia::render('leaderboards', [
            'entries' => $entries,
            'pagination' => [
                'links' => $paginator->linkCollection()->toArray(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'sort' => $sort,
            'dir' => $dir,
            'search' => $search,
        ]);
    }
}
