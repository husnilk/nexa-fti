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
        Schema::create('position_nomenclatures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->integer('grade');
            $table->text('qualification')->nullable();
            $table->timestamps();
        });

        Schema::create('position_nomenclature_responsibilities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('position_nomenclature_id');
            $table->string('name');
            $table->timestamps();

            $table->foreign('position_nomenclature_id', 'pnr_pn_id_foreign')
                ->references('id')
                ->on('position_nomenclatures')
                ->onDelete('cascade');
        });

        Schema::create('position_nomenclature_classifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('position_nomenclature_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('position_nomenclature_id', 'pnc_pn_id_foreign')
                ->references('id')
                ->on('position_nomenclatures')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('position_nomenclature_classifications');
        Schema::dropIfExists('position_nomenclature_responsibilities');
        Schema::dropIfExists('position_nomenclatures');
    }
};
