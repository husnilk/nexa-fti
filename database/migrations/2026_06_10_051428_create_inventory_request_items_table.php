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

        Schema::create('inventory_request_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('inventory_request_id')->constrained();
            $table->foreignId('item_id')->nullable()->constrained();
            $table->string('item_name')->nullable();
            $table->text('specification')->nullable();
            $table->integer('quantity');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_request_items');
    }
};
