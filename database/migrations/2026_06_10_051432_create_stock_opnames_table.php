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

        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('warehouse_id')->constrained();
            $table->string('opname_number')->unique();
            $table->date('opname_date');
            $table->foreignId('conducted_by')->constrained('employees');
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'completed']);
            $table->foreignId('conducted_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opnames');
    }
};
