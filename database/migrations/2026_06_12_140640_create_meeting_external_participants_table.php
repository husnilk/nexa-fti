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

        Schema::create('meeting_external_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('meeting_id')->constrained();
            $table->string('name');
            $table->string('institution')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->enum('role', ['participant', 'speaker', 'guest']);
            $table->enum('attendance_status', ['invited', 'attended', 'absent']);
            $table->dateTime('check_in_time')->nullable();
            $table->dateTime('check_out_time')->nullable();
            $table->enum('attendance_method', ['manual', 'qr_scan']);
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_external_participants');
    }
};
