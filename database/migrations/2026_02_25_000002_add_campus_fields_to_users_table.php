<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 255)->unique()->after('email');
            $table->string('course')->after('name');
            $table->string('grade_level')->after('course');
            $table->unsignedInteger('level')->default(1)->after('grade_level');
            $table->boolean('is_gamemaster')->default(false)->after('level');
            $table->unsignedInteger('xp')->default(0)->after('is_gamemaster');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'course',
                'grade_level',
                'level',
                'is_gamemaster',
                'xp',
            ]);
        });
    }
};
