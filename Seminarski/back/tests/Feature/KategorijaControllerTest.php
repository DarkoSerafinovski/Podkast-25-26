<?php

use App\Models\Kategorija;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

/**
 * Grupa testova koji zahtevaju autentifikaciju
 */
describe('autorizovani korisnik', function () {

    // Ovaj beforeEach važi samo unutar ovog describe bloka
    beforeEach(function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
    });

    it('vraća status 200 i listu svih kategorija', function () {
        Kategorija::factory()->count(3)->create();

        $response = $this->getJson('/api/kategorije');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data')
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'naziv']
                     ]
                 ]);
    });

    it('uspešno kreira novu kategoriju kada su podaci validni', function () {
        $payload = ['naziv' => 'Programiranje'];

        $response = $this->postJson('/api/kategorije', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Kategorija uspešno dodata!',
                     'data' => ['naziv' => 'Programiranje']
                 ]);

        $this->assertDatabaseHas('kategorije', ['naziv' => 'Programiranje']);
    });

    it('vraća grešku 422 ako je naziv prazan', function () {
        $response = $this->postJson('/api/kategorije', ['naziv' => '']);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['naziv']);
    });

    it('vraća grešku 422 ako naziv već postoji u bazi', function () {
        Kategorija::create(['naziv' => 'Dizajn']);

        $response = $this->postJson('/api/kategorije', ['naziv' => 'Dizajn']);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['naziv']);
    });
});

/**
 * Testovi izvan describe bloka nemaju ulogovanog korisnika
 */
it('ne dozvoljava pristup kategorijama ako korisnik nije ulogovan', function () {
    // Ovde nema Sanctum::actingAs, pa će middleware vratiti 401
    $response = $this->getJson('/api/kategorije');

    $response->assertStatus(401);
});