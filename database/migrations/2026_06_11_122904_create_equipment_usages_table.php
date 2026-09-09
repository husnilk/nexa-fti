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
        Schema::disableForeignKeyConstraints();

        Schema::create('equipment_usages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_id')->constrained();
            $table->enum('borrower_type', ['employee', 'student']);
            $table->foreignUuid('borrower_id')->constrained('users');
            $table->dateTime('planned_start_date');
            $table->dateTime('planned_return_date');
            $table->dateTime('actual_start_date')->nullable();
            $table->dateTime('actual_return_date')->nullable();
            $table->text('purpose')->nullable();
            $table->enum('status', ['requested', 'approved', 'rejected', 'borrowed', 'returned']);
            $table->foreignUuid('approved_by')->nullable()->constrained('employees');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_usages');
    }
};
