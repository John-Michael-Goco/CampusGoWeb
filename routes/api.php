<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (REST API for mobile)
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api and use throttle middleware.
| Use Authorization: Bearer {token} for protected routes.
|
*/

Route::middleware('throttle:api')->group(function () {
    // Public: auth
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    // Protected: require valid Bearer token
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        // Add your mobile API endpoints here, e.g.:
        // Route::get('/profile', [ProfileController::class, 'show']);
    });
});
