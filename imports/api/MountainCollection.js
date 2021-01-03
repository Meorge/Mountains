import { Mongo } from 'meteor/mongo';

export const MountainCollection = new Mongo.Collection('mountains');

export const createDefaultMountain = () => {
    let mountain = {
        ownerId: '',
        title: '',
        startAmt: 0,
        endAmt: 100,
        current: 0,
        deadline: new Date(),
        entries: []
    };
    return mountain;
};

export const createDefaultEntry = () => {
    let entry = {
        date: new Date(),
        amount: 0,
        notes: ''
    };
    return entry;
};

if (Meteor.isServer) {
    // Create function to get mountains for the logged in user
    Meteor.publish('mountains.getAllForUser', function() {
        console.log("get all mountains for logged in user");
        if (!Meteor.user()) {
            console.log("No user is logged in!");
            throw Error("User is not logged in");
        }

        let allEntries = MountainCollection.find({ownerId: Meteor.userId()});
        return allEntries;
    });
}

Meteor.methods({
    // Creates a new entry and assigns it to the logged in user
    'mountains.createNew' () {
        console.log("create new entry!");

        // If no user is logged in, throw an error
        if (!Meteor.user()) {
            console.log("No user is logged in!");
            throw Error("User is not logged in");
        }
        let newEntry = createDefaultMountain();
        newEntry.ownerId = Meteor.userId();

        let id = MountainCollection.insert(newEntry);
        console.log(`nwe mountain created, id is ${id}`);
        return id;
    },

    // Checks if a given entry belongs to the logged in user
    'mountains.isOwner' (entryId) {
        console.log('see if user can access this entry');

        // If no user is logged in, throw an error
        if (!Meteor.user()) {
            console.log("No user is logged in!");
            return false;
        }
        
        // Locate the entry
        let entry = MountainCollection.findOne({_id: entryId});

        console.log(entry);

        // If no entry exists, the logged in user can't access it
        if (!entry) {
            console.log(`entry with ID ${entryId} wasn't found`);
            return false;
        }

        console.log(`Entry found: ${entry._id}, ${entry.title}`);

        // If the entry's owner is not the logged in user, they
        // can't access it
        if (entry.ownerId != Meteor.userId()) {
            console.log(`This entry belongs to ${entry.ownerId} but the logged in user is ${Meteor.userId()}`);
            return false;
        }

        // The entry exists and the logged in user is the owner,
        // so they can access it
        return true;
    },

    // Gets the contents of an entry
    'mountains.get' (entryId) {
        console.log('get text for entry');

        // If no user is logged in, throw an error
        if (!Meteor.user()) {
            console.log("No user is logged in!");
            throw Error("User is not logged in");
        }
        
        console.log(`find entry with id ${entryId}`);
        
        // Locate the entry
        let entry = MountainCollection.findOne({_id: entryId});

        console.log(entry);

        // If no entry exists, the logged in user can't access it
        if (!entry) {
            console.log(`entry with ID ${entryId} wasn't found`);
            throw Error("Unable to find entry with given ID");
        }

        console.log(`Entry found: ${entry._id}, ${entry.title}`);

        // If the entry's owner is not the logged in user, they
        // can't access it
        if (entry.ownerId != Meteor.userId()) {
            console.log(`This entry belongs to ${entry.ownerId} but the logged in user is ${Meteor.userId()}`);
            throw Error("Logged in user does not have permission to view this entry");
        }

        // The entry exists and the logged in user is the owner,
        // so they can access it
        return entry;
    },

    // Sets the contents of an entry
    'mountains.set' (entryId, newContents) {
        console.log('set text for entry');

        // If no user is logged in, throw an error
        if (!Meteor.user()) {
            console.log("No user is logged in!");
            throw Error("User is not logged in");
        }
        
        // Locate the entry
        let entry = MountainCollection.findOne({_id: entryId});

        // If no entry exists, the logged in user can't modify it
        if (!entry) {
            console.log(`entry with ID ${entryId} wasn't found`);
            throw Error("Unable to find entry with given ID");
        }

        console.log(`Entry found: ${entry._id}, ${entry.title}`);

        // Set entry contents
        return MountainCollection.update({_id: entryId}, {
            '$set': newContents
        });
    },

    // Delete an entry
    'mountains.delete' (entryId) {
        console.log('delete entry');

        // If no user is logged in, throw an error
        if (!Meteor.user()) {
            console.log("No user is logged in!");
            throw Error("User is not logged in");
        }
        
        // Locate the entry
        let entry = MountainCollection.findOne({_id: entryId});

        // If no entry exists, the logged in user can't modify it
        if (!entry) {
            console.log(`entry with ID ${entryId} wasn't found`);
            throw Error("Unable to find entry with given ID");
        }

        console.log(`Entry found: ${entry._id}, ${entry.title}`);

        // Delete the entry
        return MountainCollection.remove({_id: entryId});
    },
})



/*
TODO:
- Populate the "edit mountain" page with the info about the current mountain
- Default values
- List all of the mountains belonging to user

*/