<?php

use App\Models\User;
use App\Models\Podcast;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

describe('UserController autorizovani zahtevi', function () {

    beforeEach(function () {
        // Logujemo se kao administrator ili običan user
        $user = User::factory()->create();
        Sanctum::actingAs($user);
    });

    /**
     * INDEX METODA
     */
    it('može da povuče listu svih korisnika', function () {
        // Kreiramo još 2 korisnika (ukupno 3 sa ulogovanim)
        User::factory()->count(2)->create();

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    });

    /**
     * DESTROY METODA - Osnovno brisanje
     */
    it('uspešno briše korisnika i vraća poruku', function () {
        $userZaBrisanje = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$userZaBrisanje->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Korisnik uspešno obrisan.']);

        $this->assertDatabaseMissing('users', ['id' => $userZaBrisanje->id]);
    });

    /**
     * DESTROY METODA - Logika sa podkastima
     * Testiramo tvoj uslov: "if ($podcast->autori()->count() == 1) { $podcast->delete(); }"
     */
    it('briše podkaste korisnika ako je on jedini autor', function () {
        $autor = User::factory()->create();
        
        // Kreiramo podkast i povezujemo ga sa ovim autorom
        // Pretpostavljam da imaš relaciju mojiPodkasti() definisanu
        $podcast = Podcast::factory()->create();
        $autor->mojiPodkasti()->attach($podcast->id);

        // Pozivamo destroy
        $this->deleteJson("/api/users/{$autor->id}")->assertStatus(200);

        // Provera: Korisnik je obrisan
        $this->assertDatabaseMissing('users', ['id' => $autor->id]);
        
        // Provera: Podkast je obrisan jer je imao samo tog jednog autora
        $this->assertDatabaseMissing('podkasti', ['id' => $podcast->id]);
    });

    it('vraća 500 ako korisnik ne postoji (findOrFail exception)', function () {
        // Šaljemo ID koji ne postoji
        $response = $this->deleteJson("/api/users/999");

        // Pošto tvoj kontroler hvata Exception i vraća 500
        $response->assertStatus(500)
                 ->assertJsonPath('error', 'Došlo je do greške prilikom brisanja korisnika.');
    });

});

/**
 * GUEST TEST
 */
it('zabranjuje pristup listi korisnika gostima', function () {
    $this->getJson('/api/users')->assertStatus(401);
});