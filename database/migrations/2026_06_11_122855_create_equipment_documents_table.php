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

        Schema::create('equipment_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('equipment_id')->constrained();
            $table->string('title');
            $table->enum('document_type', ['invoice', 'warranty', 'manual', 'photo', 'other']);
            $table->string('file_path');
            $table->foreignId('uploaded_by')->constrained('employees');
            $table->timestamp('uploaded_at');
            $table->foreignId('uploaded_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_documents');
    }
};
