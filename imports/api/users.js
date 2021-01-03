import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';


Meteor.methods({
    // Attempts to create a new account with the given
    // username and password
    'user.register' (userData) {
        Accounts.createUser({
            username: userData.username,
            password: userData.password
        });
    }
});
