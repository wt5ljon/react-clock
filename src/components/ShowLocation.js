import React from 'react';
import { parseDegree } from '../utilities/astro';

const ShowLocation = (props) => {
  // console.log('Latitude', props.location.latitude);
  // console.log('Longitude', props.location.longitude);
  return (
    <div className="block">
      <div className="block__details">
        {props.location.address ? <h3 className="location__header">{props.location.address}</h3> : <h3 className="location__header">No Location Selected</h3>}
        <span className="row__data">
          <h3>Latitude</h3>
          {props.location.latitude && <h3>{parseDegree(props.location.latitude, 'N', 'S')}</h3>}
        </span>
        <span className="row__data">
          <h3>Longitude</h3>
          {props.location.longitude && <h3>{parseDegree(props.location.longitude, 'E', 'W')}</h3>}       
        </span>
        <span className="row__data row__data--last">
            <h3>Time Zone</h3>
            {props.location.timezone && <h3>{props.location.timezone}</h3>}
        </span>
        <div className="googleContainer">
          <img
            className="googleImage"
            src="/images/powered_by_google_on_white.png"
            width="144px"
            height="18px"
          />        
        </div>
      </div>    
    </div>
  );
};

export default ShowLocation;

// {props.location.error && <h3>Error: {props.location.error}</h3>}