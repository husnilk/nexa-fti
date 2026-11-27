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
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('period_id')->constrained('periods')->cascadeOnDelete();
            $table->foreignUuid('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->integer('year');
            $table->integer('month');
            $table->integer('present')->nullable();
            $table->integer('absent')->nullable();
            $table->integer('off_site_duty')->nullable();
            $table->integer('study_assignment')->nullable();
            $table->integer('sick_leave')->nullable();
            $table->integer('personal_leave')->nullable();
            $table->integer('long_service_leave')->nullable();
            $table->integer('maternity_leave')->nullable();
            $table->integer('unpaid_leave')->nullable();
            $table->integer('employee_status')->nullable();
            $table->integer('annual_leave')->nullable();
            $table->integer('special_leave')->nullable();
            $table->integer('late_01')->nullable();
            $table->integer('late_02')->nullable();
            $table->integer('late_03')->nullable();
            $table->integer('late_04')->nullable();
            $table->integer('late_05')->nullable();
            $table->integer('late_06')->nullable();
            $table->integer('early_departure_01')->nullable();
            $table->integer('early_departure_02')->nullable();
            $table->integer('early_departure_03')->nullable();
            $table->integer('early_departure_04')->nullable();
            $table->integer('early_departure_05')->nullable();
            $table->integer('early_departure_06')->nullable();
            $table->integer('maternity_leave_01')->nullable();
            $table->integer('maternity_leave_02')->nullable();
            $table->integer('maternity_leave_03')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['employee_id', 'period_id', 'year', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
