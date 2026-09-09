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

        Schema::create('document_revisions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('document_id')->constrained()->cascadeOnDelete();
            $table->integer('revision_no');
            $table->date('revision_date');
            $table->integer('doc_date')->nullable();
            $table->integer('doc_month')->nullable();
            $table->integer('doc_year')->nullable();
            $table->boolean('active')->default(true);
            $table->string('file_path');
            $table->foreignUuid('uploaded_by')->constrained('employees');
            $table->timestamp('uploaded_at');
            $table->foreignUuid('uploaded_by_id')->nullable()->constrained('employees');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_revisions');
    }
};
