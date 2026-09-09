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
        Schema::create('books', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('type');
            $table->string('publisher')->nullable();
            $table->integer('publication_year')->nullable();
            $table->string('isbn')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('book_user', function (Blueprint $table) {
            $table->uuid('book_id');
            $table->uuid('user_id');
            $table->timestamps();

            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->primary(['book_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_user');
        Schema::dropIfExists('books');
    }
};
