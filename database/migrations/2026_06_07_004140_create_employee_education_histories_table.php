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
        Schema::create('employee_education_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('employee_id');
            $table->enum('degree', ['S3', 'S2', 'S1', 'D4', 'D3', 'D1', 'SLTA', 'SMP', 'SD', 'TK']);
            $table->string('institution');
            $table->string('major')->nullable();
            $table->integer('start_year');
            $table->integer('end_year');
            $table->decimal('gpa', 4, 2)->nullable();
            $table->string('certificate_file')->nullable();
            $table->timestamps();

            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_education_histories');
    }
};
