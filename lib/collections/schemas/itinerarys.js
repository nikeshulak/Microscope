//declarations moved to declarations/comments.js

/**
 * Now we will define and attach the schema for that collection.
 * Orion will automatically create the corresponding form.
 */
Itinerarys.attachSchema(new SimpleSchema({
  /*postTripId: {
    type: String,
    optional: false,
    label: 'Post ID'
  },*/
  // here is where we define `a comment has one postTrip`
  // Each document in Comment has a postTripId
  postTripId: orion.attribute('hasOne', {
    type: String,
    // the label is the text that will show up on the Update form's label
    label: 'PostsTrip',//PostsTrip
    // optional is false because you shouldn't have a comment without a postTrip
    // associated with it
    optional: false
  }, {
    // specify the collection you're making the relationship with
    collection: PostsTrip,
    // the key whose value you want to show for each Post document on the Update form
    titleField: 'title',
    // dunno
    publicationName: 'someRandomStringItinerary',
  }),
  /*userId: {
    type: String,
    optional: false,
    label: 'User ID',
  },*/
  // here is where we define `a comment has one user (author)`
  // Each document in Comment has a userId
  userId: orion.attribute('hasOne', {
    type: String,
    label: 'Author',
    optional: false
  }, {
    collection: Meteor.users,
    // the key whose value you want to show on the Update form
    titleField: 'profile.name',
    publicationName: 'anotherRandomStringItinerary',
  }),
  /*author: {
    type: String,
    optional: false,
    autoform: {
      type: 'hidden',
      label: false
    }
  },*/
  submitted: {
    type: Date,
    optional: false,
  },
  /*body: {
    type: String,
    optional: false,
  },*/
  description: orion.attribute('summernote', {
    label: 'Detail Description'
  }),
  /*image: orion.attribute('image', {
    optional: true,
    label: 'Comment Image'
  }),*/

}));