Template.postTripPage.helpers({
  itinerarys: function() {
    return Itinerarys.find({postTripId: this._id});
  }
});