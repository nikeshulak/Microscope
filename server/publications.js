// posts
Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

//single posts
Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});

//comments
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

// now you can PostsTrip.find().count() in Itinerary page
Meteor.publish('postsTrip', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return PostsTrip.find({}, options);
});

//single post
Meteor.publish('singlePostTrip', function(id) {
  check(id, String);
  return PostsTrip.find(id);
});

//itinerary
Meteor.publish('itinerarys', function(postTripId) {
  check(postTripId, String);
  return Itinerarys.find({postId: postTripId});
});