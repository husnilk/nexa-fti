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

        Schema::create('equipment_models', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_category_id')->constrained();
            $table->string('manufacturer')->nullable();
            $table->string('brand')->nullable();
            $table->string('model_name');
            $table->text('specification')->nullable();
            $table->string('image')->nullable();
            $table->integer('default_useful_life')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_models');
    }
};
