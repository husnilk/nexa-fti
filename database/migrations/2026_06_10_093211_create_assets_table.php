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

        Schema::create('assets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('type', ['equipment', 'room']);
            $table->enum('acquisition_type', ['procurement', 'grant']);
            $table->date('acquisition_date');
            $table->decimal('acquisition_cost', 14, 2)->nullable();
            $table->foreignId('asset_grant_id')->nullable()->constrained();
            $table->enum('condition', ['good', 'minor_damage', 'major_damage']);
            $table->enum('status', ['available', 'in_use', 'maintenance', 'retired']);
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
