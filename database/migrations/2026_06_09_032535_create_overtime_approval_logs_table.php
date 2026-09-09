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

        Schema::create('overtime_approval_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('overtime_request_id')->constrained('overtime_requests')->cascadeOnDelete();
            $table->foreignId('approver_id')->constrained('employees')->cascadeOnDelete();
            $table->enum('status', ['approved', 'rejected']);
            $table->text('notes')->nullable();
            $table->timestamp('action_date')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('overtime_approval_logs');
    }
};
