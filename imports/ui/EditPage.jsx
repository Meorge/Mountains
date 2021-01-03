// modified from Journaler
import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// This page allows the user to edit the contents of a single Mountain
export class EditPage extends Component {
    constructor(props) {
        super(props);

        let id = props.id;

        // Get the contents of the entry from the ID
        Meteor.call('mountains.get', id, (err, res) => {
            console.log(`mountains.get - err = ${err}, res = ${res}`);
            if (res) {
                this.setState({mountain: res});
            } else {
                console.log(err);
            }
        });

        // Initialize entry to null
        this.state = { entry: null };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitAndView = this.handleSubmitAndView.bind(this);

        this.handleContentsChanged = this.handleContentsChanged.bind(this);
        this.getSuccessIcon = this.getSuccessIcon.bind(this);
        this.getSaveSuccessBox = this.getSaveSuccessBox.bind(this);
    }

    // Called when the user attempts to save the entry
    handleSubmit() {
        // Request server to update contents of entry
        Meteor.call('mountains.set', this.props.id, this.state.mountain, (err, res) => {
            console.log(`called entries.setText; err = ${err}, res = ${res}`);
            if (res) {
                // Success editing, send us to the edit page
                console.log("Successfully saved!");
                this.setState({saved: true});
                console.log(res);
            } else {
                // Failed I guess, send us to the bad page
                console.log("Failed to save");
                this.setState({saved: false, errorMsg: err});
                console.log(err);
            }
        });
    }

    // Called when the user attempts to save the entry and exit out of edit mode
    // (i.e. they click "Save & View")
    handleSubmitAndView() {
        this.handleSubmit();
        FlowRouter.go('view', {_id: this.props.id});
    }

    // Called whenever the text box's contents change, so that we keep track of its contents
    handleContentsChanged(event) {
        // this.setState({entryContents: event.target.value});
        console.log("contents changed but gotta implement");
    }

    // Returns an icon indicating success
    getSuccessIcon() {
        return (
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
        );
    }

    // Returns an icon indicating failure
    getErrorIcon() {
        return (
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-exclamation-diamond-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
        );
    }

    // Returns a small box that says that saving was successful or not successful
    getSaveSuccessBox() {
        if (typeof this.state.saved !== 'undefined') {
            if (this.state.saved)
                return (
                    <div className="alert alert-success" role="alert">
                        {this.getSuccessIcon()} <strong>Success</strong> - Mountain data saved
                    </div>
                );
            else if (!this.state.saved)
                return (
                    <div className="alert alert-error" role="alert">
                        {this.getErrorIcon()} <strong>Error</strong> - {this.state.errorMsg}
                    </div>
                );
        } else {
            return (<div></div>);
        }
    }

    render() {
        return (
            <div>
              <h2>Edit Mountain</h2>
              {this.getSaveSuccessBox()}
              <div className="container">
                  <div className="form-group">
                      <label htmlFor="mtnName">Mountain name</label>
                      <input className="form-control form-control-lg" placeholder="Write a novel"></input>
                  </div>

                  <div className="row">
                      <div className="col">
                        <div className="form-group">
                            <label htmlFor="startVal">Start value</label>
                            <input id="startVal" className="form-control" type="number" placeholder="0"></input>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-group">
                            <label htmlFor="endVal">End value</label>
                            <input id="endVal" className="form-control" type="number" placeholder="100"></input>
                        </div>                          
                      </div>
                  </div>

                  <div className="form-group">
                        <label htmlFor="checkpoints">Number of checkpoints</label>
                        <input id="checkpoints" className="form-control" type="number" placeholder="3"></input>
                  </div>
                  <div className="form-group">
                      <label htmlFor="deadline">Deadline</label>
                      <input id="deadline" className="form-control" type="date" placeholder="yyyy-mm-dd"></input>
                  </div>

                  {/* <textarea value={this.state.entryContents ? this.state.entryContents : ''} onChange={this.handleContentsChanged} className="form-control" placeholder="What's going on?"/> */}
                  <button type="submit" className="btn btn-outline-primary" onClick={this.handleSubmit}>Save</button>
                  <button type="submit" className="btn btn-primary" onClick={this.handleSubmitAndView}>Save &amp; View</button> 
              </div>
            </div>
        );
    }
}
