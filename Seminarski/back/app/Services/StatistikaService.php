<?php

namespace App\Services;

use App\Models\Kategorija;
use App\Models\Emisija;
use App\Models\User;
use App\Models\Podcast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class StatistikaService
{
    
    public function getPodkastiPoKategorijama()
    {
        return Kategorija::withCount('podcasti')
            ->get()
            ->pluck('podcasti_count', 'naziv') 
            ->toArray();
    }

    public function getTipoviEmisijaStats()
    {
        $audioCount = Emisija::where('tip', 'LIKE', 'audio/%')->count();
        $videoCount = Emisija::where('tip', 'LIKE', 'video/%')->count();

        return [
            'video' => $videoCount,
            'audio' => $audioCount,
        ];
    }


    public function getRangiranjeAutoraPoPodkastima()
    {
        return User::withCount('mojiPodkasti') 
            ->orderBy('moji_podkasti_count', 'desc')
            ->pluck('moji_podkasti_count', 'username')
            ->toArray();
    }

    public function getTopOmiljeniPodkasti($broj = 10)
    {
        return Podcast::join('omiljeni_podkasti', 'podkasti.id', '=', 'omiljeni_podkasti.podcast_id')
            ->select('podkasti.naslov', DB::raw('count(omiljeni_podkasti.user_id) as broj_dodavanja'))
            ->groupBy('podkasti.id', 'podkasti.naslov')
            ->orderBy('broj_dodavanja', 'desc')
            ->take($broj)
            ->pluck('broj_dodavanja', 'naslov')
            ->toArray();
    }


    public function getEmisijePoDanima()
    {
        $mapaDana = [
            2 => 'Ponedeljak',
            3 => 'Utorak',
            4 => 'Sreda',
            5 => 'Četvrtak',
            6 => 'Petak',
            7 => 'Subota',
            1 => 'Nedelja'
        ];

        $stats = Emisija::select(
                DB::raw('DAYOFWEEK(datum) as dan_broj'),
                DB::raw('count(*) as ukupno')
            )
            ->groupBy('dan_broj')
            ->orderBy('dan_broj')
            ->get();

        $rezultat = [];
        
        foreach ($mapaDana as $broj => $naziv) {
            $danPodatak = $stats->where('dan_broj', $broj)->first();
            $rezultat[$naziv] = $danPodatak ? $danPodatak->ukupno : 0;
        }

        return $rezultat;
    }


    public function getNoviPodkastiStats()
    {
        return [
            'zadnjih_nedelju_dana' => Podcast::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            'zadnjih_mesec_dana'  => Podcast::where('created_at', '>=', Carbon::now()->subMonth())->count(),
            'zadnjih_godinu_dana' => Podcast::where('created_at', '>=', Carbon::now()->subYear())->count(),
        ];
    }


    public function getNoveEmisijeStats()
    {
        return [
            'zadnjih_nedelju_dana' => Emisija::where('datum', '>=', Carbon::now()->subDays(7))->count(),
            'zadnjih_mesec_dana'  => Emisija::where('datum', '>=', Carbon::now()->subMonth())->count(),
            'zadnjih_godinu_dana' => Emisija::where('datum', '>=', Carbon::now()->subYear())->count(),
        ];
    }



    public function getProcentualnoUcesceAutora()
    {
        $totalConnections = DB::table('autor_podcast')->count();

        if ($totalConnections === 0) {
            return [];
        }

        $autoriStats = User::join('autor_podcast', 'users.id', '=', 'autor_podcast.user_id')
            ->select('users.username', DB::raw('count(autor_podcast.podcast_id) as broj_podkasta'))
            ->groupBy('users.id', 'users.username')
            ->get();

        $ucesce = $autoriStats->mapWithKeys(function ($item) use ($totalConnections) {
            $procenat = round(($item->broj_podkasta / $totalConnections) * 100, 2);
            return [$item->username => $procenat];
        })
        ->toArray();

        arsort($ucesce);

        return $ucesce;
    }
}