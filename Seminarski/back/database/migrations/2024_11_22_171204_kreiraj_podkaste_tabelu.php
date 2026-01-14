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
        Schema::create('podkasti', function (Blueprint $table) {
            $table->id();
            $table->string("naslov");
            $table->text('kratak_sadrzaj');
            $table->string("logo_putanja");
            $table->foreignId('kategorija_id')->constrained('kategorije')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('podkasti');
    }
};
