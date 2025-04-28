# Web Project README

- [Web Project README](#web-project-readme)
  - [Version Info](#version-info)
  - [Projektin tavoitteet](#projektin-tavoitteet)
  - [Käytetyt teknologiat](#käytetyt-teknologiat)
  - [Asennusohjeet](#asennusohjeet)
  - [Käyttöohjeet](#käyttöohjeet)
  - [Tulevat parannukset](#tulevat-parannukset)
    - [**Ominaisuudet**](#ominaisuudet)
    - [**Ylläpitäjät ja kontribuutiot**](#ylläpitäjät-ja-kontribuutiot)
    - [**Kehitysympäristö**](#kehitysympäristö)
    - [**Tiedossa olevat ongelmat**](#tiedossa-olevat-ongelmat)
  - [Päivitysten julkaiseminen](#päivitysten-julkaiseminen)
  - [Päivitykset ja lisäykset](#päivitykset-ja-lisäykset)
  - [Päivämääräkohtaiset muutokset](#päivämääräkohtaiset-muutokset)
    - [2024-10-10](#2024-10-10)
    - [2024-10-15](#2024-10-15)
    - [2024-10-25](#2024-10-25)
    - [2024-10-31](#2024-10-31)
    - [2024-11-01](#2024-11-01)
    - [2024-11-13](#2024-11-13)
    - [2024-11-19](#2024-11-19)
    - [2024-11-26](#2024-11-26)
    - [2024-12-04](#2024-12-04)
    - [2024-12-16](#2024-12-16)
    - [2024-12-18](#2024-12-18)
    - [2025-01-08](#2025-01-08)
    - [2025-01-17](#2025-01-17)
    - [2025-04-05](#2025-04-05)
    - [2025-04-28](#2025-04-28)
    - [Global.css](#globalcss)

## Version Info

Tämä projekti on staattinen tiedonhakusivu, joka keskittyy aurinkoon ja sen ympärillä oleviin planeettoihin. Sen tavoitteena on tarjota käyttäjille visuaalisesti miellyttävä ja kiinnostava kokemus. Sivusto on suunniteltu helposti navigoitavaksi ja responsiiviseksi, ja se hyödyntää nykyaikaisia web-teknologioita, kuten CSS-animaatioita ja interaktiivista JavaScriptiä, parhaan käyttökokemuksen takaamiseksi. Sivu on erityisesti suunnattu niille, jotka haluavat oppia lisää aurinkokunnasta tyylikkäässä ja järjestelmällisessä ympäristössä.

---

## Projektin tavoitteet

Projektin tavoitteena on luoda visuaalisesti miellyttävä ja helppokäyttöinen tiedonhakusivu, joka esittelee aurinkoa ja sen planeettoja. Sivusto tarjoaa käyttäjille interaktiivisen ja opettavaisen kokemuksen yhdistämällä modernia teknologiaa ja houkuttelevaa muotoilua.

---

## Käytetyt teknologiat

Projektin toteutuksessa on hyödynnetty seuraavia teknologioita:

- **Frontend:**
  - **HTML5** - Perusrakenne ja sisältö.
  - **CSS3 (Materialize CSS)** - Tyylit ja responsiivisuus.
  - **JavaScript (jQuery)** - Interaktiivisuus ja toiminnallisuudet.
  - **EmailJS** - Sähköpostien käsittely.
  - **Prettier** - Koodin formatointi ja yhtenäistäminen.

- **Backend:**
  - **Node.js** - Palvelinympäristö ja moduulien hallinta.
  - **Express.js** - Reititys ja HTTP-pyyntöjen käsittely.
  - **Mongoose** - MongoDB-tietokannan objektimallinnus ja kyselyt.
  - **MongoDB Atlas** - Pilvipohjainen NoSQL-tietokanta.
  - **dotenv** - Ympäristömuuttujien hallinta (esim. `MONGO_URI`).

- **Työkalut:**
  - **Postman** - API-pyyntöjen testaaminen (GET, POST, PUT, DELETE).
  - **npm** - Pakettien hallinta (`package.json`).

---

## Asennusohjeet

1. **Kloonaa projekti paikallisesti:**
   ```bash
   git clone https://github.com/Aiche-H/WEB_15_group_3_project.git
   ```

2. **Asenna Node.js-moduulit:**

   Siirry projektin juurihakemistoon:
   ```bash
   cd WEB_15_group_3_project
   ```

   Asenna riippuvuudet:
   ```bash
   npm install
   ```

3. **Konfiguroi ympäristömuuttujat:**

   - Luo `.env`-tiedosto projektin juureen (jos sitä ei ole).
   - Lisää MongoDB Atlas -yhteysosoite:
     ```
     MONGO_URI=mongodb+srv://<käyttäjä>:<salasana>@spacesignin.a9iig.mongodb.net/SpaceDatabase?retryWrites=true&w=majority
     ```
   - Vaihda `<käyttäjä>` ja `<salasana>` tiimin MongoDB Atlas -tunnuksiin.

   **⚠️ HUOMIO! HUOMIO!**
   
    - Varmista, että .env-tiedosto on lisätty .gitignore-tiedostoon. Tämä suojaa salaisia tunnuksia päätymästä GitHubiin.
    - .gitignore-sisältö:
    ```
    node_modules/
    .env
    *.log
    ```

4. **Käynnistä palvelin:**

   ```bash
   node index.js
   ```

   - Palvelin käynnistyy porttiin `4000` (tai `.env`-tiedostossa määriteltyyn `PORT`-arvoon).
   - Näet viestit: `MongoDB connected` ja `Server is running on port 4000`.
   - **Porttihuomio:** Jos portti 4000 on varattu, muuta `index.js`:ssä rivi `const PORT = process.env.PORT || 4000;` toiseen arvoon (esim. 5000) tai määritä `PORT` `.env`-tiedostossa (esim. `PORT=5000`).

5. **Testaa frontend paikallisesti:**

   - Avaa projektin tiedostot selaimessa tai käytä Live Server -laajennusta Visual Studio Codessa.

---

## Käyttöohjeet

### 1. Frontend:

- Navigoi sivustolla dropdown-valikkojen ja muiden elementtien avulla.
- Täytä ja lähetä lomake EmailJS:n kautta.
- Nauti visuaalisista animaatioista ja responsiivisesta suunnittelusta.

### 2. Backend (API):

Käytä Postmania seuraaviin kutsuihin:

- `GET /api/users` – Hae kaikki käyttäjät.
- `POST /api/users` – Luo uusi käyttäjä  
  Esim.:
  ```json
  {
    "username": "new_user",
    "email": "new@example.com"
  }
  ```
- `PUT /api/users/:id` – Päivitä käyttäjä  
  Esim.:
  ```json
  PUT /api/users/67c746b307be876656bdebd1
  {
    "first_name": "Johan"
  }
  ```
- `DELETE /api/users/:id` – Poista käyttäjä

- **Base URL:** `http://localhost:4000` (tai muu portti, jos muutettu)

### 3. MongoDB Atlas:

- Tarkista tietokannan sisältö Atlasin käyttöliittymässä tai shellillä:
  ```bash
  use SpaceDatabase
  db.users.find()
  ```
---

## Projektin tietokannan tiedostorakenne

Projekti käyttää seuraavaa tietokantapohjaista rakennetta backendissä:

- `database/methods/` – Sisältää CRUD-operaatioiden logiikan:
  - `PUT.js`: Päivittää olemassa olevia dokumentteja (esim. `findByIdAndUpdate`)
  - `DELETE.js`: Poistaa dokumentteja (esim. `findByIdAndDelete`)
  - `GET.js`: Hakee tietokannasta dataa (esim. `find`)
  - `POST.js`: Luo uusia dokumentteja (esim. `create`)
  - /ownPage
    - Löytyy samat PUT, DELETE, GET ja POST -operaatiot. OwnPage-kansion operaatiot käsittelevät vain ownPage-sivun ja admin-sivun spesifisiä toimintoja. Esim. käyttäjän omien tietojen muokkaus, avatarin vaihto jne. Jako auttaa koodin organisoinnissa ja ylläpidettävyydessä.



- `models/` – Määrittelee MongoDB-skeemat Mongoosea käyttäen:
  - `contactForm.js`: Lomakedatan skeema (esim. yhteydenottolomake)
  - `gameQuestion.js`: Pelikysymysten skeema
  - `leaderboard.js`: Tulostaulukon skeema
  - `user.js`: Käyttäjien skeema (esim. `username`, `email`, `first_name`)

- `routes/` – Reitit HTTP-pyyntöjen käsittelyyn:
  - `contactForm.js`: Reitit lomakedatan käsittelyyn
  - `leaderboard.js`: Reitit tulostaulukon hallintaan
  - `questions.js`: Reitit pelikysymysten hallintaan
  - `users.js`: Reitit käyttäjien CRUD-operaatioihin (GET, POST, PUT, DELETE)

- Muut tiedostot:
  - `.env`: Sisältää ympäristömuuttujat, kuten `MONGO_URI` (MongoDB-yhteysosoite). Älä lisää tätä GitHubiin!
  - `db.js`: MongoDB-yhteyden muodostaminen Mongoosea käyttäen.
  - `index.js`: Pääsovellus, käynnistää Express-palvelimen ja yhdistää tietokantaan.
  - `package.json`: Määrittelee projektin riippuvuudet (esim. `express`, `mongoose`, `dotenv`)

---

## Tulevat parannukset

- Lisää sivuja muille planeetoille.
- Parannettu interaktiivisuus ja animaatiot frontendissä.
- Dynaaminen API-tietojen haku backendistä frontendille.
- Lisää validointeja ja virheenkäsittelyä CRUD-operaatioihin.
- Jos käyttäjä kirjautuu admin-tunnuksilla, hän ohjautuu admin.html -sivulle. Admin sivuilla ylläpitäjä voi nähdä kirjautuneet käyttäjät viimeisen 24 tunnin ajalta JWT-tokeneiden perusteella. Admin voi poistaa käyttäjiä suoraan tietokannasta, antaa bannit, tarkastella käyttäjien tietoja suoraan selainsivulla. Tulevaisuuden ominaisuuksia: Admin voi lähettää suoraan viestiä, muokata planeettojen tietoja, tehdä muita muutoksia sivuille.



---

## Ominaisuudet

- Navigointivalikko planeetoille.
- Responsiivinen muotoilu (Materialize CSS).
- Sähköpostilomake, jossa EmailJS-integraatio ja reCAPTCHA-suojaus.
- Live-video avaruudesta.
- Visuaalisia tehosteita (hover-efektit, animaatiot).
- Backend-tuki käyttäjien, lomakkeiden, pelikysymysten ja tulostaulukon hallintaan.

---

### **Ylläpitäjät**

- [![Kharmaa](https://img.shields.io/github/followers/Kharmaa.svg?style=social&label=Kharmaa)](https://github.com/Kharmaa)
- [![jmetsaniemi1](https://img.shields.io/github/followers/jmetsaniemi1.svg?style=social&label=jmetsaniemi1)](https://github.com/jmetsaniemi1)
- [![Dude77fi](https://img.shields.io/github/followers/Dude77fi.svg?style=social&label=Dude77fi)](https://github.com/Dude77fi)
- [![AICHE-H](https://img.shields.io/github/followers/Aiche-H.svg?style=social&label=Aiche-H)](https://github.com/Aiche-H)

## Kehitysympäristö

- **Editorit:** Visual Studio Code, Prettier-lisäosalla
- **Palvelimet:** Live Server frontendin testaukseen, Node.js backendille
- **Versiohallinta:** Git & GitHub
- **API-testaus:** Postman

---


### **Tiedossa olevat ongelmat**

- Dropdown-valikko ei tue tällä hetkellä kosketuslaitteita täydellisesti.
- Responsiivisuus on testattu vain tietyillä laitteilla.

---

## Päivitysten julkaiseminen

Lisäykset tulee julkaista aina **feature/nimi**-branchiin.

**Ohjeet:**

1. Luo uusi branch nimellä **feature/[planeetan nimi]**.
2. Tee muutokset.
3. Lisää muutokset **README.md** tiedostoon.
4. Julkaise muutokset GitHubiin **branchillä, jonka loit**.
5. Tee pull request pääbranchiin.

**Tällä varmistetaan, että:**

- Kaikki muutokset ovat helposti seurattavissa.
- Vältetään merge-konflikteja.
- Projektin koodi pysyy järjestyksessä.

---

## Päivitykset ja lisäykset

- Pohjat planeetoille tehty ja metatiedot lisätty.
- Testattu uusi branch + merge + testattu Visual Studio Codessa - Johannes + Markus + Riikka.

---

## Päivämääräkohtaiset muutokset

### 2024-10-10

**Olen toteuttanut seuraavat muutokset sivuston navigointiin:**

- Uusi logo ja sivunavigointi lisätty.
- Parannettu JavaScript-toiminnallisuus navigointia varten.
- Dropdown-valikko planeetoille lisätty.
- Visuaaliset parannukset Materialize CSS -kirjastolla:
  - Hover-efekti navigointipalkkiin.
  - Selkeämpi ulkoasu valikon linkeille.

### 2024-10-15

**Commit viesti:** Lisättiin kaikille sivuille yhteinen footer ja korjattiin ikonien toimivuus.

**Muutokset:**

- Footer lisätty kaikille sivuille.
- Korjattu ikonien toimivuus kaikilla sivuilla.
- Lisätty navigaatio kaikkiin index-tiedostoihin.

### 2024-10-25

**Projektin kansiorakenne päivitetty.**

- Selkeämpi kansiorakenne projektin kasvua varten.
- Jokaiselle sivulle oma kansio (CSS, JS, data, kuvat).
- Testattu linkitysten ja resurssien toimivuus.

### 2024-10-31

**Aurinko-sivun päivitykset:**

- Uudet tiedostot: `header.css`, `orbitanimation.css`, `header.js`.
- CSS-luokkien lisääminen asetteluun.
- Hover-efektit ja animaatiot lisätty.
- Navigoinnin ulkonäön parannus.

### 2024-11-01

**Mercurius- ja Venus-projektit:**

- Aloitettu HTML-prototyyppien kehitys.
- Lisätty visuaalisia käyttöliittymän osia.

### 2024-11-13

- Ensimmäinen HTML-koodi lomakkeesta luotu.

### 2024-11-19

- Headerin ja footerin lisääminen.
- Lähetä-painikkeen toiminnan korjaaminen.

### 2024-11-26

- CSS-tyylit lisätty lomakkeelle.

### 2024-12-04

- Koodin siistiminen Prettierillä.

### 2024-12-16

- Dropdown-valikko saatu toimimaan.

### 2024-12-18

- Otsikko ja teksti lisätty.

### 2025-01-08

**Toiminnot lisätty:**

- EmailJS ja reCAPTCHA toimiviksi.

### 2025-01-17

**Viimeisimmät muutokset:**

- Ulkoasun viimeistely.
- Navigaation päivitys.
- Domain lisätty reCAPTCHA-asetuksiin.
- Profiilikuvat ja -tekstit lisätty.
- Yhden kuvan linkkaaminen lisätty.
- Live-video avaruudesta linkitetty.
- Tekstiä luotu ja tyylitiedostoja päivitetty.
- Etusivun ulkoasua parannettu.
- Uusia custom CSS-arvoja otettu käyttöön.

### 2025-04-05

**Tietokanta tiedostorakenne, yhdistys MongoDB ja testaus Postmanilla:**

- Luotu tietokannan tiedostorakenne.
- Yhdistetty MongoDB.
- Testattu toimivuu Postmanilla.
- PUT, GET, DELETE, POST metodit tehty. Oli pakko tehdä kaikki, jotta pystyi testaamaan users toimivuutta kunnolla.
- .env -tiedosto
- .gitignore -tiedosto
- db.js & index.js konfiguraatio
- routes/users.js aloitettu
- models/user.js aloitettu
- Ohjeet luotu README.md -tiedostoon.

---

### 2025-04-28

**Tietokanta tiedostorakenne päivitys, omat sivut, salasana hashaus, brypt ja testaus Postmanilla:**

- Token-autentikointi toteutus:
  - Lisätty JWT-tokenin luonti kirjautumisen yhteydessä.
  - Lisätty tokenin tallennus localStorageen
  - Lisätty tokenin tarkistus palvelunpuolella

- Käyttäjän tietojen hallinta:
  - Lisätty käyttäjän tietojen haku tokenin avulla
  - Lisätty käyttäjän tietojen päivitys
  - Lisätty käyttäjän poisto

- Salasanan hallinta:
  - Lisätty salasanan hashaus bcrypt-kirjastolla
  - Korjattu salasanan vertailu
  - Lisätty salasanan vaihto

- Käyttöliittymän päivitykset:
  - Lisätty profiilitietojen näyttäminen
  - Lisätty modaalit käyttäjän tietojen muokkaamiseen
  - Lisätty varmistusviestit toiminnoille

- Tietoturvapäivitykset:
  - Lisätty salasanojen hashaus
  - Lisätty token-pohjainen autentikointi
  - Lisätty tietojen validointi

- Käyttäjäkokemus:
  - Lisätty onnistuneiden operaatioiden vahvistukset palvelimen terminaalissa ja selaimen dev-toolsissa
  - Pari virheilmoitusta lisätty

---

### Global.css

- Päivitetty fonttien ja otsikkojen tyylimäärityksiä.