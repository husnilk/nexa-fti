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

        Schema::create('event_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained();
            $table->string('title');
            $table->enum('document_type', ['report', 'photo', 'proposal', 'minutes', 'attendance', 'other']);
            $table->string('file_path');
            $table->text('description')->nullable();
            $table->string('uploaded_by');
            $table->foreign('uploaded_by')->references('id')->on('employees')->cascadeOnDelete();
            $table->timestamp('uploaded_at');
            $table->string('u_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_documents');
    }
};
