import $ from 'jquery';
import QuickStats from './QuickStats';
import ChartHandler from './ChartHandler';

class InjectData {
  constructor( data, country ) {
    this.country = country;
    this.data = data;
    this.lastUpdatedContainer = $('.js-last-updated');
    this.events();
  }

  events() {

    let dates = [];
    let confirmed = [];
    let recovered = [];
    let deaths = [];
    let active = [];

    // create an arrays by date
    $.each(this.data[this.country], (i, val) =>  {
      dates.push(val.date);
      confirmed.push((val.confirmed || 0) < 0 ? 0 : val.confirmed || 0);
      recovered.push((val.recovered || 0) < 0 ? 0 : val.recovered || 0);
      deaths.push((val.deaths || 0) < 0 ? 0 : val.deaths || 0);
      active.push(((val.confirmed - val.recovered - val.deaths)  || 0) < 0 ? 0 : (val.confirmed - val.recovered - val.deaths));
    });

    let confirmedDifference = this.getDifferenceByDay(confirmed);
    let recoveredDifference = this.getDifferenceByDay(recovered);
    let deathsDifference = this.getDifferenceByDay(deaths);
    let activeDifference = this.getDifferenceByDay(active);

    let chartHandler = new ChartHandler(dates, confirmed, recovered, deaths, active, confirmedDifference, recoveredDifference, deathsDifference, activeDifference, this.data);

    // total cases
    let totalCases = confirmed[confirmed.length - 1] || confirmed.reduce((max, n) => n > max ? n : max);
    let totalDeaths = deaths[deaths.length - 1] || deaths.reduce((max, n) => n > max ? n : max);
    let totalRecovered = recovered[recovered.length - 1] || recovered.reduce((max, n) => n > max ? n : max);
    let totalActiveCases = totalCases - totalDeaths - totalRecovered;

    let quickStats = new QuickStats(totalCases, totalDeaths, totalRecovered, totalActiveCases);

    let lastDate = dates[dates.length - 1];
    this.lastUpdatedContainer.text(lastDate);

  }

  getDifferenceByDay(set) {
    let newSet = [];
    set.forEach( (value, index) => {
      if(index == 0) {
        newSet.push(0);
      } else {
        newSet.push(value - set[index - 1])
      }
    })

    return newSet;
  }

}

export default InjectData;
