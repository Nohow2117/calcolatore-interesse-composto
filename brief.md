# Calcolatore di Interessi Composti – Specifica Tecnica

## 1. Obiettivo del progetto
Realizzare un micro‑tool web **front‑end only** che permetta all’utente italiano non esperto di visualizzare in modo immediato e chiaro la crescita del proprio capitale grazie all’interesse composto, con la possibilità di aggiungere versamenti periodici.

## 2. Stack tecnologico
| Livello | Tecnologia | Note |
| --- | --- | --- |
| Mark‑up | **HTML5** semantico | tag section/article/details |
| Stile | **Tailwind CSS 3** via CDN | mobile‑first, utility‑first |
| Logica | **JavaScript ES6** puro + **Alpine.js 3** (facoltativo) | reactive bindings lightweight |
| Grafico | **Chart.js 4** via CDN | linea & gradient fill |

> **Hosting**: può vivere come pagina statica in WordPress / Render static site.

## 3. Struttura dei file
```
compound‑calculator/
├── index.html
└── assets/
    ├── js/
    │   └── main.js
    └── css/   (opz.)
        └── tailwind.css (solo se si compila Tailwind in locale)
```

## 4. Architettura Front‑End
### 4.1 Skeleton HTML
```html
<!DOCTYPE html>
<html lang="it" class="scroll-smooth">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Calcolatore Interessi Composti</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" defer></script>
</head>
<body class="bg-gray-50 text-slate-800 antialiased">
  <header class="py-6 text-center">
    <h1 class="text-2xl font-bold">Calcolatore di Interessi Composti</h1>
  </header>

  <main class="max-w-xl mx-auto px-4" x-data="calculator()">
    <!-- Form di input -->
    <section aria-labelledby="form-title" class="space-y-6 bg-white p-6 rounded-2xl shadow">
      <h2 id="form-title" class="text-lg font-semibold">Inserisci i tuoi dati</h2>

      <label class="block">
        <span class="text-sm font-medium">Capitale iniziale (€)</span>
        <input type="number" min="0" x-model.number="P" class="mt-1 input" placeholder="10000" required/>
      </label>

      <label class="block">
        <span class="text-sm font-medium flex justify-between">
          Tasso di interesse annuale (%): <span x-text="r.toFixed(1)+'%'"></span>
        </span>
        <input type="range" min="0" max="15" step="0.1" x-model.number="r" class="w-full"/>
      </label>

      <label class="block">
        <span class="text-sm font-medium flex justify-between">
          Durata investimento (anni): <span x-text="t"></span>
        </span>
        <input type="range" min="1" max="40" step="1" x-model.number="t" class="w-full"/>
      </label>

      <label class="block">
        <span class="text-sm font-medium">Frequenza capitalizzazione</span>
        <select x-model.number="n" class="mt-1 select">
          <option value="1">Annuale</option>
          <option value="2">Semestrale</option>
          <option value="4">Trimestrale</option>
          <option value="12">Mensile</option>
        </select>
      </label>

      <details class="pt-2">
        <summary class="cursor-pointer select-none text-sm font-medium text-blue-600">+ Aggiungi versamenti periodici</summary>
        <div class="mt-4 space-y-4">
          <label class="block">
            <span class="text-sm font-medium">Importo versamento (€)</span>
            <input type="number" min="0" x-model.number="PMT" class="mt-1 input" placeholder="0"/>
          </label>
          <label class="block">
            <span class="text-sm font-medium">Frequenza versamento</span>
            <select x-model="freqPMT" class="mt-1 select">
              <option value="mensile">Mensile</option>
              <option value="annuale">Annuale</option>
            </select>
          </label>
        </div>
      </details>

      <button @click="compute()" class="w-full btn-primary">Calcola la Crescita</button>
    </section>

    <!-- Risultato -->
    <section class="mt-8 text-center">
      <p class="text-sm uppercase tracking-wide">Capitale finale dopo <span x-text="t"></span> anni</p>
      <p class="text-4xl font-extrabold text-emerald-600" x-text="formatCurrency(A)">€ 0</p>
    </section>

    <!-- Grafico -->
    <section class="mt-6 bg-white p-4 rounded-2xl shadow">
      <canvas id="growthChart" height="250"></canvas>
    </section>

    <!-- Tabella riassuntiva -->
    <section class="mt-4">
      <details>
        <summary class="cursor-pointer select-none font-medium">Tabella dettagliata</summary>
        <div class="overflow-x-auto mt-4">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b bg-gray-100">
                <th class="px-2 py-1 text-left">Anno</th>
                <th class="px-2 py-1 text-right">Versamenti (€)</th>
                <th class="px-2 py-1 text-right">Interessi (€)</th>
                <th class="px-2 py-1 text-right">Totale (€)</th>
              </tr>
            </thead>
            <tbody id="tableBody"></tbody>
          </table>
        </div>
      </details>
    </section>
  </main>

  <script src="assets/js/main.js" defer></script>
  <!-- FAQ & FinancialProduct Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": "Calcolatore di Interessi Composti",
    "description": "Tool online gratuito per simulare la crescita del capitale con interesse composto e versamenti periodici.",
    "isAccessibleForFree": true,
    "url": "https://example.com/calcolatore-interessi-composti"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "Che cos'è l'interesse composto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "L'interesse composto è l'interesse calcolato sul capitale iniziale e sugli interessi maturati in precedenza."
      }
    }, {
      "@type": "Question",
      "name": "Posso aggiungere versamenti periodici al calcolo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sì, il calcolatore permette di inserire un importo che verrà versato ogni mese o anno."
      }
    }]
  }
  </script>
</body>
</html>
```

### 4.2 Classi Tailwind utili
| Scopo | Classe Tailwind | Commento |
| --- | --- | --- |
| Bottone primario | `btn-primary` (custom utility) | `@apply bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-2xl w-full` definita in `tailwind.css` |
| Input base | `input` | `@apply w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500` |
| Select base | `select` | analoga a input |

## 5. Logica di Calcolo
### 5.1 Variabili
- **P** – capitale iniziale (int/float)
- **r** – tasso annuale decimale (`slider / 100`)
- **n** – periodi di capitalizzazione l’anno (1,2,4,12)
- **t** – anni (int)
- **PMT** – versamento ad ogni periodo di capitalizzazione (calcolato su `freqPMT`)

### 5.2 Pseudocodice JavaScript
```js
function calculateCompound(P, rPerc, n, t, PMT, pmtFreq) {
  // rPerc è in percentuale, convertirlo in decimale
  const r = rPerc / 100;
  const periods = n * t;
  const ratePerPeriod = r / n;

  // Se l'utente versa solo annualmente ma la capitalizzazione è mensile
  const effectivePMT = pmtFreq === 'annuale' ? PMT / n : PMT;

  const accruedPrincipal = P * Math.pow(1 + ratePerPeriod, periods);
  const accruedContrib   = effectivePMT * ( (Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod );

  return accruedPrincipal + accruedContrib;
}
```

### 5.3 Dettaglio passaggi `compute()` (Alpine)
1. Validare input (>=0, `r` 0‑15).
2. Calcolare **A** con `calculateCompound()`.
3. Popolare array `labels[]` (1…t) e `data[]` (capitale anno per anno) iterando su ogni anno:  
   - per l’anno i calcolare `calculateCompound(P, r, n, i, PMT, freqPMT)`.
4. Aggiornare grafico con `chart.update()`.
5. Aggiornare tabella:
   - colonna interessi = capitale anno i ‑ capitale anno i‑1 ‑ versamento anno.
6. Scroll/Focus su risultato.

## 6. Integrazione Chart.js
```js
let chart;
function renderChart(labels, data) {
  const ctx = document.getElementById('growthChart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Capitale (€)',
        data,
        fill: {
          target: 'origin',
          above: 'rgba(16,185,129,0.15)' // verde soft
        },
        tension: 0.3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: v => '€ ' + v.toLocaleString('it-IT') } }
      }
    }
  });
}
```

## 7. Generazione della tabella dettagliata
```js
function buildTable(rows) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    tbody.insertAdjacentHTML('beforeend',
      `<tr class="border-b">
         <td class="px-2 py-1">${r.year}</td>
         <td class="px-2 py-1 text-right">€ ${r.payment}</td>
         <td class="px-2 py-1 text-right">€ ${r.interest}</td>
         <td class="px-2 py-1 text-right font-medium">€ ${r.total}</td>
       </tr>`);
  });
}
```

## 8. UX/UI Linee Guida
- **Palette**: `#ffffff`, `#f9fafb`, `#1e40af` (blu indigo), `#10b981` (verde), test testuali #334155.
- **Font**: system‑font stack per rapidità.
- **Error handling**: messaggio rosso sotto al campo con `role="alert"`.
- **Animazioni**: `transition` su hover bottone.

## 9. Performance
- CDN cache‑hit per Tailwind, Alpine, Chart.js.
- Inline script minificato < 10 KB.
- Nessuna immagine raster. Icone via Heroicons SVG inline.

## 10. FAQ Rich Snippet (JSON‑LD)
*(già incluso nello skeleton)*

## 11. Errori comuni da evitare
| Errore | Come evitarlo |
| --- | --- |
| Non convertire il tasso da % a decimale | `rPerc / 100` prima dei calcoli |
| Dimenticare `chart.destroy()` prima di ridisegnare | controllare se `chart` esiste |
| Arrotondamenti aggressivi che generano importi diversi | usare `Number.EPSILON` o `toFixed(2)` solo in output |
| Versamenti annuali non divisi per `n` | vedere `effectivePMT` nel pseudocodice |
| Mancato `defer` sugli script => blocco rendering | aggiungere `defer` in `<script>` |

## 12. Codice finale pronto all’uso (estratto)
### 12.1 `index.html` (snippet minimal)
```html
<body x-data="calculator()">
  <!-- …form come sopra… -->
  <script src="assets/js/main.js" defer></script>
</body>
```

### 12.2 `assets/js/main.js`
```js
function calculator() {
  return {
    P: 10000, r: 5, n: 12, t: 10, PMT: 0, freqPMT: 'mensile', A: 0,
    compute() {
      this.A = calculateCompound(this.P, this.r, this.n, this.t, this.PMT, this.freqPMT);
      // build labels & data
      const labels = Array.from({length: this.t}, (_,i)=> i+1);
      const data = labels.map(y=> calculateCompound(this.P, this.r, this.n, y, this.PMT, this.freqPMT));
      renderChart(labels, data);
      this.buildRows(labels, data);
    },
    buildRows(labels, data) { /* usa buildTable() */ },
    formatCurrency(val) { return val.toLocaleString('it-IT', {style:'currency', currency:'EUR', maximumFractionDigits:0}); }
  };
}
```

