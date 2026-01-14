<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class PodcastResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $user = Auth::user();
        $sortedEmisije = $this->emisije->sortByDesc('datum');
        return [
            'id' => $this->id,
            'naslov' => $this->naslov,
            'kratak_sadrzaj' => $this->kratak_sadrzaj,
            'logo_putanja' => asset($this->logo_putanja),
            'kategorija'=>new KategorijaResource($this->kategorija),
            'emisije'=>EmisijaResource::collection($sortedEmisije),
            'autori' => UserResource::collection($this->autori),
            'omiljeni'=> $user ? $user->listaOmiljenihPodkasta->contains($this->id) : false,
        ];
    }
}
