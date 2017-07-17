//declarations moved to declarations/posts.js

/**
 * Now we will define and attach the schema for this collection.
 * Orion will automatically create the corresponding form.
 */
Posts.attachSchema(new SimpleSchema({
  comments: orion.attribute('hasMany', {
    // the value inside the `comments` key will be an array of comment IDs
    type: [String],
    label: 'Comments for this Post',
    // optional is true because you can have a post without comments
    optional: true
  }, {
    collection: Comments,
    titleField: 'body',//body
    publicationName: 'someOtherRandomString',
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
    label: 'Post Title'
  },
  // regEx will validate this form field according to a RegEx for a URL
  url: {
    type: String,
    optional: true,
    label: 'URL',
    regEx: SimpleSchema.RegEx.Url
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
  author: {
    type: String,
    optional: false,
  },
  // 'type: Date' means that this field is expecting a data as an entry
  submitted: {
    type: Date,
    optional: false,
  },
  commentsCount: {
    type: Number,
    optional: false
  },
  // 'type: [String]' means this key's value is an array of strings'
  upvoters: {
    type: [String],
    optional: true,
    autoform: {
      disabled: true,
      label: false
    },
  },
  votes: {
    type: Number,
    optional: true
  },
}));
