// PostsTrip = new Mongo.Collection('postsTrip');

PostsTrip = new orion.collection('postsTrip', {
  singularName: 'postTrip', // The name of one of these items
  pluralName: 'postsTrip', // The name of more than one of these items
  link: {
    // *
    //  * The text that you want to show in the sidebar.
    //  * The default value is the name of the collection, so
    //  * in this case it is not necessary.

    title: 'Trip' 
  },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    // here we set which data columns we want to appear on the data table
    // in the CMS panel
    columns: [
      { 
        data: "title", 
        title: "Trip Name" 
      },{ 
        data: "tripPrice", 
        title: "Trip Price" 
      },{ 
        data: "submitted", 
        title: "Submitted" 
      },
    ]
  }
});

PostsTrip.allow({
  update: function(userId, postTrip) { return ownsDocument(userId, postTrip); },
  remove: function(userId, postTrip) { return ownsDocument(userId, postTrip); }
});

/*PostsTrip.deny({
  update: function(userId, postTrip, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});*/

PostsTrip.deny({
  update: function(userId, postTrip, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePostTrip = function (postTrip) {
  var errors = {};

  if (!postTrip.title)
    errors.title = "Please fill in a headline";
  
  /*if (!postTrip.url)
    errors.url =  "Please fill in a URL";*/

  return errors;
}

Meteor.methods({
  postTripInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      // url: String
    });
    
    var errors = validatePost(postAttributes);
    if (errors.title)// || errors.url
      throw new Meteor.Error('invalid-postTrip', "You must set a title for your postTrip");
    
    /*var postWithSameLink = PostsTrip.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }*/
    
    var user = Meteor.user();
    var postTrip = _.extend(postAttributes, {
      userId: user._id,
      tags: [],   
      submitted: new Date(),
      /*author: user.username, 
      commentsCount: 0,
      votes: 0*/
    });
    
    var postTripId = PostsTrip.insert(postTrip);
    
    return {
      _id: postTripId
    };
  },
});