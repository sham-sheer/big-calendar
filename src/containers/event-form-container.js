import { postEventBegin } from '../actions/events';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AddEvent from '../components/addEvent';


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
  cssFocused: {},
});

const mapStateToProps = state => {
  return {
    events: state.events,
    providers: state.auth.providers,
  };
};

const mapDispatchToProps = dispatch => ({
  postEventBegin: (event, type) => dispatch(postEventBegin(event, type))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(AddEvent)));
