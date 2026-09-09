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

        Schema::create('equipment_disposal_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('equipment_disposal_id')->constrained();
            $table->foreignId('equipment_id')->constrained();
            $table->decimal('book_value', 14, 2)->nullable();
            $table->decimal('disposal_value', 14, 2)->nullable();
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
        Schema::dropIfExists('equipment_disposal_items');
    }
};
