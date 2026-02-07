<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Emisija;

class EmisijaSeeder extends Seeder
{
    public function run()
    {
        if(Emisija::count() == 0) {
            Emisija::factory()->count(30)->create();
        }
    }
}
