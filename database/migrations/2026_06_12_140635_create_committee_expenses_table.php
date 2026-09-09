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

        Schema::create('committee_expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('committee_id')->constrained();
            $table->string('expense_number')->unique();
            $table->date('expense_date');
            $table->foreignUuid('submitted_by')->nullable()->constrained('employees');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected']);
            $table->foreignUuid('approved_by')->nullable()->constrained('employees');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('submitted_by_id');
            $table->foreignId('approved_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_expenses');
    }
};
