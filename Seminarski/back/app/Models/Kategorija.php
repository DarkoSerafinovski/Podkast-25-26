<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategorija extends Model
{
    use HasFactory;

    protected $table = 'kategorije';
    use HasFactory;

    protected $fillable = ['naziv'];

    public function podcasti()
    {
        return $this->hasMany(Podcast::class);
    }
}
