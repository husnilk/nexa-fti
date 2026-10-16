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
        Schema::create('rubric_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rubric_id')->constrained('rubrics')->onDelete('cascade');
            $table->string('position');
            $table->double('poin')->default(0);
            $table->integer('is_fixed_poin')->default(0);
            $table->integer('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubric_details');
    }
};
