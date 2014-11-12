// =============== Global Settings ==================

var ChatSettings = {
  APIURL: 'https://api.parse.com/1/classes/chatterbox',
  username: /username=(.+)/g.exec(window.location.search)[1],
  roomname: ''
};
$('#roomname').text(ChatSettings.roomname);

// =============== Room View ==================
var roomViews = {};
roomViews[''] = new RoomView({
  collection: new Room([], {
    roomname: ''
  })
});
var rv = roomViews[''];

$('#main-msg').empty();
$('#main-msg').append(rv.el);


var renderAll = function() {
  var getData;
  getData = {order: '-createdAt', limit: 30}
  if ( rv.collection.roomname !== '' ) {
    getData['where'] = {};
    getData['where']['roomname'] = rv.collection.roomname;
  }

  rv.collection.fetch({
    add: true,
    remove: false,
    merge: true,
    reset: false,
    data: getData,
    success: function() {
      rv.render();
    }
  });
};

renderAll();
window.setInterval(renderAll, 1000);

// =============== User Filter ==================

var uF1 = new UserFilters();
var uFV1 = new UserFiltersView({collection: uF1});
// uF1.add([
// {username: 'Dennis'},
// {username: 'Derek'}

//   ]);

$('#userFiltersContainer').append(uFV1.el);
