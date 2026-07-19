# Birthday Queen & Princess Roomservice

Een mobiele, feestelijke roomservice-PWA voor de gezamenlijke verjaardagsavond van Najat (Birthday Queen) en Ameya (Birthday Princess). De versierde zolder verandert in een warm privéresort en Bram is de gastheer en roomservice.

**Publieke app:** https://btfboer.github.io/Birthday-Queen-Princess-Roomservice/

## Wat de app kan

- Kies wie bestelt: Najat, Ameya of Najat & Ameya samen.
- Stel een bestelling samen uit avondeten, snacks en zoet, drinken, comfort, film en entertainment, hulp en service en verjaardagsservice.
- Verhoog of verlaag aantallen; een aantal van nul verwijdert het verzoek.
- Gebruik exclusieve privacykeuzes en een lokale niet-storen-afteltimer die na verversen doorloopt.
- Kies een tempo, van rustig aan tot een duidelijk gemarkeerde huiselijke noodbel.
- Voeg maximaal 500 tekens aan bijzonderheden toe.
- Controleer de volledige bestelling vóór het openen van WhatsApp.
- Deel of kopieer het bestelbericht als alternatief.
- Bewaar de laatste tien bestellingen lokaal en laad een eerdere bestelling opnieuw.
- Beheer lokale bestellingen in de gastheer-modus en markeer ze als ontvangen, in bereiding, onderweg, afgeleverd of geannuleerd.
- Pas gastheer, WhatsApp-nummer, servicestatus, feedback, standaardprioriteit en lokale pincode aan.
- Installeer de app als PWA en gebruik de eerder geladen app-shell offline.

## WhatsApp-integratie

De primaire actie opent:

```text
https://wa.me/31648203686?text=<url-gecodeerd-bestelbericht>
```

WhatsApp wordt met de complete bestelling vooraf ingevuld. De gebruiker moet in WhatsApp bewust nog één keer op **Versturen** tikken. Een statische webapp kan en mag een bericht niet betrouwbaar zonder die gebruikersbevestiging verzenden; de app beweert daarom nergens dat een bericht automatisch is verzonden.

Als WhatsApp niet geopend kan worden, probeert de app eerst de Web Share API en daarna het klembord. Beide mogelijkheden zijn afhankelijk van browserondersteuning en apparaatinstellingen. Kopiëren en delen zijn ook als losse knoppen beschikbaar in het controlescherm.

Het nummer kan in de app via **Instellingen → WhatsApp-nummer** worden aangepast. Gebruik alleen cijfers inclusief landcode, dus bijvoorbeeld `31648203686` en niet `+31 6 48203686`.

## Installeren op een iPhone

1. Open de publieke URL in Safari.
2. Tik op de deelknop in Safari.
3. Kies **Zet op beginscherm**.
4. Bevestig met **Voeg toe**.

Daarna opent Zolder Resort als zelfstandige app. De app blijft ook zonder installatie rechtstreeks in Safari bruikbaar.

## Lokaal gebruiken

Er is geen buildstap en er zijn geen dependencies. Start vanuit de projectmap bij voorkeur een kleine lokale webserver, zodat de service worker correct kan werken:

```bash
python3 -m http.server 8080
```

Open daarna `http://localhost:8080/`. Rechtstreeks dubbelklikken op `index.html` toont de interface ook, maar browserfuncties zoals de service worker en het klembord kunnen bij een `file://`-URL beperkt zijn.

## GitHub Pages

De workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) publiceert de volledige statische projectmap automatisch na iedere push naar `main`. De workflow gebruikt de officiële GitHub Pages-actions en heeft alleen de noodzakelijke rechten voor repository-inhoud, Pages en het OIDC-token.

Als Pages nog niet eerder voor deze repository is geactiveerd, voer dan eenmalig uit:

1. Open de repository op GitHub.
2. Ga naar **Settings → Pages**.
3. Kies bij **Source**: **GitHub Actions**.

Alle app-, manifest- en service-workerpaden zijn relatief. Daardoor werkt de app onder het repositorypad `/Birthday-Queen-Princess-Roomservice/` en niet alleen op een hoofddomein.

## Privacy en lokale opslag

Er is geen backend, database, analyticsdienst of API-sleutel. Deze gegevens worden uitsluitend via `localStorage` in de gebruikte browser bewaard:

- instellingen;
- maximaal tien recente bestellingen;
- lokale dashboardstatussen;
- de actieve niet-storenkeuze en eventuele eindtijd.

Bestellingen op de iPhone van Najat of Ameya verschijnen dus **niet automatisch** in een dashboard op Brams telefoon. Alleen het geopende WhatsApp-bericht vormt de overdracht tussen apparaten. De gastheer-pincode (standaard `2026`) is bovendien slechts een lokale, visuele drempel en geen echte beveiliging. Verwijder browsergegevens of gebruik **Reset hele app** om alle lokale gegevens te wissen.

## Projectstructuur

```text
.
├── index.html                 # Semantische interface en dialogen
├── styles.css                 # Mobiele luxe vormgeving en toegankelijkheid
├── app.js                     # Menu-data, state, interactie, WhatsApp en opslag
├── manifest.webmanifest       # PWA-metadata en iconen
├── service-worker.js          # App-shellcache en offline fallback
├── offline.html               # Zelfstandige offlinepagina
├── assets/
│   ├── icon.svg               # Bewerkbare lokale bronillustratie
│   ├── icon-192.png           # PWA-icoon
│   ├── icon-512.png           # PWA-/maskable icoon
│   └── apple-touch-icon.png   # iOS-beginschermicoon
├── .github/workflows/
│   └── deploy-pages.yml       # Automatische Pages-deployment
└── .nojekyll                  # Publiceer alle statische bestanden ongewijzigd
```

## Techniek en toegankelijkheid

De app gebruikt semantische HTML5, moderne CSS en vanilla JavaScript. Er is geen framework of buildproces. Dynamische gebruikersinhoud wordt met `textContent` aan de DOM toegevoegd. De interface heeft grote aanraakvlakken, zichtbare focusstijlen, toetsenbordbediening, `aria-live`-feedback, veilige iPhone-randen en respect voor `prefers-reduced-motion`. Geluid staat standaard uit en wordt nooit automatisch afgespeeld.

De app blijft bruikbaar wanneer Web Share, Clipboard, vibratie of service workers ontbreken. De service worker gebruikt voor navigatie een network-firststrategie met lokaal gecachte fallback en voor lokale assets een cache-firststrategie met verversing op de achtergrond.

## Mogelijke toekomstige uitbreiding

Voor echte synchronisatie, ontvangstbevestigingen en statusupdates tussen verschillende apparaten is een backend nodig. Mogelijke vervolgstappen zijn:

- WhatsApp Business Cloud API voor servergestuurde berichten en sjablonen;
- Firebase of Supabase voor realtime bestellingen, authenticatie en statusupdates;
- pushnotificaties via een betrouwbare servercomponent.

Zulke uitbreidingen vereisen accounts, beveiligde servercredentials, privacykeuzes en beheer buiten deze statische GitHub Pages-app.
