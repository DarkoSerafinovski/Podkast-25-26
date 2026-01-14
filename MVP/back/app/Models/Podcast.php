<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    use HasFactory;



    protected $table = 'podkasti';
  
  
    protected $fillable = ['naslov', 'kratak_sadrzaj', 'logo_putanja','kategorija_id'];
  
    public function autori()
    {
        return $this->belongsToMany(User::class, 'autor_podcast');
    }

    public function kategorija()
    {
        return $this->belongsTo(Kategorija::class);
    }

    public function emisije()
    {
        return $this->hasMany(Emisija::class);
    }
}
