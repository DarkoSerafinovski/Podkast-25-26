# 🎙 Podcast Platform – Full Stack Web Application

🔗 **Produkcijska verzija aplikacije:**  
https://iteh-podkast-projekat.onrender.com/


---

## 📌 Opis aplikacije

U digitalnom dobu podkasti predstavljaju jedan od najznačajnijih medija za distribuciju audio sadržaja. Međutim, postojeće platforme su često fragmentirane, ograničavaju kreatore u upravljanju sadržajem i ne nude slušaocima dovoljno fleksibilne alate za pretragu i organizaciju.

Ova aplikacija predstavlja centralizovanu web platformu za upravljanje i konzumaciju podkast sadržaja, koja povezuje kreatore i slušaoce kroz intuitivan i interaktivan sistem.

### 🎯 Ciljevi aplikacije

Glavni cilj sistema je razvoj robusne i interaktivne web platforme koja omogućava:

- Jednostavno pregledanje podkasta kroz moderan i responzivan interfejs  
- Naprednu pretragu i filtriranje po kreatorima i kategorijama  
- Registraciju i autentifikaciju korisnika  
- Upravljanje podkastima i epizodama od strane kreatora  
- Upravljanje omiljenim sadržajem od strane slušalaca  
- Administratorski panel za upravljanje korisnicima i kategorijama  
- Integraciju sa Spotify API-jem  

---

## 👥 Ciljne grupe korisnika

### 🎧 Slušaoci
- Pregled i pretraga podkasta  
- Praćenje omiljenih kreatora  
- Upravljanje ličnom bibliotekom  

### 🎙 Kreatori podkasta
- Dodavanje i uređivanje podkasta  
- Upravljanje epizodama  
- Distribucija sadržaja  

### 🛠 Administrator
- Upravljanje korisnicima  
- Upravljanje kategorijama  
- Pregled statistike sistema  

---

## 🛠 Korišćene tehnologije

### Backend
- Laravel  
- REST API  
- MySQL (lokalno)  
- PostgreSQL (cloud – Render)  
- Supabase (skladištenje fajlova)  
- Spotify API  

### Frontend
- React  
- JavaScript (ES6+)  

### DevOps i alati
- Docker  
- Docker Compose  
- Git  
- Render  

---

# 🚀 Pokretanje aplikacije

## 1️⃣ Lokalno pokretanje (bez Docker-a)

### Backend

```bash
cd back
composer install
php artisan storage:link
php artisan migrate:fresh --seed
php artisan serve
```

Backend je dostupan na:  
http://127.0.0.1:8000

---

### Frontend

```bash
cd front
npm install
npm start
```

Frontend je dostupan na:  
http://localhost:3000

---

## 2️⃣ Pokretanje pomoću Docker-a

Iz root direktorijuma projekta:

```bash
docker compose up --build -d
```

Za gašenje kontejnera:

```bash
docker compose down
```

---

# 🌿 Git strategija grananja

## 🔵 main
- Stabilna produkciona verzija aplikacije  
- Deploy na Render platformi  

## 🟡 develop
- Integraciona razvojna grana  
- Spajanje svih feature grana  

## 🟢 Feature grane

- feature/statistika – prikaz statistike administratoru  
- feature/register – registracija korisnika  
- feature/emisije – dodavanje i čuvanje emisija  
- feature/swagger-dokumentacija – Swagger API dokumentacija  
- feature/users – administratorska manipulacija korisnicima  
- feature/dokerizovanje – dockerizacija projekta  
- feature/spotify – integracija Spotify API-ja  

---

## 📦 Arhitektura sistema

- React SPA frontend  
- Laravel REST API backend  
- Relacione baze podataka  
- Cloud hosting (Render)  
- Cloud storage (Supabase)  

---

## 📌 Napomena

Za lokalno pokretanje potrebno je imati instalirano:

- PHP  
- Composer  
- Node.js  
- npm  
- Docker (opciono)
