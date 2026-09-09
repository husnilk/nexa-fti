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

        Schema::create('equipment_disposals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('disposal_number')->unique();
            $table->date('disposal_date');
            $table->string('title');
            $table->text('reason')->nullable();
            $table->enum('disposal_method', ['sold', 'donated', 'scrapped', 'lost', 'mutation']);
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'completed']);
            $table->foreignId('proposed_by')->nullable()->constrained('employees');
            $table->foreignId('approved_by')->nullable()->constrained('employees');
            $table->timestamp('approved_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('proposed_by_id')->nullable();
            $table->foreignId('approved_by_id')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_disposals');
    }
};
