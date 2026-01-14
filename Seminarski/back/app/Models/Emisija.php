<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emisija extends Model
{
    use HasFactory;


    protected $table = 'emisije';
    use HasFactory;

    protected $fillable = ['naslov', 'datum','tip','file', 'podcast_id'];

    public function podcast()
    {
        return $this->belongsTo(Podcast::class);
    }

  
    protected $casts = [
        'datum' => 'datetime', 
    ];
}
