// Itinerarys = new Mongo.Collection('itinerarys');

Itinerarys = new orion.collection('itinerarys', {
  singularName: 'itinerary', // The name of one of these items
  pluralName: 'itinerarys', // The name of more than one of these items
  link: {
    // *
    //  * The text that you want to show in the sidebar.
    //  * The default value is the name of the collection, so
    //  * in this case it is not necessary.

    title: 'Itinerarys' 
  },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    // here we set which data columns we want to appear on the data table
    // in the CMS panel
    columns: [
      { 
        data: "userId", //author
        title: "Author",
        render: function(val, type, doc) {
          var userId = val;
          var userName = Meteor.users.findOne(userId);//.profile.name
          // console.log();

          if(userName)
            return userName.profile.name;
          else 
            return 'Ananomous';
        }
      },
      /*{ 
        data: "postId", 
        title: "Post ID" 
      },*/
      {
        //PostsTrip is the parent
        //Itinerarys is the child
        data: "postTripId", //data: "postTripId" is critical here because that's how val gets its value.
        title: "Trip Title",
        //showing postTrip title in itinerarys index page instead of postTrip id
        render: function (val, type, doc) {
          var postTripId = val;
          var postTripTitle = PostsTrip.findOne(postTripId);
          // console.log(PostsTripId);
          if(postTripTitle)
            return postTripTitle.title;
          else
            return 'Post Trip Title ' + postTripId;
        }
      },
      {
        data: "description",
        title: "Detailed Description",
        tmpl: Meteor.isClient && Template.itinerarysIndexBlurbCell // /client/templates/orion/itinerarys_index_blurb_cell.html

        /* remember that this code is in /lib, which runs on both the client and server, and Template isn't defined on the server. So that's why aldeed:meteor-tabular requires you to do this Meteor.isClient thing. */
      },

      { 
        data: "submitted", 
        title: "Submitted" 
      },

      /*orion.attributeColumn('createdAt', 'submitted', 'FREEDOM!!!'),
      //Luckily, OrionJS comes with some pre-made templates. One of them happens to be called createdAt.
      //orion.attributeColumn('nameOfTemplate', 'keyNameOnYourObject', 'columnLabel')*/
    ]
  }
});

Meteor.methods({
  itineraryInsert: function(itineraryAttributes) {
    check(this.userId, String);
    check(itineraryAttributes, {
      postTripId: String,
      description: String
    });
    
    var user = Meteor.user();
    var postTrip = PostsTrip.findOne(itineraryAttributes.postTripId);

    if (!postTrip)
      throw new Meteor.Error('invalid-itinerary', 'You must itinerary on a postTrip');
    
    itinerary = _.extend(itineraryAttributes, {
      userId: user._id,
      // author: user.username,
      submitted: new Date()
    });
    
    // update the post with the number of itinerarys
    // PostsTrip.update(itinerary.postId, {$inc: {itinerarysCount: 1}});
    
    // create the itinerary, save the id
    itinerary._id = Itinerarys.insert(itinerary);
    
    // now create a notification, informing the user that there's been a itinerary
    createItinerarysNotification(itinerary);
    
    return itinerary._id;
  }
});