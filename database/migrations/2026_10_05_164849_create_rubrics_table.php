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
        Schema::create('rubrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('rubric_category_id')->constrained('rubric_categories')->onDelete('cascade');
            $table->foreignUuid('rubric_regulation_id')->constrained('rubric_regulations')->onDelete('cascade');
            $table->string('activity');
            $table->string('code');
            $table->text('description')->nullable();
            $table->text('description_prove')->nullable();
            $table->double('quantity')->default(0);
            $table->string('unit')->nullable();
            $table->integer('form_type')->default(0);
            $table->integer('personal')->default(0);
            $table->string('assignment_file')->nullable();
            $table->string('performance_file')->nullable();
            $table->integer('flat_rate')->default(0);
            $table->integer('is_poin_fixed')->default(0);
            $table->integer('is_extra_poin')->default(0);
            $table->integer('is_rasionalized')->default(0);
            $table->integer('is_general')->default(0);
            $table->integer('is_active')->default(1);
            $table->integer('is_flat_rate')->default(0);
            $table->integer('rule_max_poin')->default(-1);
            $table->integer('rule_min_poin')->default(-1);
            $table->integer('rule_max_employee')->default(-1);
            $table->integer('rule_min_employee')->default(-1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rubrics');
    }
};
