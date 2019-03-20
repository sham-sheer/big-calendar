import moment from 'moment';

export const OUTLOOK = 'OUTLOOK';
export const GOOGLE = 'GOOGLE';

export const dropDownTime = (currentTime) => {
  const timeOptions = [];
  let hour = 0;
  let initialTime = 0;
  let minute;
  let value;
  if(currentTime !== '') {
    initialTime = parseInt(currentTime.substring(0, 2), 10) * 2;
    if(currentTime.substring(2) === "30") {
      initialTime = initialTime + 1;
    }
  }
  //currentTime algo needs to be tweaked for same time shown in start and end.
  for(let i = initialTime; i < 48; i++) {
    (i % 2 == 0) ? minute = '00' : minute = '30';
    hour = convertHour(Math.floor(i / 2));
    value = hour + minute;
    timeOptions.push({value: value, label: value})
  }
  return timeOptions;
}

const convertHour = (i) => {
  if(i < 10) {
    return '0' + i.toString() + ':';
  }
  return i.toString() + ':';
}

export const momentAdd = (day, time) => {
  debugger;
  const editedDay = moment(day)
                        .set('H', parseInt(time.substring(0, 2)))
                        .set('m' , parseInt(time.substring(3)));
  const formattedDay = moment(editedDay).format();
  return formattedDay;
}
