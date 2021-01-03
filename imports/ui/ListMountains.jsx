// Modified from my List Entries page for Journaler

import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { MountainCollection } from '../api/MountainCollection';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// This page displays a list of the user's mountains
class ListMountains extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
              <h2>My Mountains</h2>
              <a onClick={() => { FlowRouter.go('createNew'); }} className="btn btn-primary">New Mountain</a>
              <div className="container">
                  {
                      (this.props.mountains && this.props.mountains.length !== 0) ? 
                        this.props.mountains.map((a) => <MountainListItem entry={a} key={a._id} />)
                        :
                        <p>No mountains here!</p>
                  }
              </div>
            </div>
        );
    }
}

// Single item in the list of entries
class MountainListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    this is a mountain
                    {/* <h5 className="card-title">{this.props.entry.creationDate.toString()}</h5>
                    <p className="card-text">{this.props.entry.text}</p>
                    <a onClick={() => { FlowRouter.go('view', {_id: this.props.entry._id}); }} className="btn btn-primary">View</a>
                    <a onClick={() => { Meteor.call('entries.delete', this.props.entry._id); }} className="btn btn-danger">Delete</a> */}
                </div>
            </div>
        );
    }
}

// States what properties/arguments the ListPage_Malcolm object expects
ListMountains.propTypes = {
    entries: PropTypes.array,
    loading: PropTypes.bool
};

// Handles the asynchronous process of loading the entries belonging to the current user
const ListMountainsContainer = withTracker(() => {
    const handle = Meteor.subscribe('entries.getAllForUser');
    const loading = !handle.ready();
    const mountains = MountainCollection.find({ ownerId: Meteor.userId() }).fetch();

    return { mountains, loading };
})(ListMountains);

export default ListMountainsContainer;