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

        Schema::create('committee_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('committee_id')->nullable()->constrained();
            $table->foreignUuid('supervisor_id')->nullable()->constrained('committee_members');
            $table->foreignUuid('user_id')->nullable()->constrained('employees');
            $table->string('external_name')->nullable();
            $table->string('role');
            $table->boolean('is_leader')->default(false);
            $table->foreignId('supervisor_id_id');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_members');
    }
};
