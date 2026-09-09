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

        Schema::create('committee_budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('committee_id')->constrained();
            $table->string('budget_number')->unique();
            $table->string('title');
            $table->foreignUuid('prepared_by')->nullable()->constrained('employees');
            $table->date('prepared_at');
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected']);
            $table->foreignUuid('approved_by')->nullable()->constrained('employees');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('prepared_by_id');
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
        Schema::dropIfExists('committee_budgets');
    }
};
