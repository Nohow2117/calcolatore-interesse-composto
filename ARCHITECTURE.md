# Architettura del Progetto

## Panoramica
Il progetto è una single-page application (SPA) front-end only, basata su HTML5, Tailwind CSS, JavaScript ES6 e Chart.js. Non richiede backend né database: tutti i calcoli e la visualizzazione avvengono lato client.

## Componenti principali
- **index.html**: struttura semantica della pagina, include i riferimenti alle CDN di Tailwind, Alpine.js e Chart.js.
- **assets/js/main.js**: contiene la logica di calcolo e la gestione dell'interfaccia reattiva (con Alpine.js opzionale).
- **assets/css/tailwind.css**: (opzionale) per override o build locale di Tailwind.
- **Chart.js**: per la visualizzazione grafica dei risultati.

## Responsabilità dei componenti
- **HTML**: struttura, accessibilità, layout mobile-first
- **CSS (Tailwind)**: stile utility-first, personalizzazione rapida
- **JavaScript/Alpine.js**: logica di calcolo, binding reattivi, gestione eventi
- **Chart.js**: rendering grafico

## Pattern suggeriti
- Separation of concerns tra markup, stile e logica
- Reactive UI tramite Alpine.js (MVVM pattern semplificato)
- Modularizzazione JS se la logica cresce

## Interazione tra componenti
L'utente inserisce i dati nel form, JS aggiorna i risultati e il grafico in tempo reale. Tutto avviene nel browser.
