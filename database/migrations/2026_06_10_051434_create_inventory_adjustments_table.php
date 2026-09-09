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

        Schema::create('inventory_adjustments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('stock_opname_item_id')->constrained();
            $table->foreignId('warehouse_id')->constrained();
            $table->foreignId('item_id')->constrained();
            $table->integer('adjustment_quantity');
            $table->text('reason')->nullable();
            $table->foreignId('adjusted_by')->constrained('employees');
            $table->dateTime('adjustment_date');
            $table->foreignId('adjusted_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_adjustments');
    }
};
