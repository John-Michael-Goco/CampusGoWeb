<?php

test('registration screen can be rendered', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    /** @var \Tests\TestCase $this */
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'username' => 'testuser',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});