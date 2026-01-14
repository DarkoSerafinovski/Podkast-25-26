<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Emisija;

class EmisijaSeeder extends Seeder
{
    public function run()
    {
        Emisija::factory()->count(30)->create();
    }
}
