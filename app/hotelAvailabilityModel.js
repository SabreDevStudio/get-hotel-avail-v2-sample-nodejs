const axios = require('axios');
const fileHelper = require('./fileHelper');

function ComputeRequestPayload(searchCriteria) {
  const requestPayload = {
    GetHotelAvailRQ: {
      SearchCriteria: {
        OffSet: 1,
        SortBy: 'TotalRate',
        SortOrder: 'DESC',
        PageSize: 20,
        TierLabels: false,
        GeoSearch: {
          GeoRef: {
            Radius: 50,
            UOM: 'MI',
            RefPoint: {
              Value: searchCriteria.location.airportCode,
              ValueContext: 'CODE',
              RefPointType: '6',
            },
          },
        },
        RateInfoRef: {
          ConvertedRateInfoOnly: false,
          CurrencyCode: 'USD',
          BestOnly: '2',
          PrepaidQualifier: 'IncludePrepaid',
          StayDateRange: {
            StartDate: searchCriteria.date.checkIn,
            EndDate: searchCriteria.date.checkOut,
          },
          Rooms: {
            Room: [
              {
                Index: 1,
                Adults: 1,
                Children: 0,
              },
            ],
          },
          InfoSource: '100,110,112,113',
        },
        HotelPref: {
          SabreRating: {
            Min: '3',
            Max: '5',
          },
        },
        ImageRef: {
          Type: 'MEDIUM',
          LanguageCode: 'EN',
        },
      },
    },
  };

  return JSON.stringify(requestPayload);
}

class HotelAvailabilityModel {
  constructor(params) {
    this.searchCriteria = params.searchCriteria;
    this.apiAccessToken = params.apiAccessToken;
    this.appId = params.appId;
    this.apiEndPoint = params.apiEndPoint;
  }


  get results() {
    let rc = this.searchResponse.GetHotelAvailRS.HotelAvailInfos;

    if (!rc) {
      rc = this.searchResponse.GetHotelAvailRS;
    }

    return rc;
  }

  async read() {
    try {
      const response = await axios({
        method: 'post',
        url: `${this.apiEndPoint}/v2.1.0/get/hotelavail`,
        data: ComputeRequestPayload(this.searchCriteria),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${this.apiAccessToken}`,
          'Application-ID': this.appId,
        },
      });

      this.searchResponse = response.data;
      fileHelper.writeData(JSON.stringify(this.searchResponse), './cachedResponse.json');
    } catch (error) {
      console.log('\nUnexpected error calling hotel get availability.');
      console.log(`[${error.response.status}] ... [${error.response.statusText}]`);
      console.log(`[${error.response.data.errorCode}] ... [${error.response.data.message}]`);
      fileHelper.writeData(JSON.stringify(error.response.data), './cachedResponse.json');
    }
  }
}

module.exports = HotelAvailabilityModel;
