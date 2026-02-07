<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kategorija;

class KategorijaSeeder extends Seeder
{
    public function run()
    {
        if(Kategorija::count() == 0) {
            Kategorija::factory()->count(5)->create();
        }
    }
}
