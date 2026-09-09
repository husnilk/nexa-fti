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

        Schema::create('committee_expense_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('committee_expense_id')->constrained();
            $table->foreignUuid('committee_budget_item_id')->nullable()->constrained();
            $table->string('description');
            $table->decimal('quantity', 12, 2);
            $table->decimal('unit_price', 14, 2);
            $table->decimal('total_amount', 14, 2);
            $table->string('receipt_number')->nullable();
            $table->string('receipt_file')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_expense_items');
    }
};
