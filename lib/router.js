Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment; 
  },
  findOptions: function() {
    // console.log(this.sort);
    return {
      sort: this.sort, 
      limit: this.postsLimit()};
  },
  subscriptions: function() {
    // console.log(this.findOptions());
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      posts: self.posts(),
      ready: self.postsSub.ready,
      nextPath: function() {
        if (self.posts().count() === self.postsLimit())
          return self.nextPath();
      }
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});

Router.route('/best/:postsLimit?', {name: 'bestPosts'});


//posts - single
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() { 
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/submit', {name: 'postSubmit'});

//postsTrip - list
PostsTripListController = RouteController.extend({
  template: 'postsTripList',
  increment: 5, 
  postsTripLimit: function() { 
    return parseInt(this.params.postsTripLimit) || this.increment; 
  },
  findOptions: function() {
    mysort = {submitted: -1, _id: -1};

    // console.log(mysort);//this.sort
    return {
      sort: mysort, //this.sort
      limit: this.postsTripLimit()
    };
  },
  subscriptions: function() {
    // console.log(this.findOptions());
    this.postsTripSub = Meteor.subscribe('postsTrip', this.findOptions());//postsTrip
  },
  postsTrip: function() {
    return PostsTrip.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      postsTrip: self.postsTrip(),
      ready: self.postsTripSub.ready,//postsTripSub
      nextPath: function() {
        if (self.postsTrip().count() === self.postsTripLimit())
          return self.nextPath();
      }
    };
  }
});

//postTripPage - single
Router.route('/trips/:_id', {
  name: 'postTripPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePostTrip', this.params._id),
      Meteor.subscribe('itinearys', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/trip', {
  name: 'trip',
  controller: PostsTripListController
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
