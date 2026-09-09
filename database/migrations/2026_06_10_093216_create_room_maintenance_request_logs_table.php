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

        Schema::create('room_maintenance_request_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('room_maintenance_request_id')->constrained()->onDelete('cascade');
            $table->text('log');
            $table->foreignUuid('logged_by_id')->constrained('employees')->onDelete('cascade');
            $table->timestamp('logged_at');
            $table->string('logged_file')->nullable();
            $table->foreignUuid('verified_by_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_file')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['reported', 'accepted', 'rejected', 'in_progress', 'resolved', 'verified']);
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_maintenance_request_logs');
    }
};
