<?php

namespace App\Http\Controllers;

use App\Models\Emisija;
use App\Models\Podcast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use App\Http\Resources\EmisijaResource;


class EmisijaController extends Controller
{
   


    public function show($id){
        try{
            $emisija = Emisija::findOrFail($id);
            return new EmisijaResource($emisija);
        }catch (\Exception $e) {
            return response()->json(['error' => 'Došlo je do greške prilikom učitavanja emisije.'], 500);
        }
    }


    public function store(Request $request)
    {
        $request->validate([
            'naslov' => 'required|string',
            'podcast_id' => 'required|exists:podkasti,id',
             'file' => 'required|file'
          
        ]);
    
        $podcast = Podcast::findOrFail($request->podcast_id);
        $fajl = $this->uploadFajl($request->file('file'), $request->naslov,$podcast);
        $emisija = Emisija::create([
            'naslov' => $request->naslov,
            'datum' =>now(),
            'podcast_id' => $request->podcast_id,
            'file'=>$fajl,
            'tip'=>$request->file('file')->getMimeType()
        ]);
    
        
        return response()->json(['message' => 'Epizoda i fajl su uspešno sačuvani', 'epizoda' => $emisija], 201);
    }
    
    private function uploadFajl($file, $naziv,$podcast)
    {
        $originalExtension = $file->getClientOriginalExtension(); 
        $filename = $naziv . '.' . $originalExtension;
        $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $podcast->naslov);

        $podcastPath = 'app/' . $sanitizedNaziv;
        if (!Storage::exists($podcastPath)) {
             Storage::makeDirectory($podcastPath);
            }

            $sanitizedNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);
            $path = $podcastPath . '/'. $sanitizedNaziv;
            if(!Storage::exists($path))
            {
                Storage::makeDirectory($path);
            }
        
        $pathFile = $file->storeAs($path, $filename,"public");

        return Storage::url($pathFile); 
    }
    

 public function vratiFile($id)
    {
        try {
           
            $emisija = Emisija::findOrFail($id);
            $relativePath = $emisija->file;
            $absolutePath = public_path($relativePath); 

    
            if (!File::exists($absolutePath)) {
                return response()->json(['error' => 'Fajl ne postoji'], 404);
            }
    
           
            return response()->stream(function () use ($absolutePath) {
                readfile($absolutePath);
            }, 200, [
                'Content-Type' => $emisija->tip,
                'Accept-Ranges' => 'bytes',
                'Content-Length' => filesize($absolutePath),
            ]);
        } catch (\Exception $e) {
            Log::error('Greška prilikom učitavanja file: ' . $e->getMessage());
            return response()->json(['error' => 'Došlo je do greške prilikom učitavanja file.'], 500);
        }
    }


}

