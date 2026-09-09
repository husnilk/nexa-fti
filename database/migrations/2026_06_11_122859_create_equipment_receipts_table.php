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

        Schema::create('equipment_receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_procurement_id')->constrained();
            $table->string('receipt_number')->unique();
            $table->date('receipt_date');
            $table->foreignUuid('received_by')->constrained('employees');
            $table->string('supplier_name')->nullable();
            $table->string('invoice_number')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_receipts');
    }
};
