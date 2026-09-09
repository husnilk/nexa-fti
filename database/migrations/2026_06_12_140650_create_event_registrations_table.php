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

        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('registration_number')->unique();
            $table->timestamp('registered_at');
            $table->enum('attendance_status', ['registered', 'attended', 'no_show', 'cancelled']);
            $table->text('notes')->nullable();
            $table->string('ticket_number')->unique();
            $table->string('qr_code')->nullable();
            $table->timestamp('issued_at');
            $table->string('certificate_number')->unique();
            $table->string('file_path')->nullable();
            $table->string('generated_by')->nullable();
            $table->foreign('generated_by')->references('id')->on('employees')->nullOnDelete();
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
