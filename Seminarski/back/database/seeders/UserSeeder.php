<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        if(User::count() == 0) {
         User::factory()->count(10)->create();
        }
    }
}
