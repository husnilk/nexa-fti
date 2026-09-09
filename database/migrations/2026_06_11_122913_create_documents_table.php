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

        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->foreignId('document_type_id')->constrained();
            $table->foreignUuid('organisation_id')->constrained('organizations');
            $table->string('document_no')->nullable();
            $table->enum('publish_status', ['draft', 'published', 'archived']);
            $table->foreignUuid('published_by')->nullable()->constrained('employees');
            $table->timestamp('published_at')->nullable();
            $table->foreignUuid('archived_by')->nullable()->constrained('employees');
            $table->timestamp('archived_at')->nullable();
            $table->foreignUuid('published_by_id')->nullable()->constrained('employees');
            $table->foreignUuid('archived_by_id')->nullable()->constrained('employees');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
