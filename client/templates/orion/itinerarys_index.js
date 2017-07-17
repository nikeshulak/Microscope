//PostsTrip.findOne(), PostsTrip.find().count in Comments page (google chrome console) gives result now
ReactiveTemplates.onCreated('collections.itinerarys.index', function() {

  this.subscribe('postsTrip', {sort: {submitted: -1, _id: -1}, limit: 0});

});