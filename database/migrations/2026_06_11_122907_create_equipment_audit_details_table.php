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

        Schema::create('equipment_audit_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('equipment_audit_id')->constrained();
            $table->foreignId('equipment_id')->constrained();
            $table->enum('condition', ['excellent', 'good', 'fair', 'damaged', 'broken']);
            $table->boolean('found')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_audit_details');
    }
};
