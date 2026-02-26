<?php

use App\Models\Student;
use App\Models\User;

test('api register requires student_id and student fields', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->postJson('/api/register', [
        'email' => 'test@example.com',
        'username' => 'testuser',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['student_id', 'last_name', 'first_name', 'birthday']);
});

test('api register rejects invalid student_id', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->postJson('/api/register', [
        'email' => 'test@example.com',
        'username' => 'testuser',
        'password' => 'password',
        'password_confirmation' => 'password',
        'student_id' => 'INVALID-999',
        'last_name' => 'Doe',
        'first_name' => 'Jane',
        'birthday' => '2000-01-15',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['student_id']);
    expect(Student::where('student_id', 'INVALID-999')->first())->toBeNull();
});

test('api register rejects when student already has account', function () {
    /** @var \Tests\TestCase $this */
    $user = User::factory()->create();
    Student::create([
        'user_id' => $user->id,
        'student_id' => '2024-001',
        'last_name' => 'Doe',
        'first_name' => 'Jane',
        'birthday' => '2000-01-15',
    ]);

    $response = $this->postJson('/api/register', [
        'email' => 'other@example.com',
        'username' => 'otheruser',
        'password' => 'password',
        'password_confirmation' => 'password',
        'student_id' => '2024-001',
        'last_name' => 'Doe',
        'first_name' => 'Jane',
        'birthday' => '2000-01-15',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['student_id']);
});

test('api register rejects when name or birthday does not match student', function () {
    /** @var \Tests\TestCase $this */
    Student::create([
        'user_id' => null,
        'student_id' => '2024-002',
        'last_name' => 'Doe',
        'first_name' => 'Jane',
        'birthday' => '2000-01-15',
    ]);

    $response = $this->postJson('/api/register', [
        'email' => 'wrong@example.com',
        'username' => 'wronguser',
        'password' => 'password',
        'password_confirmation' => 'password',
        'student_id' => '2024-002',
        'last_name' => 'Wrong',
        'first_name' => 'Person',
        'birthday' => '1999-12-31',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors(['student_id']);
});

test('api register creates user and links student when data matches', function () {
    /** @var \Tests\TestCase $this */
    $student = Student::create([
        'user_id' => null,
        'student_id' => '2024-003',
        'last_name' => 'Doe',
        'first_name' => 'Jane',
        'birthday' => '2000-01-15',
    ]);

    $response = $this->postJson('/api/register', [
        'email' => 'jane@example.com',
        'username' => 'janedoe',
        'password' => 'password',
        'password_confirmation' => 'password',
        'student_id' => '2024-003',
        'last_name' => 'Doe',
        'first_name' => 'Jane',
        'birthday' => '2000-01-15',
    ]);

    $response->assertCreated();
    $response->assertJsonStructure([
        'token',
        'token_type',
        'user' => ['id', 'name', 'username', 'email'],
    ]);
    $response->assertJson([
        'token_type' => 'Bearer',
        'user' => [
            'name' => 'Jane Doe',
            'username' => 'janedoe',
            'email' => 'jane@example.com',
        ],
    ]);

    $user = User::where('username', 'janedoe')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Jane Doe');

    $student->refresh();
    expect($student->user_id)->toBe($user->id);
});
