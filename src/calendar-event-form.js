import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FormControl } from 'react-bootstrap';
import './calendar-event-form.css';
import { withRouter } from 'react-router-dom';
import purple from '@material-ui/core/colors/purple';
import moment from "moment";

export const START_INDEX_OF_UTC_FORMAT = 17;
export const START_INDEX_OF_HOUR = 11;
export const END_INDEX_OF_HOUR = 13;
export const TIME_OFFSET = 12;
export const START_INDEX_OF_DATE = 0;
export const END_INDEX_OF_DATE = 11;
export const START_INDEX_OF_MINUTE = 14;
export const END_INDEX_OF_MINUTE = 16;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
});

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      desc: '',
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
    console.log(startDateParsedInUTC + " " + endDateParsedInUTC);
    this.setState({
      start: startDateParsedInUTC,
      end: endDateParsedInUTC
    })
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleDescChange(e) {
    this.setState({ desc: e.target.value });
  }

  handleChangeStartTime(e) {
    this.setState({ start: e.target.value });
  }

  handleChangeEndTime(e) {
    this.setState({ end: e.target.value });
  }

  handleSubmit(e) {
    // need to write validation method
    e.preventDefault();
    this.props.updateEvents(this.state);
    this.props.history.push('/');
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="form-event-container">
      <form className={classes.container} onSubmit={this.handleSubmit} noValidate>

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
          defaultValue={this.state.start}
          className={classes.textField}
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
          defaultValue={this.state.end}
          className={classes.textField}
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

const CalendarEventForm = withStyles(styles)(Form)

export default withRouter(CalendarEventForm);
