<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Podcast;
use App\Models\User;

class PodcastSeeder extends Seeder
{
    public function run()
    {
        Podcast::factory()->count(10)->create();
        $users = User::all();


$autori = $users->where('role', 'autor');
$gledaoci = $users->where('role', 'gledalac');


$podcasts = Podcast::all();

$podcasts->each(function ($podcast) use ($autori, $gledaoci) {
   
   if ($autori->count() >= 2) { 
        $randomAutori = $autori->random(2)->pluck('id'); 
        $podcast->autori()->attach($randomAutori); 
    } else if ($autori->isNotEmpty()) { 
        $podcast->autori()->attach($autori->pluck('id'));
    }

    if ($gledaoci->isNotEmpty()) {
        $randomGledalac = $gledaoci->random();
        $randomGledalac->listaOmiljenihPodkasta()->attach($podcast->id);
    }
});
    }
}
