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
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->enum('reward_type', ['xp', 'badge', 'coupon']);
            $table->unsignedInteger('amount')->default(0);
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->boolean('is_scalable')->default(false);
            $table->timestamps();

            $table->index('reward_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};
