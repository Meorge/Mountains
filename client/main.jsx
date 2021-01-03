import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { App } from '/imports/ui/App';
import { Container } from '/imports/ui/Container';
import { LoginPage } from '/imports/ui/Login';
import { EditPage } from '/imports/ui/EditPage';
import ListMountainsContainer from '../imports/ui/ListMountains';


FlowRouter.route('/', {
  name: 'landing',
  action() {
    mount(Container, { main: <App />});
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    mount(Container, { main: <LoginPage />});
  }
});

FlowRouter.route('/list', {
  name: 'listMountains',
  action() {
    mount(Container, { main: <ListMountainsContainer />});
  }
});

FlowRouter.route('/new', {
  name: 'createNew',
  action() {
    if (Meteor.userId()) {
      console.log("Attempt to create a new mountain");
      Meteor.call('mountains.createNew', (err, res) => {
        console.log("something happened");
        console.log(err, res);
        if (res) {
          FlowRouter.go('edit', {_id: res});
        }
      });
    }
  }
});

FlowRouter.route('/edit/:_id', {
  name: 'edit',
  action(params) {
    console.log(`Trying to go to edit page, user ID is ${Meteor.userId()}`);
    Meteor.call('mountains.isOwner', params._id, (err, res) => {
      console.log(err, res);
      if (err || res == false) {
        FlowRouter.go('error');
      } else {
        mount(Container, { main: <EditPage id={params._id} />});
      }
    }); 
  }
});