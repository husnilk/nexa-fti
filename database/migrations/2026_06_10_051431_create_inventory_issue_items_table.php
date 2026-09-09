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

        Schema::create('inventory_issue_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('inventory_issue_id')->constrained();
            $table->foreignId('inventory_issue_item_id')->constrained('inventory_request_items');
            $table->integer('quantity');
            $table->foreignId('inventory_request_item_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_issue_items');
    }
};
