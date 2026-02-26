<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login: returns API token for mobile.
     * POST /api/login { "username": "...", "password": "..." }
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('username', $request->string('username')->lower())->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => [__('auth.failed')],
            ]);
        }

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Register: create user and return API token. Only registered students can register.
     * users.name is set from first_name + " " + last_name.
     * POST /api/register { "email", "username", "password", "password_confirmation", "student_id", "last_name", "first_name", "birthday" }
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'student_id' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'birthday' => ['required', 'date', 'date_format:Y-m-d'],
        ]);

        $student = Student::where('student_id', $validated['student_id'])->first();

        if (! $student) {
            throw ValidationException::withMessages([
                'student_id' => ['Only registered students can create an account. Please provide a valid student ID.'],
            ]);
        }

        if ($student->user_id !== null) {
            throw ValidationException::withMessages([
                'student_id' => ['This student ID is already linked to an account. Please log in instead.'],
            ]);
        }

        $birthdayMatch = $student->birthday->format('Y-m-d') === $validated['birthday'];
        $nameMatch = Str::lower($student->last_name) === Str::lower($validated['last_name'])
            && Str::lower($student->first_name) === Str::lower($validated['first_name']);

        if (! $nameMatch || ! $birthdayMatch) {
            throw ValidationException::withMessages([
                'student_id' => ['The student ID, last name, first name, or birthday does not match our records. Only registered students can create an account.'],
            ]);
        }

        $user = User::create([
            'name' => trim($validated['first_name']).' '.trim($validated['last_name']),
            'email' => $validated['email'],
            'username' => Str::lower($validated['username']),
            'password' => Hash::make($validated['password']),
            'level' => 1,
            'xp' => 0,
            'is_gamemaster' => false,
        ]);

        $student->update(['user_id' => $user->id]);

        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * Logout: revoke current token.
     * POST /api/logout with Authorization: Bearer {token}
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Get authenticated user.
     * GET /api/user with Authorization: Bearer {token}
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
        ]);
    }
}
