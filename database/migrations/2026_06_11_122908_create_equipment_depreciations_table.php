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

        Schema::create('equipment_depreciations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('equipment_id')->constrained();
            $table->date('depreciation_date');
            $table->decimal('acquisition_cost', 14, 2);
            $table->decimal('depreciation_amount', 14, 2);
            $table->decimal('book_value', 14, 2);
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_depreciations');
    }
};
