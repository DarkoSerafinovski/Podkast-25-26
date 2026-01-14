<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Podcast;
use App\Models\Kategorija;
use App\Models\User;

class PodcastFactory extends Factory
{
    protected $model = Podcast::class;

    public function definition()
    {
        return [
            'naslov' => $this->faker->sentence(3),
            'kratak_sadrzaj' => $this->faker->paragraph,
            'logo_putanja' => $this->faker->imageUrl(640, 480, 'podcast'),
            'kategorija_id' => Kategorija::inRandomOrder()->first()->id ?? Kategorija::factory()->create()->id,
            
        ];
    }
}
