//declarations moved to declarations/posts.js

/**
 * Now we will define and attach the schema for this collection.
 * Orion will automatically create the corresponding form.
 */
PostsTrip.attachSchema(new SimpleSchema({
  itinerarys: orion.attribute('hasMany', {
    // the value inside the `itinerarys` key will be an array of comment IDs
    type: [String],
    label: 'Itinerarys for this Post',
    // optional is true because you can have a post without itinerarys
    optional: true
  }, {
    collection: Itinerarys,
    titleField: 'description',//body
    publicationName: 'randomStringPostsTrip',
    // publicationName: 'someRandomString',
  }),

  // We use `label` to put a custom label for this form field
  // Otherwise it would default to `Title`
  // 'optional: false' means that this field is required
  // If it's blank, the form won't submit and you'll get a red error message
  // 'type' is where you can set the expected data type for the 'title' key's value
  title: {
    type: String,
    optional: false,
    label: 'Trip Name'
  },
  // autoform determines other aspects for how the form is generated
  // In this case we're making this field hidden from view
  userId: {
    type: String,
    optional: true,
    autoform: {
      type: "hidden",
      label: false
    },
  },  
  overview: orion.attribute('summernote', {
    optional: true,
    label: 'overview'
  }),
  tripPrice: {
    type: String,
    optional: true,
    label: 'Trip Price'
  },
  tags: {
    type: [String],
    optional: true,
    autoform: {
      disabled: true,
      label: false
    },
  },

  itinerary: {
    type: [Object],
    optional: true,
  },  
    "itinerary.$.day": {
        type: String,
        optional: true,
        label: 'Day'
    },
    "itinerary.$.description": {
        type: String,
        optional: true,
        label: 'Short Description'
    },
    "itinerary.$.detailedDescription": orion.attribute('summernote', {
      optional: true,
      label: 'Detailed Description'
    }),

  media: {
    type: [Object],
    optional: true,
  },  
    "media.$.text": {
        type: String,
        optional: true,
        label: 'Text'
    },
    "media.$.image": {
        type: String,
        optional: true,
        label: 'Image'
    },
    "media.$.video": {
        type: String,
        optional: true,
        label: 'Video'
    },

  /*itinerary: {
    // type: [Itinerarys],
    type: [{  
        day: {
        type: String,
        optional: true,
        label: 'Itinerary Day:'
      },
        description: {
        type: String,
        optional: true,
        label: 'Description:'
      },
        location: {
        type: String,
        optional: true,
        label: 'Location:'
      },
    }],
    optional: true,
    autoform: {
      disabled: true,
      label: false
    },
  },*/

  //https://github.com/orionjs/orion/issues/149
  /*itinerary: {
    type: [Object],
    option: true
  }, {
    "itinerary.$.day": {type: String},
    "itinerary.$.description": {type: String},
  },*/

  submitted: {
    type: Date,
    optional: false,
  },
}));
