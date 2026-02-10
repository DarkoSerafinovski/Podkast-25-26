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
        return [
            'video' => Emisija::where('tip', 'LIKE', 'video/%')->count(),
            'audio' => Emisija::where('tip', 'LIKE', 'audio/%')->count(),
        ];
    }

    public function getRangiranjeAutoraPoPodkastima()
    {
        return User::where('role', 'autor') 
        ->withCount('mojiPodkasti') 
        ->orderBy('moji_podkasti_count', 'desc')
        ->pluck('moji_podkasti_count', 'username')
        ->toArray();
    }

    public function getTopOmiljeniPodkasti($broj = 10)
    {
        return Podcast::withCount('omiljenOdStraneKorisnika') 
            ->orderBy('omiljen_od_strane_korisnika_count', 'desc')
            ->take($broj)
            ->get()
            ->pluck('omiljen_od_strane_korisnika_count', 'naslov')
            ->toArray();
    }

    public function getEmisijePoDanima()
    {
        $emisije = Emisija::select('datum')->get();

        $mapaDana = [
            1 => 'Ponedeljak',
            2 => 'Utorak',
            3 => 'Sreda',
            4 => 'Četvrtak',
            5 => 'Petak',
            6 => 'Subota',
            0 => 'Nedelja' 
        ];

        $rezultat = array_fill_keys(array_values($mapaDana), 0);

        foreach ($emisije as $emisija) {
            $danUNedelji = Carbon::parse($emisija->datum)->dayOfWeek;
            $nazivDana = $mapaDana[$danUNedelji];
            $rezultat[$nazivDana]++;
        }

        return $rezultat;
    }

    public function getNoviPodkastiStats()
    {
        return [
            'zadnjih_nedelju_dana' => Podcast::where('created_at', '>=', now()->subDays(7))->count(),
            'zadnjih_mesec_dana'  => Podcast::where('created_at', '>=', now()->subMonth())->count(),
            'zadnjih_godinu_dana' => Podcast::where('created_at', '>=', now()->subYear())->count(),
        ];
    }

    public function getNoveEmisijeStats()
    {
        return [
            'zadnjih_nedelju_dana' => Emisija::where('datum', '>=', now()->subDays(7))->count(),
            'zadnjih_mesec_dana'  => Emisija::where('datum', '>=', now()->subMonth())->count(),
            'zadnjih_godinu_dana' => Emisija::where('datum', '>=', now()->subYear())->count(),
        ];
    }
public function getProcentualnoUcesceAutora()
{
    $totalConnections = DB::table('autor_podcast')->count();

    if ($totalConnections === 0) {
        return [];
    }

    $autoriStats = User::where('role', 'autor')
        ->withCount('mojiPodkasti')
        ->get();

    $ucesce = $autoriStats->mapWithKeys(function ($user) use ($totalConnections) {
        $procenat = $totalConnections > 0 
            ? round(($user->moji_podkasti_count / $totalConnections) * 100, 2) 
            : 0;
            
        return [$user->username => $procenat];
    })->toArray();

    arsort($ucesce);

    return $ucesce;
}
}