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
        Schema::create('performance_feedback', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedInteger('performance_id')->nullable();
            $table->integer('process')->nullable();
            $table->integer('user_id')->nullable();
            $table->integer('activity')->nullable();
            $table->text('log')->nullable();
            $table->text('description')->nullable();
            $table->integer('is_read')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance_feedback');
    }
};
