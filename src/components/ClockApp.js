import React from 'react';
import axios from 'axios';
import moment from 'moment';
import pkg from '../../package.json';
import Footer from './Footer';
import Header from './Header';
import Location from './Location';
import ShowLocation from './ShowLocation';
import ShowTime from './ShowTime';

const apiKey = process.env.GEOCODE_API_KEY;
console.log(apiKey);

export default class SiderealApp extends React.Component {
  state = {
    location: {
      address: undefined,
      latitude: undefined,
      longitude: undefined,
      timezone: undefined,
      rawOffset: undefined,
      dstOffset: undefined
    },
    error: undefined
  };

  tempLocation = {
    address: undefined,
    latitude: undefined,
    longitutde: undefined
  }

  handleGetLocation = (location) => {
    if (location) {
      const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`;
      axios.get(geocodeURL)
        .then((response) => {
          if (response.data.status === 'ZERO_RESULTS') {
            throw ('Unable to find that address');
          } else {
            this.tempLocation.address = response.data.results[0].formatted_address;
            this.tempLocation.latitude = response.data.results[0].geometry.location.lat;
            this.tempLocation.longitude = response.data.results[0].geometry.location.lng;
            const timestamp = moment().unix().valueOf();
            const timezoneURL = `https://maps.googleapis.com/maps/api/timezone/json?location=${this.tempLocation.latitude},${this.tempLocation.longitude}&timestamp=${timestamp}&key=${apiKey}`;
            return axios.get(timezoneURL);
          }
        }).then((response) => {
          // only update state if both API requests are successful
          this.setState(() => {
            return {
              location: {
                address: this.tempLocation.address,
                latitude: this.tempLocation.latitude,
                longitude: this.tempLocation.longitude,
                timezone: response.data.timeZoneName,
                rawOffset: response.data.rawOffset,
                dstOffset: response.data.dstOffset  
              },
              error: undefined
            };
          });
        }).catch((e) => {
          let error;
          if (e.message === 'Network Error') {
            error = 'Unable to connect to API servers';
          } else if (e === 'Unable to find that address') {
            error = e;
          } else {
            error = 'Unknown error';
          }
          this.setState((prevState) => {
            return {
              location: prevState.location,
              error
            };
          });
        })
    } else {
      this.setState((prevState) => {
        return {
          location: prevState.location,
          error: "Must provide a zipcode, city, or address"
        };
      });
    }
  }

  handleInputChange = () => {
    this.setState((prevState) => {
      return {
        location: prevState.location,
        error: undefined
      };
    });
  };

  componentWillMount() {
    const json = localStorage.getItem('location');
    const data = JSON.parse(json);
    
    if (data) {
      this.setState(() => {
        return ({
          location: data.location 
        });
      });
    }
  }

  componentDidUpdate() {
    const json = JSON.stringify({
      location: this.state.location 
    });
    localStorage.setItem('location', json);
  }

  render() {
    return (
      <div>
        <Header subtitle="Displays current local and universal time, Julian date and sidereal time for any location in the world"/ >
        <div className="container">
          <Location
            error={this.state.error}
            handleGetLocation={this.handleGetLocation}
            onInputChange={this.handleInputChange}
            buttonText={this.state.location.address ? "Change" : "Choose"}
          />
          <ShowLocation location={this.state.location} />
          <ShowTime 
            location={this.state.location}
          />
          <Footer year={moment().format('YYYY')} version={pkg.version} /> 
        </div>     
      </div>
    );
  };
}