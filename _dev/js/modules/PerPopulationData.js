import $ from 'jquery';
import Chart from 'chart.js/dist/Chart.js'

class PerPopulationData {
  constructor(totalCases, totalDeaths, totalRecovered, totalActiveCases, country, data) {
    this.totalCases = totalCases;
    this.totalDeaths = totalDeaths;
    this.totalRecovered = totalRecovered;
    this.totalActiveCases = totalActiveCases;
    this.country = country;
    this.data = data;

    this.totalCasesMillionContainer = $('.js-total-million');
    this.activeCasesMillionContainer = $('.js-active-million');
    this.recoveredCasesMillionContainer = $('.js-recovered-million');
    this.deathsMillionContainer = $('.js-deaths-million');
    this.comparisonChart = $('.js-chart-comparison');
    this.comparisonChartContent = '<canvas class="js-chart-comparison" width="400" height="400" aria-label="Comparison Chart" role="img"></canvas>';
    this.events();
  }

  events() {
    this.comparisonChart.replaceWith(this.comparisonChartContent);

    fetch("https://restcountries.eu/rest/v2/name/" + this.country)
      .then(response => response.json())
      .then(data => {
        let countryData = (data['0']);
        let populationInMillion = countryData.population / 1000000;
        this.populateStats(populationInMillion);
        this.drawComparisonChart(populationInMillion, this.country);
      })
      .catch(err => {
        this.totalCasesMillionContainer.text('N/A');
        this.activeCasesMillionContainer.text('N/A');
        this.recoveredCasesMillionContainer.text('N/A');
        this.deathsMillionContainer.text('N/A');
      });
  }

  populateStats(populationInMillion) {
    let totalPerMillion = Math.round(this.totalCases / populationInMillion);
    let activePerMillion = Math.round(this.totalActiveCases / populationInMillion);
    let recoveredPerMillion = Math.round(this.totalRecovered / populationInMillion);
    let deadPerMillion = Math.round(this.totalDeaths / populationInMillion);

    this.totalCasesMillionContainer.text(totalPerMillion);
    this.activeCasesMillionContainer.text(activePerMillion);
    this.recoveredCasesMillionContainer.text(recoveredPerMillion);
    this.deathsMillionContainer.text(deadPerMillion);
  }

  drawComparisonChart(selectedPopulationInMillion, selectedCountry) {
    fetch("https://restcountries.eu/rest/v2/name/italy")
      .then(response => response.json())
      .then(data => {
        let italyData = (data['0']);
        let italyPopulationInMillion = italyData.population / 1000000;

        let selectedCountryDeaths = this.deathsSinceFirstConfirmedCase(selectedPopulationInMillion, selectedCountry);

        let italyDeaths = this.deathsSinceFirstConfirmedCase(italyPopulationInMillion, 'Italy');

        let labels = selectedCountryDeaths[2];

        if(labels.length < italyDeaths[2].length) {
          labels = italyDeaths[2];
        }

        console.log(selectedCountryDeaths);
        console.log(italyDeaths);

        let comparisonChart = new Chart($('.js-chart-comparison'), {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Italy: Fatalities per million since first confirmed case',
              data: italyDeaths[0],
              backgroundColor: [
                  'rgba(166, 166, 166, 0.4)',
              ],
              borderColor: [
                  'rgba(140, 140, 140, 1)',
              ],
              borderWidth: 2
            },
            {
              label: selectedCountry + ': Fatalities per million since first confirmed case',
              data: selectedCountryDeaths[0],
              backgroundColor: [
                  'rgba(0, 102, 255, 0.4)',
              ],
              borderColor: [
                  'rgba(0, 82, 204, 1)',
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

      })
      .catch(err => {

      });
  }


  deathsSinceFirstConfirmedCase(populationInMillion, country) {
    let data = [];
    let deathsSinceFirstConfirmed = [];
    let datesSinceFirstConfirmed = [];

    let firstConfirmedCase = false;
    let days = [];
    let day = 1;

    $.each(this.data[country], (i, val) =>  {
      if(val.confirmed) {
        firstConfirmedCase = true;
      }

      if(firstConfirmedCase) {
        deathsSinceFirstConfirmed.push(val.deaths);
        datesSinceFirstConfirmed.push(val.date)
        days.push('Day ' + day);
        day++;
      }

    });

    let deathsSinceFirstConfirmedMil = [];

    deathsSinceFirstConfirmed.forEach( (value, index) => {
      deathsSinceFirstConfirmedMil.push(Math.round(value / populationInMillion));
    });

    data.push(deathsSinceFirstConfirmedMil);
    data.push(datesSinceFirstConfirmed[0]);
    data.push(days);

    return data;

  }

}

export default PerPopulationData;
