import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { FormControl } from 'react-bootstrap';
import moment from "moment";

const START_INDEX_OF_UTC_FORMAT = 17;
const START_INDEX_OF_HOUR = 11;
const END_INDEX_OF_HOUR = 13;
const TIME_OFFSET = 12;
const START_INDEX_OF_DATE = 0;
const END_INDEX_OF_DATE = 11;
const END_INDEX_OF_MINUTE = 16;

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      desc: '',
      startParsed: '',
      endParsed: '',
      start: '',
      end: ''
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
    this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  processStringForUTC = (dateInString) => {
    let dateInStringInUTC;
    if(dateInString.substring(START_INDEX_OF_UTC_FORMAT) === 'pm') {
        const hourInString = parseInt(dateInString.substring(START_INDEX_OF_HOUR, END_INDEX_OF_HOUR), 10);
        const hourInStringInUTC = hourInString + TIME_OFFSET;
        console.log(hourInStringInUTC.toString());
        dateInStringInUTC = dateInString.substring(START_INDEX_OF_DATE, END_INDEX_OF_DATE)
                                      + hourInStringInUTC.toString()
                                      + dateInString.substring(END_INDEX_OF_HOUR, END_INDEX_OF_MINUTE);
    }
    else {
        dateInStringInUTC = dateInString.substring(START_INDEX_OF_DATE, END_INDEX_OF_MINUTE);
    }
    return dateInStringInUTC;
  }

  componentWillMount() {
    const startDateParsed = moment(this.props.match.params.start).format("YYYY-MM-DDThh:mm a")
    const endDateParsed = moment(this.props.match.params.end).format("YYYY-MM-DDThh:mm a");
    const startDateParsedInUTC = this.processStringForUTC(startDateParsed);
    const endDateParsedInUTC = this.processStringForUTC(endDateParsed);
    console.log(moment(startDateParsedInUTC).format() + " " + endDateParsedInUTC);
    this.setState({
      startParsed: startDateParsedInUTC,
      endParsed: endDateParsedInUTC,
      start: this.props.match.params.start,
      end: this.props.match.params.end
    })
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescChange(e) {
    this.setState({ desc: e.target.value });
  }

  handleChangeStartTime(e) {
    this.setState({ startParsed: e.target.value });
  }

  handleChangeEndTime(e) {
    this.setState({ endParsed: e.target.value });
  }

  handleSubmit = async (e) => {
    // need to write validation method
    e.preventDefault();
    this.props.postGoogleEvent({
      'summary': this.state.title,
      'start': {
        'dateTime' : moment(this.state.startParsed).format(),
        'timezone' : 'America/Los_Angeles'
      },
      'end': {
        'dateTime' : moment(this.state.endParsed).format(),
        'timezone' : 'America/Los_Angeles'
      }

    });
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="form-event-container">
      <form className="container" onSubmit={this.handleSubmit} noValidate>

        {/* Title Form*/}
        <FormControl
          type="text"
          value={this.state.value}
          placeholder="Enter title of Event"
          onChange={this.handleTitleChange}
        />

        {/* Text Area */}
        <FormControl
          componentClass="textarea"
          placeholder="Description"
          onChange={this.handleDescChange}
        />

        {/* Start Time and Date */}
        <TextField
          id="datetime-local"
          label="Start"
          type="datetime-local"
          defaultValue={this.state.startParsed}
          className="textField"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={this.handleChangeStartTime}
        />

        {/* End Time and Date */}
        <TextField
          id="datetime-local"
          label="End"
          type="datetime-local"
          defaultValue={this.state.endParsed}
          className="textField"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={this.handleChangeEndTime}
        />

        <input type="submit" value="Submit" />
      </form>
      </div>


    )
  }
}
