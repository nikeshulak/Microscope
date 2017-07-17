// Comments = new Mongo.Collection('comments');

Comments = new orion.collection('comments', {
  singularName: 'comment', // The name of one of these items
  pluralName: 'comments', // The name of more than one of these items
  link: {
    // *
    //  * The text that you want to show in the sidebar.
    //  * The default value is the name of the collection, so
    //  * in this case it is not necessary.

    title: 'Comments' 
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
        //Posts is the parent
        //Comments is the child
        data: "postId", //data: "postId" is critical here because that's how val gets its value.
        title: "Post Title",
        //showing post title in comments index page instead of post id
        render: function (val, type, doc) {
          var postId = val;
          var postTitle = Posts.findOne(postId).title;
          return postTitle;
        }
      },
      {
        data: "body",
        title: "Comment",
        tmpl: Meteor.isClient && Template.commentsIndexBlurbCell 
        // /client/templates/orion/comments_index_blurb_cell.html
        /* remember that this code is in /lib, which runs on both the client and server, and Template isn't defined on the server. So that's why aldeed:meteor-tabular requires you to do this Meteor.isClient thing. */
      },
      /*{ 
        data: "submitted", 
        title: "Submitted" 
      },*/
      orion.attributeColumn('createdAt', 'submitted', 'FREEDOM!!!'),
      //Luckily, OrionJS comes with some pre-made templates. One of them happens to be called createdAt.
      //orion.attributeColumn('nameOfTemplate', 'keyNameOnYourObject', 'columnLabel')
    ]
  }
});

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });
    
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);

    if (!post)
      throw new Meteor.Error('invalid-comment', 'You must comment on a post');
    
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});
    
    // create the comment, save the id
    comment._id = Comments.insert(comment);
    
    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);
    
    return comment._id;
  }
});