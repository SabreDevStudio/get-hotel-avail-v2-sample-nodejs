function GetCommandLineOptions() {
  const displayRateKeysParam = '--rates';
  const displayHotelCode = '--codes';
  const options = {};

  if (process.argv.length === 3) {
    const parameter = process.argv[2].toLowerCase();

    options.showRateKey = (parameter === displayRateKeysParam);
    options.showHotelCode = (parameter === displayHotelCode);
  }

  return options;
}

module.exports = GetCommandLineOptions;
