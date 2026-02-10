<?php

namespace App\Http\Controllers;

use App\Services\StatistikaService;
use Illuminate\Http\JsonResponse;

class StatistikaController extends Controller
{
    protected $statistikaService;

    public function __construct(StatistikaService $statistikaService)
    {
        $this->statistikaService = $statistikaService;
    }

    public function konacnaStatistika(): JsonResponse
    {
        try{

       
        $data = [
            'podkasti_po_kategorijama' => $this->statistikaService->getPodkastiPoKategorijama(),
            'tipovi_emisija_stats' => $this->statistikaService->getTipoviEmisijaStats(),
            'rangiranje_autora_po_podkastima' => $this->statistikaService->getRangiranjeAutoraPoPodkastima(),
            'top_omiljeni_podkasti' => $this->statistikaService->getTopOmiljeniPodkasti(),
            'emisije_po_danima' => $this->statistikaService->getEmisijePoDanima(),
            'novi_podkasti_po_periodima_stats' => $this->statistikaService->getNoviPodkastiStats(),
            'nove_emisije_po_periodima_stats' => $this->statistikaService->getNoveEmisijeStats(),
            'procenat_ucestvenosti_autora' => $this->statistikaService->getProcentualnoUcesceAutora(),
           
        ];
        
        return response()->json($data);
         }catch (\Exception $e) {
            return response()->json(['error' => 'Došlo je do greške prilikom generisanja statistike.',
            'message' => $e->getMessage()], 500);
        }
    }
}