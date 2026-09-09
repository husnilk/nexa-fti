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

        Schema::create('inventory_receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('inventory_procurement_id')->nullable()->constrained();
            $table->foreignId('warehouse_id')->constrained();
            $table->string('receipt_number')->unique();
            $table->date('receipt_date');
            $table->foreignId('received_by')->constrained('employees');
            $table->foreignId('received_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_receipts');
    }
};
