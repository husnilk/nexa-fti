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

        Schema::create('equipment_procurement_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_procurement_id')->constrained();
            $table->foreignUuid('equipment_model_id')->nullable()->constrained();
            $table->string('name');
            $table->text('specification')->nullable();
            $table->integer('quantity');
            $table->decimal('estimated_unit_price', 14, 2)->nullable();
            $table->string('purchase_link')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_procurement_items');
    }
};
