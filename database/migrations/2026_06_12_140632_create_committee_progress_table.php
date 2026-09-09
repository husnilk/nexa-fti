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

        Schema::create('committee_progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('committee_id')->constrained();
            $table->date('progress_date');
            $table->decimal('progress_percentage', 5, 2);
            $table->text('summary');
            $table->text('issues')->nullable();
            $table->text('risks')->nullable();
            $table->text('next_plan')->nullable();
            $table->uuid('reported_by');
            $table->foreignId('reported_by_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_progress');
    }
};
