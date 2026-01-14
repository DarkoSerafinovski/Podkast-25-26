<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Emisija;
use App\Models\Podcast;

class EmisijaFactory extends Factory
{
    protected $model = Emisija::class;

    public function definition()
    {
        return [
            'naslov' => $this->faker->sentence(2),
            'datum' => $this->faker->dateTime,
            'podcast_id' => Podcast::inRandomOrder()->first()->id ?? Podcast::factory()->create()->id,
            'tip' => $this->faker->randomElement(['video/mp4', 'audio/mpeg']),
            'file' => function (array $attributes) {
        $extension = $attributes['tip'] === 'video/mp4' ? 'mp4' : 'mp3';
        return 'storage/app/' . $this->faker->word . '.' . $extension;
    },
        ];
    }
}
