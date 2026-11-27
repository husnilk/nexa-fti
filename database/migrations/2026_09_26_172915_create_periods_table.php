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
        Schema::create('periods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('year');
            $table->integer('no');
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->date('input_start_date');
            $table->date('input_end_date');
            $table->date('verification_start_date');
            $table->date('verification_end_date');
            $table->date('validation_start_date');
            $table->date('validation_end_date');
            $table->string('description')->nullable();
            $table->integer('attendance')->default(0);
            $table->integer('skp')->default(0);
            $table->integer('skp_format')->default(0);
            $table->integer('calc_method')->default(0);
            $table->integer('performance')->default(0);
            $table->integer('bkd_year')->default(0);
            $table->string('bkd_semester')->default('Ganjil');
            $table->integer('p1_bkd_ref')->default(0);
            $table->integer('p1_bkd_year')->default(0);
            $table->string('p1_bkd_semester')->default('Ganjil');
            $table->integer('p2_bkd_ref')->default(0);
            $table->integer('p2_bkd_year')->default(0);
            $table->string('p2_bkd_semester')->default('Ganjil');
            $table->tinyInteger('status')->default(1);
            $table->double('pir')->default(3000);
            $table->integer('show_rupiah')->default(0);
            $table->integer('user_confirmation')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periods');
    }
};
