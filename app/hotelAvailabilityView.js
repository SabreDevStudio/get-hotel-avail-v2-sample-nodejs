class HotelAvailabilityView {
  constructor(params) {
    this.hotelSearchModel = params.hotelSearchModel;
    this.hotelSearchCritera = params.hotelSearchCritera;
    this.displayOptions = params.displayOptions;
  }

  static GetContentSourceById(id) {
    const sources = {
      100: 'Sabre GDS',
      110: 'Expedia Partner Solutions',
      112: 'Bedsonline',
      113: 'Booking.com',
    };

    return sources[id];
  }

  renderSearchCriteria() {
    const location = this.hotelSearchCritera.location;

    console.log(`\t\t     >> Near ${location.airportCode} <<`);
  }

  renderNumberOfProperties() {
    const hotels = this.hotelSearchModel.results.HotelAvailInfo;

    console.log(`\t\t   ${hotels.length} properties found\n`);
  }

  static renderSeparator() {
    console.log('\t\t ------------------------');
  }

  renderLocation(hotelEntry) {
    const leftColWidth = 35;
    const hotel = hotelEntry.HotelInfo;
    const location = hotel.LocationInfo;
    const contact = location.Contact || {};
    const phone = contact.Phone || 'N/A';

    console.log(`  ${hotel.HotelName.padEnd(leftColWidth)} ${hotel.SabreRating} ⭐️`);
    console.log(`  ${location.Address.AddressLine1.padEnd(leftColWidth)} ${phone}`);

    const cityName = location.Address.CityName.value || '';
    const stateProv = location.Address.StateProv || {};
    let stateCode = '';
    if (stateProv.StateCode) {
      stateCode = `, ${stateProv.StateCode}`;
    }
    const postalCode = location.Address.PostalCode || '';
    let countryName = '';
    if (!stateProv.StateCode && location.Address.CountryName.value) {
      countryName = location.Address.CountryName.value;
    }
    const cityStateZip = `${cityName}${stateCode} ${postalCode} ${countryName}`;

    console.log(`  ${cityStateZip.padEnd(leftColWidth, ' ')} ${hotel.Distance} ${hotel.Direction}`);

    if (this.displayOptions.showHotelCode) {
      console.log(`  HotelCode: [${hotel.HotelCode}]`);
    }
    HotelAvailabilityView.renderSeparator();
  }

  static renderCosts(rate) {
    const amountAfterTax = rate.AmountAfterTax || 0;
    const amountBeforeTax = rate.AmountBeforeTax || 0;
    const average = rate.AverageNightlyRate || 0;

    const totalLabel = HotelAvailabilityView.formatCurrency(rate.CurrencyCode, amountAfterTax);
    const beforeLabel = HotelAvailabilityView.formatCurrency(rate.CurrencyCode, amountBeforeTax);
    const averageLabel = HotelAvailabilityView.formatCurrency(rate.CurrencyCode, average);

    console.log(`    AfterTax: ${totalLabel} | BeforeTax: ${beforeLabel} (Average Nightly: ${averageLabel})`);
  }

  static renderCommission(rate) {
    const commission = rate.Commission || {};
    const commissionAmount = commission.Amount || 0;
    const commissionCurrencyCode = commission.CurrencyCode || 'USD';
    const comissionLabel = this.formatCurrency(commissionCurrencyCode, commissionAmount);

    console.log(`    Commission: ${comissionLabel}`);
  }

  static renderRateSource(rateSource) {
    console.log(`    Source: ${HotelAvailabilityView.GetContentSourceById(rateSource)} ℹ️`);
  }

  static formatCurrency(code, amount) {
    const currencyFormat = {
      style: 'currency',
      currency: code,
    };

    return amount.toLocaleString('en', currencyFormat);
  }

  renderRate(hotelEntry) {
    hotelEntry.HotelRateInfo.RateInfos.RateInfo.forEach((rate) => {
      HotelAvailabilityView.renderCosts(rate);
      HotelAvailabilityView.renderCommission(rate);
      HotelAvailabilityView.renderRateSource(rate.RateSource);
      if (this.displayOptions.showRateKey) {
        HotelAvailabilityView.renderRateKey(rate);
      }
      HotelAvailabilityView.renderSeparator();
    });
  }

  static renderRateKey(rate) {
    console.log(`    RateKey: [${rate.RateKey}]`);
  }

  renderHotelList() {
    this.hotelSearchModel.results.HotelAvailInfo.forEach((hotelEntry) => {
      this.renderLocation(hotelEntry);
      this.renderRate(hotelEntry);
      console.log('\n');
    });
  }

  checkForError() {
    const appResults = this.hotelSearchModel.results.ApplicationResults || {};
    const isError = appResults.Error !== undefined;

    return isError;
  }

  renderError() {
    const appResults = this.hotelSearchModel.results.ApplicationResults;

    appResults.Error.forEach((error) => {
      error.SystemSpecificResults.forEach((result) => {
        result.Message.forEach((message) => {
          console.log(`${message.code}...${message.value}`);
        });
      });
    });
    console.log('\n');
  }

  render() {
    if (this.checkForError()) {
      this.renderError();
    } else {
      this.renderSearchCriteria();
      this.renderNumberOfProperties();
      this.renderHotelList();
    }
  }
}

module.exports = HotelAvailabilityView;
