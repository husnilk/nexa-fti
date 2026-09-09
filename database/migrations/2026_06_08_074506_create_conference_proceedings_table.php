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

        Schema::create('conference_proceedings', function (Blueprint $table) {
            $table->foreignUuid('id')->primary()->constrained('publications')->cascadeOnDelete();
            $table->string('conference_name');
            $table->string('conference_location')->nullable();
            $table->date('conference_date')->nullable();
            $table->string('publisher')->nullable();
            $table->string('isbn')->nullable();
            $table->string('pages')->nullable();
            $table->string('indexing')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conference_proceedings');
    }
};
