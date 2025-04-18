// main.js
// Logica globale per Calcolatore Interessi Composti usando funzione calculator

window.calculator = function() {
  return {
    P: 10000,       // Capitale iniziale
    r: 5,           // Tasso annuo (%)
    n: 12,          // Frequenza capitalizzazione (mensile)
    t: 10,          // Durata (anni)
    PMT: 0,         // Versamento periodico
    freqPMT: 'mensile', // Frequenza versamento
    A: 0,           // Capitale finale
    chart: null,    // Istanza Chart.js
    freqMap: {
      'annuale': 1,
      'semestrale': 2,
      'trimestrale': 4,
      'mensile': 12
    },

    // Calcolo interesse composto con versamenti periodici
    calculateCompound(P, r, n, t, PMT, freqPMT) {
      const rate = r / 100;
      const periods = n * t;
      const i = rate / n;
      let A = P * Math.pow(1 + i, periods);
      if (PMT > 0 && i > 0) {
        const nPMT = this.freqMap[freqPMT];
        A += PMT * ((Math.pow(1 + i, periods) - 1) / i) * (nPMT / n);
      }
      return A;
    },

    // Serie per il grafico (anno per anno)
    computeSeries() {
      let data = [];
      for (let year = 0; year <= this.t; year++) {
        const periods = this.n * year;
        const i = (this.r / 100) / this.n;
        let A = this.P * Math.pow(1 + i, periods);
        if (this.PMT > 0 && i > 0) {
          const nPMT = this.freqMap[this.freqPMT];
          A += this.PMT * ((Math.pow(1 + i, periods) - 1) / i) * (nPMT / this.n);
        }
        data.push(Math.round(A));
      }
      return data;
    },

    // Funzione principale del calcolo
    compute() {
      this.A = this.calculateCompound(this.P, this.r, this.n, this.t, this.PMT, this.freqPMT);
      this.updateChart();
    },

    // Inizializza o aggiorna Chart.js
    updateChart() {
      const ctx = document.getElementById('chart').getContext('2d');
      const labels = Array.from({ length: this.t + 1 }, (_, i) => `${i} anni`);
      const data = this.computeSeries();
      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      } else {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Capitale (€)',
              data: data,
              fill: true,
              backgroundColor: ctx.createLinearGradient(0, 0, 0, 180),
              borderColor: '#6366f1',
              tension: 0.2
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      }
    },

    // Inizializza al mount
    init() {
      this.compute();
    }
  };
};
