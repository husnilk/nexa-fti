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

        Schema::create('committee_task_progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('committee_task_id')->constrained();
            $table->dateTime('progress_date');
            $table->decimal('progress_percentage', 5, 2);
            $table->text('description');
            $table->string('attachment')->nullable();
            $table->foreignUuid('created_by')->constrained('employees');
            $table->foreignId('created_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_task_progress');
    }
};
