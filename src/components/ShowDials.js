import React from 'react';

export default class ShowDial extends React.Component {
  render() {
    const { local, gmt, lstHour, lstMinute, JD, sun } = this.props;
    const localTimeRotation = (local.hour() * 15.0) + (local.minute() * 0.25);
    const gmtRotation = (gmt.hour() * 15.0) + (gmt.minute() * 0.25);
    const lstRotation = (lstHour * 15.0) + (lstMinute * 0.25);
    const noonRotation = sun.noon ? (sun.noon.hour() * 15.0) + (sun.noon.minute() * 0.25) : 0;
    const riseRotation = sun.rise ? (sun.rise.hour() * 15.0) + (sun.rise.minute() * 0.25) : 0;
    const setRotation = sun.set ? (sun.set.hour() * 15.0) + (sun.set.minute() * 0.25) : 0;

    return (
      <div>
        <div className="dials-container">
          <div>
            <img 
              className="dial" 
              src="/images/clockface_5.png" 
              width="650px" 
              height="650px" 
            />
            <img 
              style={{ transform: `rotate(${localTimeRotation}deg)` }} 
              className="pointer" 
              src="/images/redpointer.png" 
              width="2px" 
              height="318px" 
            />
            <img
              style={{ transform: `rotate(${gmtRotation}deg)` }}
              className="pointer"
              src="/images/bluepointer.png"
              width="2px"
              height="318px"
            />
            <img
              style={{ transform: `rotate(${lstRotation}deg)` }}
              className="pointer"
              src="/images/greenpointer.png"
              width="2px"
              height="318px"
            />
            <img
              style={{ transform: `rotate(${noonRotation}deg)` }}
              className="pointer"
              src="/images/brownpointer.png"
              width="2px"
              height="318px"
            />
            <img
              style={{ transform: `rotate(${setRotation}deg)` }}
              className="pointer"
              src="/images/brownpointer.png"
              width="2px"
              height="318px"
            />
            <img
              style={{ transform: `rotate(${riseRotation}deg)` }}
              className="pointer"
              src="/images/brownpointer.png"
              width="2px"
              height="318px"
            />
            <span id="circle"></span>
            <span className="date">
              <div className="date__data">
                {local.format('dddd, MMMM Do YYYY')}
              </div>
              <div className="date__data">
                JD: {JD}
              </div>
            </span>
            <span className="info">
              <span className="info__data">
                <span className="textred">Local Time: {('0' + local.hour()).slice(-2)}:{('0' + local.minute()).slice(-2)}</span>
                <span className="textblue">GMT: {('0' + gmt.hour()).slice(-2)}:{('0' + gmt.minute()).slice(-2)}</span>
              </span>
              <span className="info__data">
                <span className="textorange">Solar Noon: {sun.noon ? sun.noon.format('HH:mm') : '--:--'}</span>
                <span className="textgreen">LST: {('0' + lstHour).slice(-2)}:{('0' + lstMinute).slice(-2)}</span>
              </span>
              <span className="info__data">
                <span className="textorange">Sunrise: {sun.rise ? sun.rise.format('HH:mm') : '--:--'}</span>
                <span className="textorange">Sunset: {sun.set ? sun.set.format('HH:mm') : '--:--'}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  };
  // <img style={{ transform: `rotate(${lstTimeRotation}deg)` }} className="bottomdial" src="/images/clockface_2.png" width="650px" height="650px" />
  // <span className="toolLabel toolLabel-bottom">
  //   Local Date: {local.format("dddd, MMM Do YYYY")}
  // </span>
}
