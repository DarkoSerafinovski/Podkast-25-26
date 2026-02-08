<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\PodcastResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;


class PodcastController extends Controller
{
    public function index(Request $request)
{
    $perPage = $request->input('per_page', 9);
    $idAutora = $request->input('id_autora');
    $search = $request->input('search');
    $kategorija = $request->input('kategorija');
    $minEpizoda = $request->input('min_episodes', 0); // Novo

    try {
        // Dodajemo brojač relacije 'emisije' svakom podkastu
        $query = Podcast::withCount('emisije');

        // 1. Filtriranje po autoru
        if ($idAutora) {
            $query->whereHas('autori', function($q) use ($idAutora) {
                $q->where('users.id', $idAutora);
            });
        }

        // 2. Filtriranje po naslovu
        if ($search) {
            $query->where('naslov', 'like', '%' . $search . '%');
        }

        // 3. Filtriranje po kategoriji
        if ($kategorija && $kategorija !== 'all') {
            $query->whereHas('kategorija', function($q) use ($kategorija) {
                $q->where('naziv', $kategorija);
            });
        }

        // 4. Filtriranje po broju epizoda - DODATO
        // Koristimo 'having' jer je emisije_count agregatno polje
        if ($minEpizoda > 0) {
            $query->having('emisije_count', '>=', $minEpizoda);
        }

        $podkasti = $query->orderBy('naslov', 'asc')->paginate($perPage);

        return PodcastResource::collection($podkasti);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Greška na serveru.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


   
    

    public function destroy($id)
    {
        try {
           
    
            $podcast = Podcast::findOrFail($id);
            $user = Auth::user();
    
           if ($podcast->logo_putanja) {
            $relativePutanja = str_replace(env('AWS_URL') . '/', '', $podcast->logo_putanja);
            $folderPutanja = dirname($relativePutanja);
            Storage::disk('s3')->deleteDirectory($folderPutanja);
        }

        $podcast->delete();
    
            return response()->json(['message' => 'Podcast i svi povezani resursi su uspešno obrisani.'], 200);
        } catch (\Exception $e) {
            Log::error('Greška prilikom brisanja podcasta: ' . $e->getMessage());
            return response()->json(['message' => 'Došlo je do greške prilikom brisanja podcasta.', 'error' => $e->getMessage()], 500);
        }
    }

 public function show($id)
    {
        try{
            $podkast = Podcast::findOrFail($id);
            Log::info($podkast);
            return new PodcastResource($podkast);
        }
        catch (\Exception $e) {
          
            return response()->json([
                'message' => 'Došlo je do greške prilikom dohvatanja podkasta.',
                'error' => $e->getMessage(),
            ], 500);
        }
        
      
    }


    
    public function store(Request $request)
{
    try {
      
   
        $request->validate([
            'naslov' => 'required|string',
            'kratak_sadrzaj' => 'required|string',
            'kategorija_id' => 'required|exists:kategorije,id',
            'logo_putanja' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', 
            'kreatori' => 'required|array',
            'kreatori.*.id' => 'exists:users,id', 
        ]);

        $podcast = Podcast::create([
            'naslov' => $request->naslov,
            'kratak_sadrzaj' => $request->kratak_sadrzaj,
            'kategorija_id' => $request->kategorija_id,
            'logo_putanja' => $this->uploadLogo($request->file('logo_putanja'), $request->naslov),

        ]);

        $kreatori = collect($request->kreatori)->pluck('id');
        $podcast->autori()->sync($kreatori);

       
        return response()->json([
            'message' => 'Podkast je uspešno sačuvan',
            'podkast' => $podcast,
        ], 201);
    } catch (\Exception $e) {
      
        return response()->json([
            'message' => 'Greška prilikom čuvanja podkasta',
            'error' => $e->getMessage()
        ], 500);
    }
}

private function uploadLogo($file, $naslov)
{
    $sanitizedNaslov = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naslov);
    $extension = $file->getClientOriginalExtension();
    $filename = 'logo_' . time() . '.' . $extension; 
    $path = 'podcasts/' . $sanitizedNaslov;
    $pathFile = $file->storeAs($path, $filename, "s3");
    return Storage::disk('s3')->url($pathFile);
}



public function update(Request $request, $podcastId)
{
  
    try {
        $request->validate([
            'naslov' => 'required|string',
            'kratak_sadrzaj' => 'required|string',
            'kategorija_id' => 'required|exists:kategorije,id',
            'logo_putanja' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',  
        ]);

        $podcast = Podcast::findOrFail($podcastId);

       
        $podcast->naslov = $request->naslov;
        $podcast->kratak_sadrzaj = $request->kratak_sadrzaj;
        $podcast->kategorija_id = $request->kategorija_id;

        
       if ($request->hasFile('logo_putanja')) {
             if ($podcast->logo_putanja) {
                 $staraPutanja = str_replace(env('AWS_URL') . '/', '', $podcast->logo_putanja);
        
        if (Storage::disk('s3')->exists($staraPutanja)) {
            Storage::disk('s3')->delete($staraPutanja);
            }
    }
    // Upload novog logoa
    $podcast->logo_putanja = $this->uploadLogo($request->file('logo_putanja'), $request->naslov);
}

       
        $podcast->save();

        return response()->json([
            'message' => 'Podkast je uspešno izmenjen!',
            'data' => $podcast
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Došlo je do greške prilikom ažuriranja podkasta. ' . $e->getMessage()
        ], 500);
    }
}


  
}

    






