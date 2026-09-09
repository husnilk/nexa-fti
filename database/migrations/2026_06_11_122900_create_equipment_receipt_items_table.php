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

        Schema::create('equipment_receipt_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_receipt_id')->constrained();
            $table->foreignUuid('equipment_procurement_item_id')->constrained();
            $table->decimal('unit_price', 14, 2)->nullable();
            $table->integer('quantity');
            $table->enum('status', ['accepted', 'rejected'])->default('accepted');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_receipt_items');
    }
};
