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
        Schema::create('employment_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('employee_type_id');
            $table->unsignedBigInteger('employment_contract_id');
            $table->string('remun_status');
            $table->timestamps();

            $table->foreign('employee_type_id')->references('id')->on('employee_types')->onDelete('cascade');
            $table->foreign('employment_contract_id')->references('id')->on('employment_contracts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employment_types');
    }
};
