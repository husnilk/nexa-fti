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

        Schema::create('equipment_distributions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('equipment_id')->constrained();
            $table->foreignUuid('employee_id')->nullable()->constrained();
            $table->foreignUuid('room_id')->nullable()->constrained();
            $table->date('assigned_date');
            $table->date('returned_date')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'returned', 'lost', 'damaged']);
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
        Schema::dropIfExists('equipment_distributions');
    }
};
