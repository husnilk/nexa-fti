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

        Schema::create('equipment_procurements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('procurement_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignUuid('requested_by')->constrained('employees');
            $table->date('request_date');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled']);
            $table->foreignUuid('approved_by')->nullable()->constrained('employees');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_procurements');
    }
};
