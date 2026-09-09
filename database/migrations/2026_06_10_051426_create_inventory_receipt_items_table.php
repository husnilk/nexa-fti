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

        Schema::create('inventory_receipt_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('inventory_receipt_id')->constrained();
            $table->foreignId('inventory_procurement_item_id')->constrained();
            $table->integer('quantity');
            $table->decimal('unit_price', 14, 2)->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_receipt_items');
    }
};
