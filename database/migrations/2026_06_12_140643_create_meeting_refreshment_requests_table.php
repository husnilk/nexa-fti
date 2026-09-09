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

        Schema::create('meeting_refreshment_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('meeting_id')->constrained();
            $table->foreignUuid('requested_by')->nullable()->constrained('employees');
            $table->date('request_date');
            $table->integer('participant_count');
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'fulfilled']);
            $table->foreignUuid('approved_by')->nullable()->constrained('employees');
            $table->timestamp('approved_at')->nullable();
            $table->string('requested_by_id');
            $table->string('approved_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_refreshment_requests');
    }
};
