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
        Schema::create('emisije', function (Blueprint $table) {
            $table->id();
            $table->foreignId('podcast_id')->constrained('podkasti')->onDelete('cascade');
            $table->string("naziv");
            $table->dateTime('datum');
            $table->string("file");
            $table->string("tip");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emisije');
    }
};
