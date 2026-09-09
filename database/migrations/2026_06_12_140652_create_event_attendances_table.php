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

        Schema::create('event_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_registration_id')->constrained();
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('checked_out_at')->nullable();
            $table->string('checked_by')->nullable();
            $table->foreign('checked_by')->references('id')->on('employees')->nullOnDelete();
            $table->enum('attendance_method', ['manual', 'qr_scan', 'system']);
            $table->enum('status', ['present', 'absent', 'partial']);
            $table->foreignId('event_id');
            $table->string('checked_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_attendances');
    }
};
