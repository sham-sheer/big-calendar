import React, { Component } from 'react';
import getDb from '../db';

export default class EditEvent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      summary: '',
      description: '',
      start: '',
      end: '',
      colorId: '',
      visibility: '',
    };
  }

  componentDidMount() {
   this.retrieveEvent(this.props.match.params.id);
  }

  retrieveEvent = async (id) => {
    const db = await getDb();
    const dbEvent = await db.events.find().where("id").eq(id).exec();
    const dbEventJSON = dbEvent[0].toJSON();
    this.setState({
      summary: dbEventJSON.summary,
      description: dbEventJSON.description,
    })
  }

  render() {
    return (
      <div>
       <div>{this.state.summary}</div>
       <div>{this.state.description}</div>
      </div>
    )
  }
}
