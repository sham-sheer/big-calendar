import React from 'react';

export default const titleBox = ({ end }) => {
  return(
    <div>
      <input type="text" class="datepicker" defaultDate={end}>
      <input type="text" class="timepicker" defaultTime='now'>
    </div>
  )
  )
}
