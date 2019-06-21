const config = require('./config');
const hotelSearchCritera = require('./searchCriteria');

const AuthenticationModel = require('./authenticationModel');
const HotelAvailModel = require('./hotelAvailabilityModel');
const HotelAvailView = require('./hotelAvailabilityView');
const GetCommandLineOptions = require('./getCommandLineOptions');

let authentication;


function SearchForHotels() {
  const hotelSearchModel = new HotelAvailModel({
    searchCriteria: hotelSearchCritera,
    apiAccessToken: authentication.token,
    appId: config.appId,
    apiEndPoint: config.apiEndPoint,
  });

  hotelSearchModel.read()
    .then(() => {
      const displayOptions = GetCommandLineOptions();
      const hotelSearchView = new HotelAvailView({
        hotelSearchModel,
        hotelSearchCritera,
        displayOptions,
      });
      hotelSearchView.render();
    })
    .catch(() => {
      console.log('\n');
    });
}

console.log('\n  Running the Get Hotel Availability V2 demo\n\n');

authentication = new AuthenticationModel({
  apiEndPoint: config.apiEndPoint,
  userSecret: config.userSecret,
});

authentication.createToken()
  .then(() => {
    SearchForHotels();
  })
  .catch(() => {
    console.log('\n');
  });
