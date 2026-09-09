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

        Schema::create('meeting_refreshment_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('meeting_refreshment_request_id')->constrained();
            $table->string('item_name');
            $table->integer('quantity');
            $table->decimal('estimated_cost', 14, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_refreshment_items');
    }
};
