import $ from 'jquery';
import Chart from 'chart.js/dist/Chart.js'
import CountrySelector from './CountrySelector';

class ChartHandler {
  constructor(dates, confirmed, recovered, deaths, active, confirmedDifference, recoveredDifference, deathsDifference, activeDifference, data) {
    this.dates = dates;
    this.confirmedByDay = confirmed;
    this.confirmedByDayDifference = confirmedDifference;
    this.recoveredByDay = recovered;
    this.recoveredByDayDifference = recoveredDifference;
    this.deadByDay = deaths;
    this.deadByDayDifference = deathsDifference;
    this.activeByDay = active;
    this.activeByDayDifference = activeDifference;

    this.data = data;

    this.chartTotal = $('.js-chart-total');
    this.chartTotalDiff = $('.js-chart-total-diff');
    this.chartActive = $('.js-chart-active');
    this.chartActiveDiff = $('.js-chart-active-diff');
    this.chartRecovered = $('.js-chart-recovered');
    this.chartRecoveredDiff = $('.js-chart-recovered-diff');
    this.chartFatalities = $('.js-chart-fatality');
    this.chartFatalitiesDiff = $('.js-chart-fatality-diff');



    this.chartMillion = $('.js-chart-million');

    let charts = [
      [this.chartTotal, this.confirmedByDay, 'rgba(220, 53, 69, 0.4)', 'rgba(201, 24, 41, 1)', 'Total Cases'],
      [this.chartTotalDiff, this.confirmedByDayDifference, 'rgba(220, 53, 69, 0.4)', 'rgba(201, 24, 41, 1)', 'New Cases'],
      [this.chartRecovered, this.recoveredByDay, 'rgba(40, 167, 69, 0.4)', 'rgba(30, 123, 52, 1)', 'Total Recovered'],
      [this.chartRecoveredDiff, this.recoveredByDayDifference, 'rgba(40, 167, 69, 0.4)', 'rgba(30, 123, 52, 1)', 'New Recovered'],
      [this.chartFatalities, this.deadByDay, 'rgba(64, 64, 64, 0.4)', 'rgba(26, 26, 26, 1)', 'Total Fatalities'],
      [this.chartFatalitiesDiff, this.deadByDayDifference, 'rgba(64, 64, 64, 0.4)', 'rgba(26, 26, 26, 1)', 'New Fatalities'],
      [this.chartActive, this.activeByDay, 'rgba(255, 193, 7, 0.4)', 'rgba(230, 172, 0, 1)', 'Active Cases'],
      [this.chartActiveDiff, this.activeByDayDifference, 'rgba(255, 193, 7, 0.4)', 'rgba(230, 172, 0, 1)','Increase/Decrease in Active Cases'],
    ]

    this.drawCharts(charts);
  }

  drawCharts(charts) {
    let displayedCharts = [];
    charts.forEach( (value, index) => {
      let singleChart = new Chart(value[0], {
        type: 'line',
        data: {
          labels: this.dates,
          datasets: [{
            label: value[4],
            data: value[1],
            backgroundColor: [
                value[2],
            ],
            borderColor: [
                value[3],
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
      displayedCharts.push(singleChart);
    })

    let countrySelector = new CountrySelector(this.data, displayedCharts);

  }

}

export default ChartHandler;
