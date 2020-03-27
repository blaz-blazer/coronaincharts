import $ from 'jquery';

class QuickStats {
  constructor(totalCases, totalDeaths, totalRecovered, totalActiveCases) {
    this.totalContainer = $('.js-total');
    this.activeContainer  = $('.js-active');
    this.recoveredContainer  = $('.js-recovered');
    this.deathsContainer  = $('.js-deaths');
    this.totalCases = totalCases;
    this.totalDeaths = totalDeaths;
    this.totalRecovered = totalRecovered;
    this.totalActiveCases = totalActiveCases;

    this.events();
  }

  events() {
    this.totalContainer.text(this.totalCases);
    this.activeContainer.text(this.totalActiveCases); 
    this.recoveredContainer.text(this.totalRecovered);
    this.deathsContainer.text(this.totalDeaths);
  }

  test() {
    // let tabNumber = $(event.currentTarget).data('tab');
    // let tabContentToShow = $('.js-rmp-tab-content--' + tabNumber );
    // // remove classes
    // $(this.tabs).removeClass('rmp-menu__tabs__tab--selected');
    // $(this.tabContents).removeClass('rmp-tab-content--visible');
    // // add classes
    // $(event.currentTarget).addClass('rmp-menu__tabs__tab--selected');
    // $(tabContentToShow).addClass('rmp-tab-content--visible');
    // Waypoint.refreshAll()
  }

}

export default QuickStats;
