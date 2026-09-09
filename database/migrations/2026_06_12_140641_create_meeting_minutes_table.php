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

        Schema::create('meeting_minutes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('meeting_id')->constrained();
            $table->integer('version');
            $table->text('summary');
            $table->text('decisions')->nullable();
            $table->text('next_actions')->nullable();
            $table->foreignUuid('prepared_by')->nullable()->constrained('employees');
            $table->foreignUuid('approved_by')->nullable()->constrained('employees');
            $table->timestamp('approved_at')->nullable();
            $table->boolean('is_final')->default(false);
            $table->string('file_upload')->nullable();
            $table->string('prepared_by_id');
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
        Schema::dropIfExists('meeting_minutes');
    }
};
