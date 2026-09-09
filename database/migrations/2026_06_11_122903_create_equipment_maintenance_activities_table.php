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

        Schema::create('equipment_maintenance_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_maintenance_request_id')->constrained();
            $table->dateTime('activity_date');
            $table->text('description');
            $table->decimal('cost', 14, 2)->nullable();
            $table->string('performed_by')->nullable();
            $table->enum('status', ['in_progress', 'resolved']);
            $table->text('notes')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_maintenance_activities');
    }
};
