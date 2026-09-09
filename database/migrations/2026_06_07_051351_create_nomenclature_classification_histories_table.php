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
        Schema::create('nomenclature_classification_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('staff_id');
            $table->uuid('nomenclature_classification_id');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('decree_number');
            $table->date('decree_date');
            $table->string('decree_signer');
            $table->string('decree_file')->nullable();
            $table->timestamps();

            $table->foreign('staff_id')->references('id')->on('staff')->onDelete('cascade');
            $table->foreign('nomenclature_classification_id', 'nch_nc_id_foreign')
                ->references('id')
                ->on('position_nomenclature_classifications')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nomenclature_classification_histories');
    }
};
