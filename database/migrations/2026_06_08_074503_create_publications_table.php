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

        Schema::create('publications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->date('publication_date');
            $table->string('doi')->nullable();
            $table->string('url')->nullable();
            $table->text('abstract')->nullable();
            $table->foreignUuid('research_id')->nullable()->constrained('research');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publications');
    }
};
