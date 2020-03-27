import $ from 'jquery';
import InjectData from './InjectData';
import CountryFlags from './CountryFlags';
import autoComplete from '../../../node_modules/js-autocomplete/auto-complete';

class CountrySelector {
  constructor(data, chartDetails, chartTotal) {
    this.data = data;
    this.input = $('.js-country-selector');
    this.btn = $('.js-search-btn');
    this.alert = $('.js-alert-text');
    this.chartTotal = $('.js-chart-total');
    this.locationContainer = $('.js-location');
    this.chartTotal = chartTotal;
    this.chartDetails = chartDetails;
    this.events();
  }

  events() {
    let availableCountries = Object.keys(this.data);

    let that = this;

    let automCompleteCountry = new autoComplete({
      selector: '.js-country-selector',
      minChars: 2,
      source: function(term, suggest){
          term = term.toLowerCase();
          var choices = availableCountries;
          var matches = [];
          for (let i=0; i<choices.length; i++)
              if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
          suggest(matches);
      },
      onSelect: function(e, term, item){
        that.searchCountry(that.titleCase(term), availableCountries, automCompleteCountry);
      }
    });

    this.btn.one('click', (event) => this.searchCountry(false, availableCountries, automCompleteCountry));

    $(document).on('keypress', (event) => this.keyPressHandler(event, availableCountries, automCompleteCountry));

  }

  keyPressHandler(event, availableCountries, automCompleteCountry) {
    if (event.keyCode == 13) {
      this.searchCountry(false, availableCountries, automCompleteCountry);
    }
  }

  searchCountry(country, availableCountries, automCompleteCountry) {
    if(!country) {
      country = this.titleCase(this.input.val());
    }
    if(!availableCountries.includes(country)) {
      this.alert.addClass('alert__text--active')
      this.alert.text('Country ' + country + ' not found! Please try again!');
      this.btn.one('click', (event) => this.searchCountry(availableCountries));
      return;
    }

    this.alert.removeClass('alert__text--active')
    automCompleteCountry.destroy();
    this.chartTotal.destroy();
    this.chartDetails.destroy();
    this.btn.off();
    $(document).off('keypress'); 
    let injectData = new InjectData(this.data, country);
    this.locationContainer.text(country);
    let countryFlags = new CountryFlags(country);
  }

  titleCase(str) {
   let splitStr = str.toLowerCase().split(' ');
   for (let i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
   }
   return splitStr.join(' ');
 }


}

export default CountrySelector;
