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
        Schema::create('performances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->foreignUuid('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->foreignUuid('rubric_detail_id')->nullable()->constrained('rubric_details')->nullOnDelete();
            $table->foreignUuid('period_id')->nullable()->constrained('periods')->nullOnDelete();
            $table->string('name', 191)->nullable();
            $table->double('quantity')->nullable();
            $table->double('remuneration_amount')->nullable();
            $table->double('excess_amount')->nullable();
            $table->double('original_amount')->nullable();
            $table->double('validation_amount')->nullable();
            $table->text('change_reason')->nullable();
            $table->double('points')->nullable();
            $table->string('letter_number', 191)->nullable();
            $table->date('letter_date')->nullable();
            $table->date('start_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->integer('document_type')->nullable();
            $table->string('evidence_file', 191)->nullable();
            $table->string('evidence_link', 191)->nullable();
            $table->integer('verification_reason_code')->nullable();
            $table->integer('verification_status')->nullable();
            $table->foreignUuid('verifier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('verification_reason', 191)->nullable();
            $table->integer('validation_status')->nullable();
            $table->foreignUuid('validator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('validation_reason_code')->nullable();
            $table->string('validation_reason', 254)->nullable();
            $table->string('position', 191)->nullable();
            $table->integer('is_modified')->nullable();
            $table->foreignUuid('operator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('is_final')->nullable();
            $table->double('percentage')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performances');
    }
};
