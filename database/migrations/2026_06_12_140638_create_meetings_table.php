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

        Schema::create('meetings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('committee_id')->nullable()->constrained();
            $table->string('title');
            $table->text('agenda')->nullable();
            $table->enum('meeting_type', ['offline', 'online', 'hybrid']);
            $table->date('meeting_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignId('room_id')->nullable();
            $table->string('online_platform')->nullable();
            $table->string('online_link')->nullable();
            $table->foreignUuid('organizer_id')->nullable()->constrained('employees');
            $table->foreignUuid('chairman_id')->nullable()->constrained('employees');
            $table->enum('status', ['draft', 'scheduled', 'completed', 'cancelled']);
            $table->boolean('is_confidential')->default(false);
            $table->string('organizer_id_id');
            $table->string('chairman_id_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
