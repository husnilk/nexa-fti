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

        Schema::create('equipment', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_model_id')->constrained();
            $table->string('equipment_number')->unique();
            $table->string('serial_number')->nullable()->unique();
            $table->date('acquisition_date')->nullable();
            $table->decimal('acquisition_cost', 14, 2)->nullable();
            $table->decimal('residual_value', 14, 2)->nullable();
            $table->integer('useful_life')->nullable();
            $table->enum('condition', ['excellent', 'good', 'fair', 'damaged', 'broken']);
            $table->enum('status', ['available', 'in_use', 'maintenance', 'disposed']);
            $table->string('qr_code')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
