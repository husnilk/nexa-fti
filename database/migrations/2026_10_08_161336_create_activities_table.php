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
        Schema::create('activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('period_id')->constrained('periods')->onDelete('cascade');
            $table->foreignUuid('rubric_id')->constrained('rubrics')->onDelete('cascade');
            $table->string('name');
            $table->foreignUuid('organization_id')->nullable()->constrained('organizations')->nullOnDelete();
            $table->string('document_number')->nullable();
            $table->integer('form_type')->nullable();
            $table->string('evidence_file')->nullable();
            $table->string('evidence_link')->nullable();
            $table->integer('shared_performance_evidence')->nullable();
            $table->string('performance_evidence_link')->nullable();
            $table->string('performance_evidence_file')->nullable();
            $table->foreignUuid('validator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('verifier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
