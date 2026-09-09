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
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('reg_no')->unique();
            $table->date('reg_date');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->enum('gender', ['male', 'female']);
            $table->enum('religion', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']);
            $table->string('email')->unique();
            $table->string('campus_email')->unique()->nullable();
            $table->string('phone_no')->nullable();
            $table->text('home_address')->nullable();
            $table->string('home_town')->nullable();
            $table->string('home_province')->nullable();
            $table->string('home_postalcode')->nullable();
            $table->text('current_address')->nullable();
            $table->string('current_town')->nullable();
            $table->string('current_province')->nullable();
            $table->string('current_postalcode')->nullable();
            $table->uuid('department_id');
            $table->integer('year');
            $table->enum('status', ['active', 'inactive', 'graduated', 'withdrawn', 'on_leave'])->default('active');
            $table->uuid('advisor_id')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();

            $table->foreign('id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('organizations')->onDelete('restrict');
            $table->foreign('advisor_id')->references('id')->on('lecturers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
