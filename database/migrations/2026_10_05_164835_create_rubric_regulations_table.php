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
        Schema::create('rubric_regulations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('regulation_number');
            $table->string('regulation_year');
            $table->text('description')->nullable();
            $table->text('file_path')->nullable();
            $table->integer('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubric_regulations');
    }
};
