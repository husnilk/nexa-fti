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

        Schema::create('inventory_issues', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('inventory_request_id')->constrained();
            $table->foreignId('warehouse_id')->constrained();
            $table->string('issue_number')->unique();
            $table->date('issue_date');
            $table->foreignId('issued_by');
            $table->foreignId('issued_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_issues');
    }
};
