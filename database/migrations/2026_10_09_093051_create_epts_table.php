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
        Schema::create('epts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('employee_id')->constrained('employees')->cascadeOnDelete();
            $table->integer('year')->nullable();
            $table->foreignUuid('period_id')->constrained('periods')->cascadeOnDelete();
            $table->integer('start')->nullable();
            $table->integer('end')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignUuid('appraiser_officer_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignUuid('superior_appraiser_officer_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->integer('orientation')->nullable();
            $table->integer('integrity')->nullable();
            $table->integer('commitment')->nullable();
            $table->integer('discipline')->nullable();
            $table->integer('teamwork')->nullable();
            $table->integer('leadership')->nullable();
            $table->text('objection')->nullable();
            $table->date('objection_date')->nullable();
            $table->text('response')->nullable();
            $table->date('response_date')->nullable();
            $table->text('decision')->nullable();
            $table->date('decision_date')->nullable();
            $table->text('recommendation')->nullable();
            $table->date('recorded_date')->nullable();
            $table->date('received_date')->nullable();
            $table->date('superior_received_date')->nullable();
            $table->integer('status')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->double('skp_achievement')->nullable();
            $table->integer('performance_predicate')->nullable();
            $table->integer('behavior_rating')->nullable();
            $table->integer('work_result_rating')->nullable();
            $table->string('evidence_file', 100)->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('points')->nullable();
            $table->integer('verification_points')->nullable();
            $table->string('contract_file', 191)->nullable();
            $table->integer('violation_level')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('epts');
    }
};
