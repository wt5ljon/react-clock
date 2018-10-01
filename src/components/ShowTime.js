import React from 'react';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import { calcJD, calcLST, parseTime } from './../utilities/astro';
import ShowDials from './ShowDials';

export default class ShowTime extends React.Component {
  state = {
    address: undefined,
    date: undefined,
    time: moment().utc(),
    sun: {
      rise: undefined,
      set: undefined,
      noon: undefined
    },
    error: undefined,
  };

  updateSunData = () => {
    console.log('Sunrise/Sunset API Call');
    const { location } = this.props;
    const sunURL = `https://api.sunrise-sunset.org/json?lat=${location.latitude}&lng=${location.longitude}&formatted=0`;
    axios.get(sunURL)
      .then((response) => {
        if (response.data.status === 'OK') {
          this.setState(() => {
            return {
              address: location.address,
              date: moment(),
              sun: {
                rise: moment.utc(response.data.results.sunrise).add(location.rawOffset, 's').add(location.dstOffset, 's'),
                set: moment.utc(response.data.results.sunset).add(location.rawOffset, 's').add(location.dstOffset, 's'),
                noon: moment.utc(response.data.results.solar_noon).add(location.rawOffset, 's').add(location.dstOffset, 's'),
              },
              error: undefined
            };
          });
        } else {
          this.setState(() => {
            return {
              error: `Sunrise/Sunset API Error: ${response.data.status}`
            }
          });
        }
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
            sun: {
              rise: undefined,
              noon: undefined,
              set: undefined,
            },
            error
          };
        });
      });
  };

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.tick();
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timerID);
  };

  tick() {
    const { location } = this.props;
    const { address, date } = this.state;
    if (location.address !== address || moment().isAfter(date, 'day')) {
      this.updateSunData();
    }
    this.setState(() => {
      return {
        time: moment().utc(),
      }
    })
  };

  render() {
    const { location } = this.props;
    const { time, sun } = this.state;

    // convert nowLocal from UTC to local time using time zone offset and dst offset
    let local, lst;
    if (location.address) {
      local = moment(time);
      local.add(location.rawOffset, 's').add(location.dstOffset, 's');
      lst = parseTime(calcLST(time, location.longitude));
    } else {
      local = undefined;
      lst = undefined;
    }

    return (
      <div>
        <div className="block">
          <ShowDials 
            local={local} 
            gmt={time}
            lstHour={lst && lst.split(':')[0]}
            lstMinute={lst && lst.split(':')[1]}
            JD={numeral(calcJD(time)).format('0,0.0000')}
            sun={sun}
        />
        </div>
      </div>
    );
  };
}