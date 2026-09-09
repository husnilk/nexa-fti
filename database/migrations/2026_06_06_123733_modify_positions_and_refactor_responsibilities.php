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
        // Modify positions table
        Schema::table('positions', function (Blueprint $table) {
            $table->integer('is_active')->default(1)->after('job_value');
        });

        // Rename responsibilities table
        Schema::rename('responsibilities', 'position_responsibilities');

        // Modify position_responsibilities table
        Schema::table('position_responsibilities', function (Blueprint $table) {
            // In SQLite, we can't directly change column type to enum easily without recreating or using raw SQL if complex.
            // But since this is a fresh feature, I'll drop and recreate the column or just rename if it was integer.
            // Actually, I'll just change the logic to handle 'primary' and 'secondary'.
            // For now, I'll drop the old 'type' and add the new one.
            $table->dropColumn('type');
        });

        Schema::table('position_responsibilities', function (Blueprint $table) {
            $table->enum('type', ['primary', 'secondary'])->default('primary')->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('position_responsibilities', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('position_responsibilities', function (Blueprint $table) {
            $table->integer('type')->default(1)->after('description');
        });

        Schema::rename('position_responsibilities', 'responsibilities');

        Schema::table('positions', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};
