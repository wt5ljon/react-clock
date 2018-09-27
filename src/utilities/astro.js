// Calculates and returns the Julian day number for any calendar
// date.  If t_zero is TRUE, the Julian day number is calculated for
// GMT midnight (00h) on the supplied date.  Otherwise, the Julian
// day number is calculated for the precise date and time supplied
// by argument. Calculations based on the method found on page 9
// of "Practical Astronomy with your Calculator or Spreadsheet" by
// Peter Duffett-Smith and Jonathon Zwart Fourth Edition.
export const calcJD = (now, t_zero = false ) => {
  const current = {
    year: now.get('year'),
    month: now.get('month') + 1,
    dayOfMonth: now.get('date'),
    hour: now.get('hour'),
    minute: now.get('minute'),
    second: now.get('second')
  };
  let A, B;
  let DD, JD;

  if (!t_zero)
    DD = current.dayOfMonth + ((current.hour + current.minute / 60.0 + current.second / 3600.0) / 24.0);
  else
    DD = current.dayOfMonth;

  if (current.month < 3) {
    current.year -= 1;
    current.month += 12;
  }

  A = Math.floor(current.year / 100);
  B = 2 - A + A / 4;
  JD = Math.floor(365.25 * current.year) + Math.floor(30.6001 * (current.month + 1.0)) + DD + 1720994.5 + B;
  return JD;
};

// Calculates and returns Greenwich Sidereal Time for any calendar
// date and time.  Calculations based on the method found on page 23
// of "Practical Astronomy with your Calculator or Spreadsheet" by
// Peter Duffett-Smith and Jonathon Zwart Fourth Edition.
export const calcGST = (now) => {	  
  const JD = calcJD(now, true);
  const S = JD - 2451545;
  const T = S/36525;

  let T0 = 6.697374558 + (2400.051336*T) + (0.000025862*T*T);
  T0 = T0 - (24*Math.floor(T0/24));

  const UT = now.get('hour') + now.get('minute')/60.0 + now.get('second')/3600.0;
  const A = UT*1.002737909;
  let GST = A + T0;
  GST = GST - (24*Math.floor(GST/24));
  return GST;
};
  

// Calculates and returns Local Sidereal Time for any calendar
// date and time.  Calculations based on the method found on page 27
// of "Practical Astronomy with your Calculator or Spreadsheet" by
// Peter Duffett-Smith and Jonathon Zwart Fourth Edition.
export const calcLST = (now, longitude) => {
  const GST = calcGST(now);
  let LST = GST + longitude/15;
  LST = LST - (24*Math.floor(LST/24));
  return LST;
};

export const parseTime = (num) => {
  let totalSeconds = Math.floor(num * 3600);
  const hour = Math.floor(num);
  totalSeconds -= hour * 3600;
  const minute = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minute * 60; 
  return ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + seconds).slice(-2);
};

export const parseDegree = (num, posHemi, negHemi) => {
  const absNum = Math.abs(num);
  const degree = Math.floor(absNum);
  let totalSeconds = absNum * 3600;
  totalSeconds -= degree * 3600;
  const minute = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds - (minute * 60));
  const hemisphere = Math.sign(num) === -1 ? negHemi : posHemi;
  let textDegree = degree > 99 ? ('0' + degree).slice(-3) : ('0' + degree).slice(-2);
  textDegree = degree < 10 ? ('0' + degree).slice(-1) : textDegree;
  
  return `${textDegree}\xB0 ${('0' + minute).slice(-2)}'  ${('0' + seconds).slice(-2)}" ${hemisphere}`;
};
