<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmisijaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'naslov' => $this->naslov,
            'datum' => $this->datum->toIso8601String(),
            'tip'=>$this->tip,
            'file' => route('emisija.file', ['id' => $this->id]),
          
        ];
    }

 
}
