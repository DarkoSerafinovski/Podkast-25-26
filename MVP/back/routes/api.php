<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategorijaController;
use App\Http\Controllers\EmisijaController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {

   
    Route::get('/podcasti',[PodcastController::class,'index']);
    Route::delete('/podcasti/{id}',[PodcastController::class,'destroy']);
      Route::get('podcasti/{id}',[PodcastController::class,'show']);
     Route::post('podcasti',[PodcastController::class,'store']);
      Route::put('podcasti/{id}',[PodcastController::class,'update']);
        Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/podcasti', [UserController::class, 'mojiPodcasti']);
       Route::get('users/favorites/podcasti',[UserController::class,'getFavorites']);
    Route::get('users/autori/favorites',[UserController::class,'getUsersOfFavoritesPodcasts']);
        Route::delete('users/{id}',[UserController::class,'destroy']);
    Route::get('users/autori',[UserController::class,'vratiAutore']);
     Route::post('users/favorites/{id}',[UserController::class,'addToFavorites']);
    Route::delete('users/favorites/{id}',[UserController::class,'removeFavorite']);
    Route::get('kategorije',[KategorijaController::class,'index']);
    Route::post('kategorije',[KategorijaController::class,'store']);
    Route::get('emisije/{id}',[EmisijaController::class,'show']);
    Route::post('emisije',[EmisijaController::class,'store']);
    Route::get('/emisije/file/{id}', [EmisijaController::class, 'vratiFile'])->name('emisija.file');

});
