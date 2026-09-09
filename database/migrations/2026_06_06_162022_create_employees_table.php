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
        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('emp_number')->unique();
            $table->string('id_card_number')->unique();
            $table->string('tax_id_number')->nullable();
            $table->string('name');
            $table->string('birth_place');
            $table->date('birth_date');
            $table->enum('gender', ['male', 'female']);
            $table->enum('religion', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha', 'Konghucu', 'Lainnya']);
            $table->string('marital_status');
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->date('join_date');
            $table->uuid('employment_type_id');
            $table->uuid('supervisor_id')->nullable();
            $table->integer('status')->default(1);
            $table->timestamps();

            $table->foreign('id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('employment_type_id')->references('id')->on('employment_types')->onDelete('restrict');
            $table->foreign('supervisor_id')->references('id')->on('employees')->onDelete('set null');
        });

        Schema::create('lecturers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('academic_rank');
            $table->uuid('functional_position_id');
            $table->string('nuptk')->nullable();
            $table->text('expertise')->nullable();
            $table->timestamps();

            $table->foreign('id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('functional_position_id')->references('id')->on('functional_positions')->onDelete('restrict');
        });

        Schema::create('staff', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('position_id');
            $table->text('skills')->nullable();
            $table->timestamps();

            $table->foreign('id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('position_id')->references('id')->on('positions')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
        Schema::dropIfExists('lecturers');
        Schema::dropIfExists('employees');
    }
};
