import $ from 'jquery';
import Chart from 'chart.js';
import CountrySelector from './CountrySelector';

class ChartHandler {
  constructor(dates, confirmed, recovered, deaths, active, data) {
    this.dates = dates;
    this.confirmedByDay = confirmed;
    this.recoveredByDay = recovered;
    this.deadByDay = deaths;
    this.activeByDay = active;
    this.data = data;

    this.chartTotal = $('.js-chart-total');
    this.chartDetails = $('.js-chart-details');
    this.chartMillion = $('.js-chart-million');

    this.drawCharts();
  }

  drawCharts() {
    // Total Chart
    let chartTotal = new Chart(this.chartTotal, {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [{
          label: 'Total Cases',
          data: this.confirmedByDay,
          backgroundColor: [
              'rgba(220, 53, 69, 0.4)',
          ],
          borderColor: [
              'rgba(201, 24, 41, 1)',
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
      }
    });

    // Details Chart
    let chartDetails = new Chart(this.chartDetails, {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
          label: 'Active Cases',
          data: this.activeByDay,
          backgroundColor: [
              'rgba(255, 193, 7, 0.4)',
          ],
          borderColor: [
              'rgba(230, 172, 0, 1)',
          ],
          borderWidth: 2
        },
        {
        label: 'Recovered',
        data: this.recoveredByDay,
        backgroundColor: [
            'rgba(40, 167, 69, 0.4)',
        ],
        borderColor: [
            'rgba(30, 123, 52, 1)',
        ],
        borderWidth: 2
        },
        {
        label: 'Fatalities',
        data: this.deadByDay,
        backgroundColor: [
            'rgba(64, 64, 64, 0.4)',
        ],
        borderColor: [
            'rgba(26, 26, 26, 1)',
        ],
        borderWidth: 2
        }
      ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
      }
    });

    let countrySelector = new CountrySelector(this.data, chartDetails, chartTotal);

  }

}

export default ChartHandler;
